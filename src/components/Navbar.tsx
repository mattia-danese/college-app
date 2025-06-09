'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '~/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
} from '~/components/ui/navigation-menu';
import { useUser, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import { cn } from '~/lib/utils';

export function Navbar() {
  const pathname = usePathname();
  const { isSignedIn } = useUser();

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo or Brand */}
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="text-primary">MyApp</span>
        </Link>

        <div className="flex items-center gap-2">
          {isSignedIn ? (
            <>
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <Link href="/">
                      <Button
                        variant={pathname === '/' ? 'default' : 'ghost'}
                        className={cn(
                          'mx-1 px-4',
                          pathname === '/'
                            ? 'font-semibold'
                            : 'text-muted-foreground hover:text-primary',
                        )}
                        aria-current={pathname === '/' ? 'page' : undefined}
                      >
                        Home
                      </Button>
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link href="/calendar">
                      <Button
                        variant={pathname === '/calendar' ? 'default' : 'ghost'}
                        className={cn(
                          'mx-1 px-4',
                          pathname === '/calendar'
                            ? 'font-semibold'
                            : 'text-muted-foreground hover:text-primary',
                        )}
                        aria-current={
                          pathname === '/calendar' ? 'page' : undefined
                        }
                      >
                        Calendar
                      </Button>
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link href="/dashboard">
                      <Button
                        variant={
                          pathname === '/dashboard' ? 'default' : 'ghost'
                        }
                        className={cn(
                          'mx-1 px-4',
                          pathname === '/dashboard'
                            ? 'font-semibold'
                            : 'text-muted-foreground hover:text-primary',
                        )}
                        aria-current={
                          pathname === '/dashboard' ? 'page' : undefined
                        }
                      >
                        Dashboard
                      </Button>
                    </Link>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
              <UserButton />
            </>
          ) : (
            <>
              <SignInButton mode="modal">
                <Button variant="default" className="mx-1 px-4">
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button variant="outline" className="mx-1 px-4">
                  Sign Up
                </Button>
              </SignUpButton>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
