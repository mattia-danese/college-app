'use client';

import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { api } from '~/trpc/react';
import { useUserStore } from '~/stores/useUserStore';

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn, user } = useUser();
  const setUser = useUserStore((s) => s.setUser);
  const clearUser = useUserStore((s) => s.clearUser);

  // Fetch DB user by Clerk ID
  const { data: dbUser } = api.users.get_by_clerk_id.useQuery(
    { clerk_id: user?.id ?? '' },
    { enabled: isLoaded && isSignedIn && !!user?.id },
  );

  useEffect(() => {
    if (dbUser) setUser(dbUser);
    else clearUser();
  }, [dbUser, setUser, clearUser]);

  // Don't render children until Clerk has loaded to prevent hydration mismatch
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
}
