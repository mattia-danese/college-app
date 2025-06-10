// import {DashboardDataTable} from './DashboardDataTable';

// export default function DashboardClient() {
//   return (
//     <div>
//       <div>This is the dashboard client</div>
//       <DashboardDataTable />
//     </div>
//   );
// }

import { columns, type DashboardSupplementRow } from './DashboardColumns';
import { DashboardDataTable } from './DashboardDataTable';

async function getData(): Promise<DashboardSupplementRow[]> {
  // Fetch data from your API here.
  // id: string;
  //   school_name: string;
  //   application_type: string;
  //   deadline: Date;
  //   supplement_title: string;
  //   complete_by: Date;
  //   status: 'Completed' | 'In Progress' | 'Planned';

  return [
    {
      id: '728ed52f',
      school_name: 'Harvard University',
      list_name: 'reach',
      application_type: 'RD',
      deadline: new Date(),
      supplement_title: 'Why Harvard?',
      complete_by: new Date(),
      status: 'Planned',
    },
    // ...
  ];
}

export default async function DemoPage() {
  const data = await getData();

  return (
    <div className="container mx-auto py-10">
      <DashboardDataTable columns={columns} data={data} />
    </div>
  );
}
