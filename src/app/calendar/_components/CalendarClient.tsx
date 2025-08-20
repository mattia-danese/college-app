'use client';

import Calendar from './Calendar';
import CalendarCompanion from './CalendarCompanion';
import { useEffect, useMemo, useState } from 'react';
import { api } from '~/trpc/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { MultiCombobox } from '~/components/ui/combobox';

import type { CalendarEventExternal } from '@schedule-x/calendar';
import { format, isEqual } from 'date-fns';

import { useUserStore } from '~/stores/useUserStore';
import type { CalendarEventStatus } from '~/server/db/types';

export default function CalendarClient() {
  const [selectedListIds, setSelectedListIds] = useState<number[]>([]);

  const user = useUserStore((s) => s.user);
  const utils = api.useUtils();

  const { data: userLists = [], isLoading: isListsLoading } =
    api.lists.get_by_user.useQuery(
      {
        user_id: user?.id ?? 0,
      },
      {
        enabled: !!user?.id,
      },
    );

  const {
    data: calendarEvents,
    isLoading: isCalendarEventsLoading,
    refetch: refetchCalendarEvents,
  } = api.calendar_events.get_by_user.useQuery(
    {
      user_id: user?.id ?? 0,
    },
    {
      enabled: !!user?.id,
    },
  );

  const {
    data: supplementsWithoutEvents = {},
    isLoading: isSupplementsWithoutEvents,
    refetch: refetchSupplements,
  } = api.calendar_events.get_supplements_without_events_by_user.useQuery(
    {
      user_id: user?.id ?? 0,
    },
    {
      enabled: !!user?.id,
    },
  );

  // Extract unique list names from data
  const listOptions = useMemo(() => {
    const uniqueLists = Array.from(new Set(userLists.map((list) => list.name)));
    return uniqueLists.map((listName) => ({
      id: listName,
      name: listName,
    }));
  }, [userLists]);

  // Set all as selected when lists load
  useEffect(() => {
    if (userLists.length > 0 && selectedListIds.length === 0) {
      setSelectedListIds(userLists.map((list) => list.id));
    }
  }, [userLists]);

  const calendarEventsToDisplay: CalendarEventExternal[] =
    selectedListIds.flatMap((list_id) =>
      (calendarEvents?.[list_id]?.events ?? []).map((event) => ({
        id: event.event_id,
        title: event.event_title,
        start: isEqual(event.event_start, event.event_end)
          ? format(event.event_start, 'yyyy-MM-dd')
          : format(event.event_start, 'yyyy-MM-dd HH:mm'),
        end: isEqual(event.event_start, event.event_end)
          ? format(event.event_end, 'yyyy-MM-dd')
          : format(event.event_end, 'yyyy-MM-dd HH:mm'),
        description: event.event_description ?? undefined,
      })),
    );

  const supplementsToDisplay = useMemo(() => {
    const result: (typeof supplementsWithoutEvents)[number] = {};

    selectedListIds.forEach((list_id) => {
      const schoolMap = supplementsWithoutEvents[list_id];
      if (!schoolMap) return;
      Object.values(schoolMap).forEach((school) => {
        result[school.school_id] = school;
      });
    });

    return result;
  }, [selectedListIds, supplementsWithoutEvents]);

  const handleListSelectionChange = (selectedListNames: string[]) => {
    const selectedIds = userLists
      .filter((list) => selectedListNames.includes(list.name))
      .map((list) => list.id);
    setSelectedListIds(selectedIds);
  };

  const updateEvent = api.calendar_events.update.useMutation();
  const handleEventUpdateOnDrag = async (
    event_id: number,
    event_start: string,
    event_end: string,
  ) => {
    const newStartDate = new Date(event_start.replace(' ', 'T'));
    const newEndDate = new Date(event_end.replace(' ', 'T'));

    // Optimistically update the cache
    utils.calendar_events.get_by_user.setData(
      { user_id: user!.id },
      (oldData) => {
        if (!oldData) return oldData;

        const newData = { ...oldData };

        // Find the list containing the event and update it
        for (const listId of Object.keys(newData)) {
          const listEvents = newData[Number(listId)];
          if (listEvents?.events) {
            const eventIndex = listEvents.events.findIndex(
              (event) => event.event_id === event_id,
            );

            if (eventIndex === -1) continue;

            // Create a new array with the updated event
            const updatedEvents = [...listEvents.events];
            const originalEvent = updatedEvents[eventIndex];
            if (originalEvent) {
              updatedEvents[eventIndex] = {
                event_id: originalEvent.event_id,
                event_title: originalEvent.event_title,
                event_description: originalEvent.event_description,
                event_start: newStartDate,
                event_end: newEndDate,
                supplement_id: originalEvent.supplement_id,
                deadline_id: originalEvent.deadline_id,
              };
              newData[Number(listId)] = {
                ...listEvents,
                events: updatedEvents,
              };

              break;
            }
          }
        }

        return newData;
      },
    );

    try {
      await updateEvent.mutateAsync({
        event_id: event_id,
        event_start: newStartDate,
        event_end: newEndDate,
      });
    } catch (error) {
      // If the API call fails, invalidate the query to revert the optimistic update
      utils.calendar_events.get_by_user.invalidate({ user_id: user!.id });
      console.error('Failed to update event:', error);
    }
  };

  // potentially show spinner or skeleton
  if (!user) return null;

  return (
    <div className="flex flex-col items-center min-h-screen py-8">
      <Tabs defaultValue="calendar" className="w-full max-w-6xl">
        <div className="flex justify-center mb-6">
          <TabsList className="grid grid-cols-2 w-80">
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="schedule">Schedule Events</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="calendar" className="w-full">
          <div className="flex items-start gap-3 mb-6">
            <MultiCombobox
              options={listOptions}
              selectedValues={userLists
                .filter((list) => selectedListIds.includes(list.id))
                .map((list) => list.name)}
              onSelectionChange={handleListSelectionChange}
              placeholder="Filter by lists..."
              emptyText="No lists found."
              buttonText="Lists"
              concise={false}
            />
          </div>
          <Calendar
            userId={user.id}
            events={calendarEventsToDisplay}
            onEventUpdateOnDrag={handleEventUpdateOnDrag}
          />
        </TabsContent>

        <TabsContent value="schedule" className="w-full">
          <CalendarCompanion
            userId={user.id}
            supplements={supplementsToDisplay}
            onEventChange={async () => {
              await refetchSupplements();
              await refetchCalendarEvents();
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
