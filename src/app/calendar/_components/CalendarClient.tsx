'use client';

import Calendar from './Calendar';
import CalendarCompanion from './CalendarCompanion';
import { useEffect, useMemo, useState } from 'react';
import { Checkbox } from '~/components/ui/checkbox';
import { api } from '~/trpc/react';
import { Label } from '~/components/ui/label';

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

  const handleCheckboxChange = (
    listId: number,
    checked: boolean | 'indeterminate',
  ) => {
    const isChecked = checked === true;
    if (isChecked) {
      // Add the id
      setSelectedListIds((prev) =>
        prev.includes(listId) ? prev : [...prev, listId],
      );
    } else {
      // Remove the id
      setSelectedListIds((prev) => prev.filter((id) => id !== listId));
    }
  };

  // potentially show spinner or skeleton
  if (!user) return null;

  return (
    <div>
      <div className="flex items-start gap-3">
        {userLists.map((list) => (
          <div key={list.id} className="flex items-center gap-3">
            <Checkbox
              id={list.id.toString()}
              value={list.name}
              checked={selectedListIds.includes(list.id)}
              onCheckedChange={(checked) =>
                handleCheckboxChange(list.id, checked)
              }
            />
            <Label htmlFor={list.id.toString()}>{list.name}</Label>
          </div>
        ))}
      </div>

      <CalendarCompanion
        userId={user.id}
        supplements={supplementsToDisplay}
        onEventChange={async () => {
          await refetchSupplements();
          await refetchCalendarEvents();
        }}
      />

      <Calendar userId={user.id} events={calendarEventsToDisplay} />
    </div>
  );
}
