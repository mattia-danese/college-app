import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import DashboardClient from './_components/DashboardClient';

export default async function CalendarPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/');
  }

  return <DashboardClient />;
}
