'use client';

import { type ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, ArrowUpDown } from 'lucide-react';

import { Button } from '~/components/ui/button';
import { format } from 'date-fns';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export type Status = 'Completed' | 'In Progress' | 'Planned' | 'Not Planned';

export type SchoolsDashboardRow = {
  id: string;
  school_name: string;
  list_name: string;
  application_type: string;
  deadline: Date;
  num_supplements: number;
};

export const columns: ColumnDef<SchoolsDashboardRow>[] = [
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
    accessorKey: 'num_supplements',
    header: '# Supplements',
    cell: ({ row }) => {
      return (
        <div className="max-w-[200px] break-words whitespace-normal">
          {row.getValue('num_supplements')}
        </div>
      );
    },
  },
];
