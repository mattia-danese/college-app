'use client';

import Link from 'next/link';
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import { Button } from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import {
  CalendarDays,
  LayoutDashboard,
  Search as SearchIcon,
  ArrowRight,
} from 'lucide-react';

export function MainPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-6 pt-20 sm:pt-24 md:pt-28 lg:pt-32 pb-8 sm:pb-10 md:pb-12 lg:pb-14 text-center">
          <h1 className="text-balance bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl md:text-6xl">
            Plan, track, and ace your college applications
          </h1>

          <p className="text-pretty max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Search schools, manage deadlines, and organize supplements in one
            place. Stay on top of every requirement with a clear, personalized
            schedule.
          </p>

          <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row">
            <SignedOut>
              <SignInButton mode="modal">
                <Button size="lg" className="px-6">
                  Sign up / Log In
                </Button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <Link href="/schools">
                <Button size="lg" className="px-6">
                  Start Searching
                </Button>
              </Link>
            </SignedIn>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="pt-4 sm:pt-6 md:pt-8 pb-10 sm:pb-14 md:pb-16">
        <div className="mx-auto w-full max-w-6xl px-6">
          <div className="mb-6 text-center">
            <h2 className="mt-3 text-balance text-2xl font-semibold sm:text-3xl">
              Three ways to streamline your application journey
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* 1. School Search */}
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="rounded-md bg-primary/10 p-2 text-primary">
                    <SearchIcon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-base">
                    Search schools instantly
                  </CardTitle>
                </div>
                <CardDescription>
                  Find and compare schools without opening countless tabs. Get
                  key details at a glance.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/schools">
                  <Button variant="ghost" className="px-0">
                    Explore schools
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* 2. Calendar + Supplements */}
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="rounded-md bg-primary/10 p-2 text-primary">
                    <CalendarDays className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-base">
                    Plan with calendar
                  </CardTitle>
                </div>
                <CardDescription>
                  Schedule supplement work and view requirements by school—no
                  more digging through websites.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/calendar">
                  <Button variant="ghost" className="px-0">
                    Open calendar
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* 3. Dashboards */}
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="rounded-md bg-primary/10 p-2 text-primary">
                    <LayoutDashboard className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-base">Stay on track</CardTitle>
                </div>
                <CardDescription>
                  Modern, intuitive dashboards for schools and supplements to
                  easily track progress—no more messy spreadsheets.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/dashboard">
                  <Button variant="ghost" className="px-0">
                    View dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
