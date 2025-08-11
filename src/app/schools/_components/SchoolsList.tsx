'use client';
import { Input } from '~/components/ui/input';
import SchoolsListItem from './SchoolsListItem';

interface SchoolsListProps {
  schools: {
    id: number;
    name: string;
    city: string;
    state: string;
    size: number;
    tuition: number;
    acceptance_rate: string;
    deadlines: {
      id: number;
      application_type: 'RD' | 'EA' | 'ED' | 'ED2';
      date: Date;
    }[];
    supplementsCount: number;
    list_id: number | null;
    list_entry_id: number | null;
  }[];
  lists: {
    id: number;
    name: string;
  }[];
  onSelectListChange: (
    school_id: number,
    list_id: number,
    school_name: string,
  ) => void;
  onRemoveSchoolFromList: (
    school_id: number,
    list_entry_id: number,
    school_name: string,
    list_id: number,
  ) => void;
  updatingSchoolId: number | null;
  query: string;
  onQueryChange: (value: string) => void;
}

export default function SchoolsList({
  schools,
  lists,
  onSelectListChange,
  onRemoveSchoolFromList,
  updatingSchoolId,
  query,
  onQueryChange,
}: SchoolsListProps) {
  if (schools.length === 0) {
    return (
      <div className="p-4 max-w-2xl mx-auto w-[60vw] flex flex-col min-h-screen">
        <Input
          placeholder="Search schools..."
          value={query}
          onChange={(e) => {
            onQueryChange(e.target.value);
          }}
          className="mb-4"
        />
        <div className="text-center text-muted-foreground mt-8">
          No schools found.
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-2xl mx-auto w-[60vw] flex flex-col min-h-screen">
      <Input
        placeholder="Search schools..."
        value={query}
        onChange={(e) => {
          onQueryChange(e.target.value);
        }}
        className="mb-4"
      />

      {schools.length === 0 ? (
        <div className="text-center text-muted-foreground mt-8">
          No schools found.
        </div>
      ) : (
        schools.map((school) => (
          <SchoolsListItem
            key={school.id}
            id={school.id}
            name={school.name}
            city={school.city}
            state={school.state}
            size={school.size}
            tuition={school.tuition}
            acceptance_rate={school.acceptance_rate}
            deadlines={school.deadlines}
            supplementsCount={school.supplementsCount}
            lists={lists}
            selectedListId={school.list_id}
            listEntryId={school.list_entry_id}
            onSelectListChange={onSelectListChange}
            onRemoveSchoolFromList={onRemoveSchoolFromList}
            disabled={updatingSchoolId === school.id}
          />
        ))
      )}
    </div>
  );
}
