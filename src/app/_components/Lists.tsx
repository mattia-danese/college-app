'use client';

import { useUser } from '@clerk/nextjs';
import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { api } from '~/trpc/react';

export function Lists() {
  const { isLoaded, isSignedIn, user } = useUser();

  const userEmail = user?.emailAddresses[0]?.emailAddress;

  const { data: userObj, isLoading: isUserLoading } = api.users.get.useQuery(
    { email: userEmail! },
    {
      enabled: isLoaded && isSignedIn && !!userEmail,
    },
  );

  const { data: userListEntries, isLoading: isUserListEntriesLoading } =
    api.list_entries.get_by_user.useQuery(
      {
        user_id: userObj?.id ?? 0,
      },
      {
        enabled: !!userObj,
      },
    );

  const flattenLists = (
    data: {
      list_id: number;
      list_name: string;
      school: { name: string } | null;
    }[],
  ) => {
    const result: Record<number, { list_name: string; schools: string[] }> = {};

    console.log('DATA', data);

    for (const entry of data) {
      const { list_id, list_name, school } = entry;

      if (!result[list_id]) {
        result[list_id] = {
          list_name,
          schools: [],
        };
      }

      if (school) result[list_id].schools.push(school.name);
    }

    return result;
  };

  const flattened = flattenLists(userListEntries ?? []);

  const [newListName, setNewListName] = useState('');
  const createList = api.lists.create.useMutation();
  const handleCreateList = async (name: string) => {
    try {
      //   setNewListName(school_id);
      const result = await createList.mutateAsync({
        name,
        user_id: userObj!.id,
      });
      console.log('Successfully created new list:', result);
      return result;
    } catch (err) {
      console.error('Failed to create new list:', err);
      throw err;
    } finally {
      setNewListName('');
    }
  };

  return (
    <div>
      <Input
        placeholder="New list name"
        value={newListName}
        onChange={(e) => {
          setNewListName(e.target.value);
        }}
        className="mb-4"
      />
      <Button onClick={() => handleCreateList(newListName)}>
        Create a list
      </Button>

      {Object.keys(flattened).length === 0 ? (
        <div>{user?.fullName} does not have any lists</div>
      ) : (
        Object.entries(flattened).map(([key, value]) => (
          <div key={key}>
            <h2>LIST: {value.list_name}</h2>

            {value.schools.length === 0 ? (
              <div className="text-gray-500 italic">
                No schools in this list yet
              </div>
            ) : (
              value.schools.map((school) => <div key={school}>{school}</div>)
            )}
          </div>
        ))
      )}
    </div>
  );
}
