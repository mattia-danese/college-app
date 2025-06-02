'use client'
 
import { useNextCalendarApp, ScheduleXCalendar } from '@schedule-x/react'
import { createViewWeek, createViewMonthGrid, type CalendarEventExternal } from "@schedule-x/calendar";

import '@schedule-x/theme-default/dist/calendar.css'
import '@schedule-x/theme-default/dist/index.css'

import { createEventModalPlugin } from '@schedule-x/event-modal'
import { createDragAndDropPlugin } from '@schedule-x/drag-and-drop'
import { createEventsServicePlugin } from '@schedule-x/events-service'
import { useEffect, useRef, useState } from 'react';

type CalendarProps = {
  userId: number
  events: CalendarEventExternal[]
}

function CalendarApp({ userId, events }: CalendarProps) {    
    const eventsServiceRef = useRef<ReturnType<typeof createEventsServicePlugin> | null>(null)

    if (!eventsServiceRef.current) {
        eventsServiceRef.current = createEventsServicePlugin();
    }

    const calendar = useNextCalendarApp({
        views: [createViewWeek(), createViewMonthGrid()],
        plugins: [
            createEventModalPlugin(),
            createDragAndDropPlugin(),
            eventsServiceRef.current
        ],
    })

    console.log('PASSED EVENTS', events)

    useEffect(() => {
        if (!eventsServiceRef.current) return;

        eventsServiceRef.current.set(events);
    }, [events]);

    return (
        <div>
            <div>THIS IS THE CALENDAR</div>
            <ScheduleXCalendar calendarApp={calendar} />
        </div>
    )
}

export default CalendarApp