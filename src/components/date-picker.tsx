'use client';

import * as React from 'react';
import { ChevronDownIcon } from 'lucide-react';

import { Button } from '~/components/ui/button';
import { Calendar } from '~/components/ui/calendar';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover';

interface DateTimePickerProps {
  value?: Date;
  onChange?: (date: Date) => void;
  dateLabel?: string;
  timeLabel?: string;
  id?: string;
}

export function DateTimePicker({
  value,
  onChange,
  dateLabel = 'Date',
  timeLabel = 'Time',
  id,
}: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(value);
  const [time, setTime] = React.useState<string>(
    value ? value.toTimeString().slice(0, 5) : '10:30',
  );

  // Update internal state when value prop changes
  React.useEffect(() => {
    if (value) {
      setDate(value);
      setTime(value.toTimeString().slice(0, 5));
    }
  }, [value]);

  const handleDateChange = (newDate: Date | undefined) => {
    if (newDate) {
      const timeParts = time.split(':').map(Number);
      const hours = timeParts[0] || 0;
      const minutes = timeParts[1] || 0;
      newDate.setHours(hours, minutes, 0, 0);
      setDate(newDate);
      onChange?.(newDate);
      setOpen(false);
    }
  };

  const handleTimeChange = (newTime: string) => {
    setTime(newTime);
    if (date) {
      const timeParts = newTime.split(':').map(Number);
      const hours = timeParts[0] || 0;
      const minutes = timeParts[1] || 0;
      const updatedDate = new Date(date);
      updatedDate.setHours(hours, minutes, 0, 0);
      setDate(updatedDate);
      onChange?.(updatedDate);
    }
  };

  return (
    <div className="flex gap-4">
      <div className="flex flex-col gap-3">
        <Label htmlFor={`date-${id}`} className="px-1">
          {dateLabel}
        </Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id={`date-${id}`}
              className="w-32 justify-between font-normal"
            >
              {date ? date.toLocaleDateString() : 'Select date'}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              onSelect={handleDateChange}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex flex-col gap-3">
        <Label htmlFor={`time-${id}`} className="px-1">
          {timeLabel}
        </Label>
        <Input
          type="time"
          id={`time-${id}`}
          step="1"
          value={time}
          onChange={(e) => handleTimeChange(e.target.value)}
          className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
        />
      </div>
    </div>
  );
}
