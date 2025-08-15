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

export default function DashboardClient() {
  const user = useUserStore((s) => s.user);

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

  return (
    <div className="flex flex-col items-center min-h-screen py-8">
      <Tabs defaultValue="supplement" className="w-full max-w-6xl">
        <div className="flex justify-center mb-6">
          <TabsList className="grid grid-cols-2 w-80">
            <TabsTrigger value="supplement">Supplement View</TabsTrigger>
            <TabsTrigger value="school">School View</TabsTrigger>
          </TabsList>
        </div>

        <div className="mb-6 p-6 bg-gradient-to-r from-muted/50 to-accent/30 rounded-lg border border-border flex flex-col items-center gap-4">
          <h2 className="text-xl font-semibold text-foreground">
            You are applying to{' '}
            <span className="text-primary font-bold">{totalSchools}</span>{' '}
            schools! You have completed{' '}
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

        <TabsContent value="supplement" className="w-full">
          <SupplementsDashboardDataTable
            columns={supplementsColumns}
            data={supplementsData}
            listOptions={allListOptions}
            applicationTypeOptions={allApplicationTypeOptions}
            statusOptions={allStatusOptions}
          />
        </TabsContent>

        <TabsContent value="school" className="w-full">
          <SchoolsDashboardDataTable
            columns={schoolsColumns}
            data={schoolsData?.schools ?? []}
            listOptions={allListOptions}
            applicationTypeOptions={allApplicationTypeOptions}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
