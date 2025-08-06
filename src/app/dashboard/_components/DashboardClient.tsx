'use client';

import {
  columns as supplementsColumns,
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

// async function getData(): Promise<DashboardSupplementRow[]> {
//   // Fetch data from your API here.
//   // id: string;
//   //   school_name: string;
//   //   application_type: string;
//   //   deadline: Date;
//   //   supplement_title: string;
//   //   complete_by: Date;
//   //   status: 'Completed' | 'In Progress' | 'Planned';

//   return [
//     {
//       id: '728ed52f',
//       school_name: 'Harvard University',
//       list_name: 'reach',
//       application_type: 'RD',
//       deadline: new Date(),
//       supplement_title: 'Why Harvard?',
//       complete_by: new Date(),
//       status: 'Planned',
//     },
//     // ...
//   ];
// }

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
  const { data: schoolsData = [], isLoading: isSchoolsLoading } =
    api.schools.get_schools_dashboard_data.useQuery(
      {
        user_id: user?.id ?? 0,
      },
      {
        enabled: !!user?.id,
      },
    );

  // Extract unique list names from schools data
  const listOptions = useMemo(() => {
    const uniqueLists = Array.from(
      new Set(schoolsData.map((item) => item.list_name)),
    );
    return uniqueLists.map((listName) => ({
      value: listName,
      label: listName,
    }));
  }, [schoolsData]);

  const totalSchools = schoolsData.length;
  const totalSupplements = supplementsData.length;
  const completedSupplements = supplementsData.filter(
    (item: any) => item.status === 'Completed',
  ).length;

  return (
    <div className="flex flex-col items-center min-h-screen py-8">
      <Tabs defaultValue="supplement" className="w-full max-w-6xl">
        <div className="flex justify-center mb-6">
          <TabsList className="grid grid-cols-2 w-80">
            <TabsTrigger value="supplement">Supplement View</TabsTrigger>
            <TabsTrigger value="school">School View</TabsTrigger>
          </TabsList>
        </div>

        <div className="mb-6 p-6 bg-gradient-to-r from-muted/50 to-accent/30 rounded-lg border border-border">
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
        </div>

        <TabsContent value="supplement" className="w-full">
          <SupplementsDashboardDataTable
            columns={supplementsColumns}
            data={supplementsData}
            listOptions={listOptions}
          />
        </TabsContent>

        <TabsContent value="school" className="w-full">
          <SchoolsDashboardDataTable
            columns={schoolsColumns}
            data={schoolsData}
            listOptions={listOptions}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
