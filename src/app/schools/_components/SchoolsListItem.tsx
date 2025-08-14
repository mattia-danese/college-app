'use client';

import Spinner from '~/app/_components/Spinner';
import { Card, CardContent } from '~/components/ui/card';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';

import { Button } from '~/components/ui/button';
import { X } from 'lucide-react';
import { useState } from 'react';

interface SchoolsListItemProps {
  id: number;
  name: string;
  city: string;
  state: string;
  size: number;
  tuition: number;
  acceptance_rate: string;
  deadlines: {
    id: number;
    application_type: string;
    date: Date;
  }[];
  supplementsCount: number;

  lists: {
    id: number;
    name: string;
  }[];
  selectedListId: number | null;
  selectedDeadlineId: number | null;
  listEntryId: number | null;
  onListEntryChange: (
    school_id: number,
    list_id: number,
    deadline_id: number,
    school_name: string,
  ) => void;
  onRemoveSchoolFromList: (
    school_id: number,
    list_entry_id: number,
    school_name: string,
    list_id: number,
  ) => void;
  disabled: boolean;
}

export default function SchoolsListItem({
  id,
  name,
  city,
  state,
  size,
  tuition,
  acceptance_rate,
  deadlines,
  supplementsCount,

  lists,
  selectedListId,
  selectedDeadlineId,
  listEntryId,
  onListEntryChange,
  onRemoveSchoolFromList,
  disabled,
}: SchoolsListItemProps) {
  const [selectList, setSelectList] = useState(selectedListId);
  const [selectDeadline, setSelectDeadline] = useState(selectedDeadlineId);

  return (
    <Card key={id} className="mb-4">
      <CardContent className="p-4 grid grid-cols-2 gap-4">
        <div>
          <div className="font-bold text-lg">{name}</div>
          <div>
            {city}, {state}
          </div>
          <div>Size: {size.toLocaleString()}</div>
          <div>Tuition: ${tuition.toLocaleString()}</div>
          <div>
            Acceptance Rate: {(Number(acceptance_rate) * 100).toFixed(2)}%
          </div>
        </div>
        <div className="flex flex-col justify-end items-start">
          <div>
            Deadlines:{' '}
            {deadlines.map((deadline) => (
              <div key={deadline.id}>
                {deadline.application_type} -{' '}
                {new Date(deadline.date).toLocaleDateString()}
              </div>
            ))}
          </div>
          <div># of Supplements: {supplementsCount}</div>
        </div>

        <div className="flex items-center gap-2">
          <Select
            onValueChange={(item) => {
              setSelectList(parseInt(item));
              if (selectDeadline === null) return;
              onListEntryChange(id, parseInt(item), selectDeadline, name);
            }}
            value={selectList?.toString() ?? ''}
          >
            <SelectTrigger className="w-[180px]" disabled={disabled}>
              {disabled ? (
                <Spinner />
              ) : (
                <SelectValue placeholder="Add to a List" />
              )}
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Your Lists</SelectLabel>
                {lists.map((list) => (
                  <SelectItem key={list.id} value={list.id.toString()}>
                    {list.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select
            onValueChange={(item) => {
              setSelectDeadline(parseInt(item));
              if (selectList === null) return;
              onListEntryChange(id, selectList, parseInt(item), name);
            }}
            value={selectDeadline?.toString() ?? ''}
          >
            <SelectTrigger className="w-[180px]" disabled={disabled}>
              {disabled ? (
                <Spinner />
              ) : (
                <SelectValue placeholder="Pick a app. type" />
              )}
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Deadlines</SelectLabel>
                {deadlines.map((deadline) => (
                  <SelectItem key={deadline.id} value={deadline.id.toString()}>
                    {deadline.application_type}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {selectedListId !== null && !disabled && (
            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-foreground"
              onClick={() => {
                setSelectList(null);
                setSelectDeadline(null);
                onRemoveSchoolFromList(id, listEntryId!, name, selectedListId!);
              }}
            >
              Remove
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
