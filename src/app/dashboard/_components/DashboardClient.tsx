'use client';

import { api } from '~/trpc/react';
import { columns, type DashboardSupplementRow } from './DashboardColumns';
import { DashboardDataTable } from './DashboardDataTable';
import { useUserStore } from '~/stores/useUserStore';
import { useMemo } from 'react';

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
  const { data = [], isLoading: isDataLoading } =
    api.supplements.get_dashboard_data.useQuery(
      {
        user_id: user?.id ?? 0,
      },
      {
        enabled: !!user?.id,
      },
    );

  // Extract unique list names from data
  const listOptions = useMemo(() => {
    const uniqueLists = Array.from(new Set(data.map((item) => item.list_name)));
    return uniqueLists.map((listName) => ({
      value: listName,
      label: listName,
    }));
  }, [data]);

  return (
    <div className="container mx-auto py-10">
      <DashboardDataTable
        columns={columns}
        data={data}
        listOptions={listOptions}
      />
    </div>
  );
}
