import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import SchoolsClient from './_components/SchoolsClient';

export default async function SchoolsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/');
  }

  return <SchoolsClient />;
}
