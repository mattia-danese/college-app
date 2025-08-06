'use client';

import { useNextCalendarApp, ScheduleXCalendar } from '@schedule-x/react';
import {
  createViewWeek,
  createViewMonthGrid,
  type CalendarEventExternal,
} from '@schedule-x/calendar';

import '@schedule-x/theme-default/dist/calendar.css';
import '@schedule-x/theme-default/dist/index.css';

import { createEventModalPlugin } from '@schedule-x/event-modal';
import { createDragAndDropPlugin } from '@schedule-x/drag-and-drop';
import { createEventsServicePlugin } from '@schedule-x/events-service';
import { useEffect, useRef, useState } from 'react';

type CalendarProps = {
  userId: number;
  events: CalendarEventExternal[];
};

function Calendar({ userId, events }: CalendarProps) {
  const eventsServiceRef = useRef<ReturnType<
    typeof createEventsServicePlugin
  > | null>(null);

  if (!eventsServiceRef.current) {
    eventsServiceRef.current = createEventsServicePlugin();
  }

  const calendar = useNextCalendarApp({
    views: [createViewWeek(), createViewMonthGrid()],
    defaultView: 'month-grid',
    plugins: [
      createEventModalPlugin(),
      createDragAndDropPlugin(),
      eventsServiceRef.current,
    ],
  });

  useEffect(() => {
    if (!eventsServiceRef.current) return;

    eventsServiceRef.current.set(events);
  }, [events]);

  return <ScheduleXCalendar calendarApp={calendar} />;
}

export default Calendar;
