'use client';

import { type ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, ArrowUpDown, CalendarPlus } from 'lucide-react';

import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';

import { format } from 'date-fns';
import { Input } from '~/components/ui/input';
import { Card, CardContent, CardHeader } from '~/components/ui/card';
import { Label } from '~/components/ui/label';
import { DateTimePicker } from '~/components/date-picker';
import { Textarea } from '~/components/ui/textarea';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import { useState } from 'react';
import { CalendarEventStatusSelect } from '~/components/CalendarEventStatusSelect';
import type { CalendarEventStatus } from '~/server/db/types';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export type SupplementsDashboardRow = {
  id: string;
  school_name: string;
  list_name: string;
  application_type: 'RD' | 'EA' | 'ED' | 'ED2';
  deadline: Date;
  supplement_prompt: string;
  event_start: Date | null;
  event_end: Date | null;
  status: CalendarEventStatus | null;
};

export const columns = (
  handleCreateEvent: (
    supplement_id: number,
    title: string,
    description: string,
    start: Date,
    end: Date,
    status: CalendarEventStatus,
  ) => void,
): ColumnDef<SupplementsDashboardRow>[] => [
  {
    accessorKey: 'school_name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          School
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="max-w-[200px] break-words whitespace-normal">
          {row.getValue('school_name')}
        </div>
      );
    },
  },
  {
    accessorKey: 'list_name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          List
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'application_type',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          App. Type
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'deadline',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Deadline
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = format(row.getValue('deadline'), 'MM-dd-yyyy');
      return <div className="font-medium">{date}</div>;
    },
  },
  {
    accessorKey: 'supplement_prompt',
    header: 'Supplement Prompt',
    cell: ({ row }) => {
      return (
        <div className="max-w-[200px] break-words whitespace-normal">
          {row.getValue('supplement_prompt')}
        </div>
      );
    },
  },
  {
    accessorKey: 'event_end',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Complete By
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.getValue('event_end') as Date | null;

      //   if (date) {
      //     return <div className="font-medium">{format(date, 'MM-dd-yyyy')}</div>;
      //   }

      const initialDescription =
        `Prompt: ${row.original.supplement_prompt}\n\n` +
        `Description: ${row.original.supplement_prompt}\n\n` +
        `Word Count: ${row.original.supplement_prompt}\n`;

      const initialTitle = `${row.original.school_name} Supplement`;

      const [title, setTitle] = useState(initialTitle);
      const [description, setDescription] = useState(initialDescription);
      const [start, setStart] = useState<Date>(
        row.original.event_start ?? new Date(),
      );
      const [end, setEnd] = useState<Date>(
        row.original.event_end ?? new Date(),
      );
      const [status, setStatus] = useState<CalendarEventStatus>(
        row.original.status ?? 'planned',
      );

      return (
        <div>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                {date ? (
                  <div className="flex items-center gap-2">
                    {format(date, 'MM-dd-yyyy')}
                  </div>
                ) : (
                  <>
                    Create Event <CalendarPlus className="h-4 w-4" />{' '}
                  </>
                )}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {date ? 'Update Calendar Event' : 'Create Calendar Event'}
                </DialogTitle>
                <DialogDescription>
                  {date
                    ? 'Update the event for this supplement.'
                    : 'Create an event for this supplement and add it to your calendar.'}
                </DialogDescription>
              </DialogHeader>
              {/* <div className="text-xl font-semibold">Create Calendar Event</div> */}
              <div className="mb-4">
                <Label
                  htmlFor={`event-title-${row.original.id}`}
                  className="mb-1 block"
                >
                  Event Title
                </Label>
                <Input
                  id={`event-title-${row.original.id}`}
                  placeholder="Event Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <DateTimePicker
                  id={`start-${row.original.id}`}
                  value={start}
                  onChange={setStart}
                  dateLabel="Start Date"
                  timeLabel="Time"
                />
              </div>
              <div className="mb-4">
                <DateTimePicker
                  id={`end-${row.original.id}`}
                  value={end}
                  onChange={setEnd}
                  dateLabel="End Date"
                  timeLabel="Time"
                />
              </div>
              <div className="mb-4">
                <Label
                  htmlFor={`desc-${row.original.id}`}
                  className="mb-1 block"
                >
                  Event Description
                </Label>
                <Textarea
                  id={`desc-${row.original.id}`}
                  value={description}
                  rows={initialDescription.split('\n').length}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="space-y-2 w-fit mb-4">
                <Label>Event Status</Label>
                <CalendarEventStatusSelect
                  value={status}
                  onChange={setStatus}
                />
              </div>
              <Button
                onClick={() =>
                  handleCreateEvent(
                    Number(row.original.id),
                    title,
                    description,
                    start,
                    end,
                    status,
                  )
                }
              >
                {date ? 'Update Event' : 'Create Event'}
              </Button>
            </DialogContent>
          </Dialog>
        </div>
      );
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const [status, setStatus] = useState<CalendarEventStatus>(
        row.original.status as CalendarEventStatus,
      );

      return (
        <CalendarEventStatusSelect
          value={status ?? 'not_planned'}
          onChange={(value) => {
            setStatus(value);

            handleCreateEvent(
              Number(row.original.id),
              row.original.school_name,
              row.original.supplement_prompt,
              row.original.event_start!,
              row.original.event_end!,
              value,
            );
          }}
          disabled={status === null}
        />
      );
    },
  },

  //   {
  //     accessorKey: 'amount',
  //     header: () => <div className="text-right">Amount</div>,
  //     cell: ({ row }) => {
  //       const amount = parseFloat(row.getValue('amount'));
  //       const formatted = new Intl.NumberFormat('en-US', {
  //         style: 'currency',
  //         currency: 'USD',
  //       }).format(amount);

  //       return <div className="text-right font-medium">{formatted}</div>;
  //     },
  //   },
  //   {
  //     id: 'actions',
  //     cell: ({ row }) => {
  //       const payment = row.original;

  //       return (
  //         <DropdownMenu>
  //           <DropdownMenuTrigger asChild>
  //             <Button variant="ghost" className="h-8 w-8 p-0">
  //               <span className="sr-only">Open menu</span>
  //               <MoreHorizontal className="h-4 w-4" />
  //             </Button>
  //           </DropdownMenuTrigger>
  //           <DropdownMenuContent align="end">
  //             <DropdownMenuLabel>Actions</DropdownMenuLabel>
  //             <DropdownMenuItem
  //               onClick={() => navigator.clipboard.writeText(payment.id)}
  //             >
  //               Copy payment ID
  //             </DropdownMenuItem>
  //             <DropdownMenuSeparator />
  //             <DropdownMenuItem>View customer</DropdownMenuItem>
  //             <DropdownMenuItem>View payment details</DropdownMenuItem>
  //           </DropdownMenuContent>
  //         </DropdownMenu>
  //       );
  //     },
  //   },
];
