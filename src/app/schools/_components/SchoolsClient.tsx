'use client';

import { useState } from 'react';
import { api } from '~/trpc/react';

import { useDebounce } from '../../_components/useDebounce';
import Spinner from '../../_components/Spinner';

import { toast } from 'sonner';
import { useUserStore } from '~/stores/useUserStore';
import SchoolsList from './SchoolsList';

export default function SchoolsClient() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  const user = useUserStore((s) => s.user);

  const utils = api.useUtils();
  const createOrUpdateListEntry =
    api.list_entries.create_or_update.useMutation();

  // revisit if multiple updates concurrently (set state to Set<number>)
  const [updatingSchoolId, setUpdatingSchoolId] = useState<number | null>(null);

  //   gets schools with cursor-based infinite pagination
  const limit = 10 as const;
  const {
    data: schoolsPages,
    isLoading: isSchoolsLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = api.schools.get_infinite.useInfiniteQuery(
    {
      limit,
      query: debouncedQuery?.trim() === '' ? undefined : debouncedQuery,
      user_id: user?.id ?? undefined,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialCursor: undefined,
    },
  );

  const schools = (schoolsPages?.pages ?? []).flatMap((p) => p.items);

  // gets user lists
  const { data: lists = [], isLoading: isListsLoading } =
    api.lists.get_by_user.useQuery(
      {
        user_id: user?.id ?? 0,
      },
      {
        enabled: !!user?.id,
      },
    );

  const handleCreateOrUpdateListEntry = async (
    school_id: number,
    list_id: number,
    deadline_id: number,
    schoolName: string,
  ) => {
    const queryInput = {
      limit,
      query: debouncedQuery?.trim() === '' ? undefined : debouncedQuery,
      user_id: user?.id ?? undefined,
    } as const;

    const list = lists.find((l) => l.id === list_id);

    try {
      setUpdatingSchoolId(school_id);
      const result = await createOrUpdateListEntry.mutateAsync({
        user_id: user!.id,
        school_id,
        list_id,
        deadline_id,
      });

      if (result.action === 'created') {
        toast.success(`${schoolName} was added to '${list!.name}'`);
      } else {
        toast.success(`Update successful!`);
      }
    } catch (error) {
      toast.error(`Failed to add ${schoolName} to '${list!.name}'.`);
    } finally {
      // Ensure server truth before re-enabling to avoid flicker
      await utils.schools.get_infinite.invalidate(queryInput);
      setUpdatingSchoolId(null);
    }
  };

  const deleteListEntry = api.list_entries.delete.useMutation();

  const handleRemoveSchoolFromList = async (
    school_id: number,
    list_entry_id: number,
    schoolName: string,
    list_id: number,
  ) => {
    const queryInput = {
      limit,
      query: debouncedQuery?.trim() === '' ? undefined : debouncedQuery,
      user_id: user?.id ?? undefined,
    } as const;

    const list = lists.find((l) => l.id === list_id);

    try {
      setUpdatingSchoolId(school_id);
      await deleteListEntry.mutateAsync({
        list_entry_id,
      });

      toast.success(`${schoolName} was removed from '${list!.name}'.`);
    } catch (error) {
      toast.error(`Failed to remove ${schoolName} from '${list!.name}'.`);
    } finally {
      // Ensure server truth before re-enabling to avoid flicker
      await utils.schools.get_infinite.invalidate(queryInput);
      setUpdatingSchoolId(null);
    }
  };

  return (
    <div>
      {isListsLoading && isSchoolsLoading ? (
        <Spinner />
      ) : (
        <SchoolsList
          schools={schools}
          lists={lists}
          onListEntryChange={handleCreateOrUpdateListEntry}
          onRemoveSchoolFromList={handleRemoveSchoolFromList}
          updatingSchoolId={updatingSchoolId}
          query={query}
          onQueryChange={setQuery}
          onLoadMore={() => void fetchNextPage()}
          hasNextPage={!!hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
        />
      )}
    </div>
  );
}
