'use client';

import { type ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, ArrowUpDown } from 'lucide-react';

import { Button } from '~/components/ui/button';
import { format } from 'date-fns';
import { SingleCombobox } from '~/components/ui/combobox';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export type Status = 'Completed' | 'In Progress' | 'Planned' | 'Not Planned';

export type SchoolsDashboardRow = {
  id: string;
  school_name: string;
  list_name: string;
  application_type: string;
  deadline: Date;
  deadline_id: number;
  num_supplements: number;
};

export const columns = (
  handleCreateList: (name: string) => Promise<any>,
  handleUpdateListEntry: (
    school_id: number,
    list_id: number,
    deadline_id: number,
    schoolName: string,
    showToast: boolean,
  ) => void,
  lists: { id: string; name: string }[],
): ColumnDef<SchoolsDashboardRow>[] => [
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
    cell: ({ row }) => {
      return (
        <SingleCombobox
          options={lists}
          placeholder="Select a list"
          selectedValue={row.original.list_name}
          onSelectionChange={(value) => {
            const selectedList = lists.find((l) => l.name === value);

            // If the list doesn't exist, it means it's a newly created list
            // The handleCreate callback will handle the list creation
            if (!selectedList) {
              return;
            }

            handleUpdateListEntry(
              Number(row.original.id),
              Number(selectedList.id),
              Number(row.original.deadline_id),
              row.original.school_name,
              true,
            );
          }}
          doesCreate={true}
          handleCreate={async (name) => {
            const result = await handleCreateList(name);
            if (result) {
              handleUpdateListEntry(
                Number(row.original.id),
                result.id,
                Number(row.original.deadline_id),
                row.original.school_name,
                false,
              );
            }
          }}
        />
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
