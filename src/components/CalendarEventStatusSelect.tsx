'use client';

import * as React from 'react';

import { Badge } from '~/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import {
  calendarEventStatusOptions,
  statusDisplayMap,
  type CalendarEventStatus,
} from '~/server/db/types';

interface CalendarEventStatusSelectProps {
  value: CalendarEventStatus;
  onChange: (value: CalendarEventStatus) => void;
  disabled?: boolean;
}

export function CalendarEventStatusSelect({
  value,
  onChange,
  disabled,
}: CalendarEventStatusSelectProps) {
  const selectedStatus = calendarEventStatusOptions.find(
    (status) => status === value,
  );

  return (
    <div className="space-y-2 w-fit">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full" disabled={disabled}>
          <SelectValue>
            {selectedStatus && (
              <Badge variant="outline" className="flex items-center gap-1">
                <span>{statusDisplayMap[selectedStatus]}</span>
              </Badge>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Event Status</SelectLabel>
            {calendarEventStatusOptions.map((status) => (
              <SelectItem key={status} value={status}>
                <Badge variant="outline" className="flex items-center gap-1">
                  <span>{statusDisplayMap[status]}</span>
                </Badge>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
