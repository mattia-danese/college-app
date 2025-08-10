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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { Menu } from 'lucide-react';
import { cn } from '~/lib/utils';
import { DarkModeToggle } from './DarkModeToggel';

export function Navbar() {
  const pathname = usePathname();
  const { isSignedIn, isLoaded } = useUser();

  // Don't render until Clerk has loaded to prevent hydration mismatch
  if (!isLoaded) {
    return (
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <span className="text-primary">MyApp</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 animate-pulse bg-muted rounded" />
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo or Brand */}
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <span
            className="ml-2 text-2xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent select-none"
            style={{ letterSpacing: '0.01em' }}
          >
            Collegenda
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {isSignedIn ? (
            <>
              {/* Desktop/Tablet nav */}
              <div className="hidden md:flex items-center gap-2">
                <NavigationMenu>
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      <Link href="/schools">
                        <Button
                          variant={
                            pathname === '/schools' ? 'default' : 'ghost'
                          }
                          className={cn(
                            'mx-1 px-4',
                            pathname === '/schools'
                              ? 'font-semibold'
                              : 'text-muted-foreground hover:text-primary',
                          )}
                          aria-current={
                            pathname === '/schools' ? 'page' : undefined
                          }
                        >
                          Schools
                        </Button>
                      </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <Link href="/calendar">
                        <Button
                          variant={
                            pathname === '/calendar' ? 'default' : 'ghost'
                          }
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
              </div>

              {/* Mobile dropdown */}
              <div className="md:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label="Open menu"
                    >
                      <Menu className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-fit min-w-0">
                    <DropdownMenuItem asChild>
                      <Link href="/schools">Schools</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/calendar">Calendar</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard">Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <div className="px-2 py-1.5">
                      <UserButton />
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </>
          ) : (
            <>
              {/* Desktop/Tablet auth buttons */}
              <div className="hidden md:flex items-center gap-2">
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
              </div>

              {/* Mobile dropdown for auth + links */}
              <div className="md:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label="Open menu"
                    >
                      <Menu className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-fit min-w-0">
                    <DropdownMenuItem asChild>
                      <SignInButton mode="modal">
                        <button className="w-full text-left">Sign In</button>
                      </SignInButton>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <SignUpButton mode="modal">
                        <button className="w-full text-left">Sign Up</button>
                      </SignUpButton>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </>
          )}
          <div className={isSignedIn ? 'ml-2' : 'mx-1'}>
            <DarkModeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
