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

  return <>{children}</>;
}
