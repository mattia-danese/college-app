'use client';

import { useEffect, useState } from 'react';
import { Input } from '~/components/ui/input';
import { Card, CardContent } from '~/components/ui/card';
import { api } from '~/trpc/react';

import { useDebounce } from './useDebounce';
import Spinner from './Spinner';
import {
  useUser,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from '@clerk/nextjs';
import { Lists } from './Lists';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { toast } from 'sonner';

export function MainPage() {
  const [query, setQuery] = useState('');
  const [currentOffset, setCurrentOffset] = useState(0);

  const debouncedQuery = useDebounce(query, 300);

  const { data: schools, isLoading } = api.schools.get_paginated.useQuery({
    limit: 10,
    offset: currentOffset,
    query: debouncedQuery?.trim() === '' ? undefined : debouncedQuery,
  });

  const { isLoaded, isSignedIn, user } = useUser();

  const userEmail = user?.emailAddresses[0]?.emailAddress;

  const { data: userObj, isLoading: isUserLoading } = api.users.get.useQuery(
    { email: userEmail! },
    {
      enabled: isLoaded && isSignedIn && !!userEmail,
    },
  );

  const { data: userLists, isLoading: isListsLoading } =
    api.lists.get_by_user.useQuery(
      {
        user_id: userObj?.id ?? 0,
      },
      {
        enabled: !!userObj,
      },
    );

  const createListEntry = api.list_entries.create.useMutation();
  const [selectedLists, setSelectedLists] = useState<Record<number, number>>(
    {},
  ); // school.id => list.id
  const [addingSchoolId, setAddingSchoolId] = useState<number | null>(null);

  const handleAddSchoolToList = async (
    school_id: number,
    list_id: number,
    schoolName: string,
  ) => {
    try {
      setAddingSchoolId(school_id);
      await createListEntry.mutateAsync({
        user_id: userObj!.id,
        school_id,
        list_id,
      });

      const list = userLists?.find((l) => l.id === list_id);
      const listName = list ? list.name : 'your list';

      toast.success(`${schoolName} was added to "${listName}"`);
    } catch (error) {
      toast.error('Failed to add school.');
    } finally {
      setAddingSchoolId(null);
    }
  };

  const { data: allSupplements, isLoading: isAllSupplementsLoading } =
    api.supplements.get_by_user.useQuery(
      {
        user_id: userObj?.id ?? 0,
      },
      {
        enabled: !!userObj,
      },
    );

  console.log('allSupplements', allSupplements);

  return (
    <div>
      <div className="p-4 max-w-2xl mx-auto w-[60vw] flex flex-col min-h-screen">
        <Input
          placeholder="Search schools..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
          }}
          className="mb-4"
        />

        {isListsLoading ? (
          <Spinner />
        ) : schools && schools.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            No results found.
          </div>
        ) : (
          schools?.map((school) => (
            <Card key={school.id} className="mb-4">
              <CardContent className="p-4 grid grid-cols-2 gap-4">
                <div>
                  <div className="font-bold text-lg">{school.name}</div>
                  <div>
                    {school.city}, {school.state}
                  </div>
                  <div>Size: {school.size.toLocaleString()}</div>
                  <div>Tuition: ${school.tuition.toLocaleString()}</div>
                  <div>
                    Acceptance Rate:{' '}
                    {(Number(school.acceptance_rate) * 100).toFixed(2)}%
                  </div>
                </div>
                <div className="flex flex-col justify-end items-start">
                  <div>
                    Deadlines:{' '}
                    {school.deadlines.map((deadline) => (
                      <div key={deadline.id}>
                        {deadline.application_type} -{' '}
                        {new Date(deadline.date).toLocaleDateString()}
                      </div>
                    ))}
                  </div>
                  <div># of Supplements: {school.supplementsCount}</div>
                </div>
                <Select
                  onValueChange={(value) => {
                    const listId = parseInt(value);
                    setSelectedLists((prev) => ({
                      ...prev,
                      [school.id]: listId,
                    }));
                    handleAddSchoolToList(school.id, listId, school.name);
                  }}
                  value={selectedLists[school.id]?.toString() || ''}
                  disabled={addingSchoolId === school.id || isListsLoading}
                >
                  <SelectTrigger
                    className="w-[180px]"
                    disabled={addingSchoolId === school.id || isListsLoading}
                  >
                    <SelectValue
                      placeholder={
                        isListsLoading ? 'Loading lists...' : 'Add to a List'
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {isListsLoading ? (
                      <div className="flex justify-center p-4">
                        <Spinner />
                      </div>
                    ) : (
                      <SelectGroup>
                        <SelectLabel>Your Lists</SelectLabel>
                        {userLists?.map((list) => (
                          <SelectItem key={list.id} value={list.id.toString()}>
                            {list.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    )}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* <Lists /> */}
    </div>
  );
}
