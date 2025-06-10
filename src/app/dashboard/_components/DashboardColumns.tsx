'use client';

import { type ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, ArrowUpDown } from 'lucide-react';

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

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type DashboardSupplementRow = {
  id: string;
  school_name: string;
  list_name: string;
  application_type: string;
  deadline: Date;
  supplement_title: string;
  complete_by: Date;
  status: 'Completed' | 'In Progress' | 'Planned';
};

export const columns: ColumnDef<DashboardSupplementRow>[] = [
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
  },
  {
    accessorKey: 'list_name',
    header: 'List',
  },
  {
    accessorKey: 'application_type',
    header: 'Application Type',
  },
  {
    accessorKey: 'deadline',
    header: () => <div>Deadline</div>,
    cell: ({ row }) => {
      const date = format(row.getValue('deadline'), 'MM-dd-yyyy');
      return <div className="font-medium">{date}</div>;
    },
  },
  {
    accessorKey: 'supplement_title',
    header: 'Supplement Title',
  },
  {
    accessorKey: 'complete_by',
    header: () => <div>Complete By</div>,
    cell: ({ row }) => {
      const date = format(row.getValue('complete_by'), 'MM-dd-yyyy');
      return <div className="font-medium">{date}</div>;
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
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
