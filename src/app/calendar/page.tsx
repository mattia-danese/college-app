import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import CalendarClient from './_components/CalendarClient';

export default async function CalendarPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/');
  }

  return <CalendarClient />;
}
