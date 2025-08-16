'use client';

import {
  columns as supplementsColumns,
  type Status,
  type SupplementsDashboardRow,
} from './SupplementsDashboardColumns';
import { SupplementsDashboardDataTable } from './SupplementsDashboardDataTable';

import {
  columns as schoolsColumns,
  type SchoolsDashboardRow,
} from './SchoolsDashboardColumns';
import { SchoolsDashboardDataTable } from './SchoolsDashboardDataTable';

import { api } from '~/trpc/react';
import { useUserStore } from '~/stores/useUserStore';
import { useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';

import { CircularProgress } from '~/components/CircularProgress';
import { toast } from 'sonner';

export default function DashboardClient() {
  const user = useUserStore((s) => s.user);
  const utils = api.useUtils();

  // Fetch supplements data for supplement view
  const { data: supplementsData = [], isLoading: isSupplementsLoading } =
    api.supplements.get_supplements_dashboard_data.useQuery(
      {
        user_id: user?.id ?? 0,
      },
      {
        enabled: !!user?.id,
      },
    );

  // Fetch schools data for school view
  const { data: schoolsData, isLoading: isSchoolsLoading } =
    api.schools.get_schools_dashboard_data.useQuery(
      {
        user_id: user?.id ?? 0,
      },
      {
        enabled: !!user?.id,
      },
    );

  const allListOptions = useMemo(() => {
    return (
      schoolsData?.lists.map((item) => ({
        id: item.id.toString(),
        name: item.name,
      })) ?? []
    );
  }, [schoolsData]);

  const allApplicationTypeOptions = [
    { id: 'RD', name: 'RD' },
    { id: 'EA', name: 'EA' },
    { id: 'ED', name: 'ED' },
    { id: 'ED2', name: 'ED2' },
  ];

  const allStatusOptions = (
    ['Completed', 'In Progress', 'Planned', 'Not Planned'] satisfies Status[]
  ).map((status) => ({
    id: status,
    name: status,
  }));

  const totalSchools = schoolsData?.schools.length ?? 0;
  const totalSupplements = supplementsData.length;

  const completedSupplements = supplementsData.filter(
    (item: any) => item.status === 'Completed',
  ).length;

  const percent =
    totalSupplements > 0
      ? Math.round((completedSupplements / totalSupplements) * 100)
      : 0;

  const createList = api.lists.create.useMutation();

  const handleCreateList = async (name: string) => {
    try {
      const result = await createList.mutateAsync({
        name: name,
        user_id: user?.id ?? 0,
      });

      toast.success(`List ${name} created successfully`);

      // Optimistically update the schools data to include the new list
      if (result) {
        utils.schools.get_schools_dashboard_data.setData(
          { user_id: user!.id },
          (oldData) => {
            if (!oldData) return oldData;
            return {
              ...oldData,
              lists: [...oldData.lists, { id: result.id, name: result.name }],
            };
          },
        );
      }

      return result;
    } catch (error) {
      toast.error(`Failed to create list ${name}`);
      // Revert optimistic update on error
      await utils.schools.get_schools_dashboard_data.invalidate();
      await utils.supplements.get_supplements_dashboard_data.invalidate();
      return null;
    }
  };

  const createOrUpdateListEntry =
    api.list_entries.create_or_update.useMutation();

  const handleUpdateListEntry = async (
    school_id: number,
    list_id: number,
    deadline_id: number,
    schoolName: string,
    showToast: boolean = true,
  ) => {
    const list = allListOptions.find((l) => l.id === list_id.toString());
    const newListName = list?.name;

    // Optimistically update the cached data
    utils.schools.get_schools_dashboard_data.setData(
      { user_id: user!.id },
      (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          schools: oldData.schools.map((school) =>
            school.id === school_id.toString()
              ? { ...school, list_name: newListName || school.list_name }
              : school,
          ),
        };
      },
    );

    try {
      await createOrUpdateListEntry.mutateAsync({
        user_id: user!.id,
        school_id,
        list_id,
        deadline_id,
      });

      if (showToast) {
        toast.success(`Update successful!`);
      }
    } catch (error) {
      if (showToast) {
        toast.error(`Failed to add ${schoolName} to '${newListName}'.`);
      }
    } finally {
      // Ensure the UI reflects the changes
      await utils.schools.get_schools_dashboard_data.invalidate();
      await utils.supplements.get_supplements_dashboard_data.invalidate();
    }
  };

  const createEvent = api.calendar_events.create.useMutation({
    onSuccess: () => {
      toast.success('Event created successfully');
      // Only invalidate on success to ensure the optimistic update stays
      utils.supplements.get_supplements_dashboard_data.invalidate();
    },
    onError: () => {
      toast.error('Failed to create event');
      // Revert optimistic update on error
      utils.supplements.get_supplements_dashboard_data.invalidate();
    },
  });

  const handleCreateEvent = (
    supplement_id: number,
    title: string,
    description: string,
    start: Date,
    end: Date,
  ) => {
    // Optimistically update the supplements data to show the new event
    utils.supplements.get_supplements_dashboard_data.setData(
      { user_id: user!.id },
      (oldData) => {
        if (!oldData) return oldData;
        return oldData.map((supplement) =>
          supplement.id === supplement_id.toString()
            ? { ...supplement, complete_by: start }
            : supplement,
        );
      },
    );

    createEvent.mutate({
      user_id: user!.id,
      supplement_id,
      deadline_id: null,
      title,
      description,
      start,
      end,
    });
  };

  return (
    <div className="flex flex-col items-center min-h-screen py-8">
      <Tabs defaultValue="school" className="w-full max-w-6xl">
        <div className="flex justify-center mb-6">
          <TabsList className="grid grid-cols-2 w-80">
            <TabsTrigger value="school">School View</TabsTrigger>
            <TabsTrigger value="supplement">Supplement View</TabsTrigger>
          </TabsList>
        </div>

        <div className="mb-6 p-6 bg-gradient-to-r from-muted/50 to-accent/30 rounded-lg border border-border flex flex-col items-center gap-4">
          <h2 className="text-xl font-semibold text-foreground">
            You are applying to{' '}
            <span className="text-primary font-bold">{totalSchools}</span>{' '}
            school{totalSchools === 1 ? '' : 's'}! You have completed{' '}
            <span className="text-chart-2 font-bold">
              {completedSupplements}
            </span>{' '}
            /{' '}
            <span className="text-muted-foreground font-bold">
              {totalSupplements}
            </span>{' '}
            supplements!
          </h2>
          {/* <CircularProgress value={percent} className="mt-4" /> */}
        </div>

        <TabsContent value="school" className="w-full">
          <SchoolsDashboardDataTable
            columns={schoolsColumns(
              handleCreateList,
              handleUpdateListEntry,
              allListOptions,
            )}
            data={schoolsData?.schools ?? []}
            listOptions={allListOptions}
            applicationTypeOptions={allApplicationTypeOptions}
            handleCreateList={handleCreateList}
          />
        </TabsContent>

        <TabsContent value="supplement" className="w-full">
          <SupplementsDashboardDataTable
            columns={supplementsColumns(handleCreateEvent)}
            data={supplementsData}
            listOptions={allListOptions}
            applicationTypeOptions={allApplicationTypeOptions}
            statusOptions={allStatusOptions}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
