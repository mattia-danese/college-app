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

export default function CalendarClient() {
  const [selectedListIds, setSelectedListIds] = useState<number[]>([]);

  const user = useUserStore((s) => s.user);

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
          <Calendar userId={user.id} events={calendarEventsToDisplay} />
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
