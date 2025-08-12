'use client';

import {
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';

import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { MultiCombobox } from '~/components/ui/combobox';
import { useState, useMemo } from 'react';
import { X } from 'lucide-react';

import type { Status } from './SupplementsDashboardColumns';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  listOptions: { value: string; label: string }[];
}

export function SupplementsDashboardDataTable<TData, TValue>({
  columns,
  data,
  listOptions,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [selectedLists, setSelectedLists] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedApplicationTypes, setSelectedApplicationTypes] = useState<
    string[]
  >([]);

  const statusOptions = (
    ['Completed', 'In Progress', 'Planned', 'Not Planned'] satisfies Status[]
  ).map((status) => ({
    value: status,
    label: status,
  }));

  const applicationTypeOptions = [
    { value: 'RD', label: 'RD' },
    { value: 'EA', label: 'EA' },
    { value: 'ED', label: 'ED' },
    { value: 'ED2', label: 'ED2' },
  ];

  // Filter data based on selected lists, statuses, and application types
  const filteredData = useMemo(() => {
    let filtered = data;

    // Filter by lists
    if (selectedLists.length > 0) {
      filtered = filtered.filter((item: any) =>
        selectedLists.includes(item.list_name),
      );
    }

    // Filter by statuses
    if (selectedStatuses.length > 0) {
      filtered = filtered.filter((item: any) =>
        selectedStatuses.includes(item.status),
      );
    }

    // Filter by application types
    if (selectedApplicationTypes.length > 0) {
      filtered = filtered.filter((item: any) =>
        selectedApplicationTypes.includes(item.application_type),
      );
    }

    return filtered;
  }, [data, selectedLists, selectedStatuses, selectedApplicationTypes]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return (
      selectedLists.length > 0 ||
      selectedStatuses.length > 0 ||
      selectedApplicationTypes.length > 0 ||
      (table.getColumn('school_name')?.getFilterValue() as string)?.length > 0
    );
  }, [
    selectedLists.length,
    selectedStatuses.length,
    selectedApplicationTypes.length,
    table,
  ]);

  // Reset all filters
  const resetFilters = () => {
    setSelectedLists([]);
    setSelectedStatuses([]);
    setSelectedApplicationTypes([]);
    table.getColumn('school_name')?.setFilterValue('');
  };

  return (
    <div>
      <div className="flex items-center gap-4 py-4">
        <Input
          id="dashboard-supplements-filter"
          name="dashboard-supplements-filter"
          placeholder="Filter by school name..."
          value={
            (table.getColumn('school_name')?.getFilterValue() as string) ?? ''
          }
          onChange={(event) =>
            table.getColumn('school_name')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <MultiCombobox
          options={listOptions}
          selectedValues={selectedLists}
          onSelectionChange={setSelectedLists}
          placeholder="Filter by lists..."
          emptyText="No lists found."
          buttonText="Lists"
          concise={true}
        />
        <MultiCombobox
          options={statusOptions}
          selectedValues={selectedStatuses}
          onSelectionChange={setSelectedStatuses}
          placeholder="Filter by status..."
          emptyText="No statuses found."
          buttonText="Status"
          concise={true}
        />
        <MultiCombobox
          options={applicationTypeOptions}
          selectedValues={selectedApplicationTypes}
          onSelectionChange={setSelectedApplicationTypes}
          placeholder="Filter by application type..."
          emptyText="No application types found."
          buttonText="App. Type"
          concise={true}
        />
        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={resetFilters}
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
          >
            Reset
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
