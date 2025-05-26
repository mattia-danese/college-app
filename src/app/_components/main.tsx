"use client";

import { useState } from "react";
import { Input } from "~/components/ui/input";
import { Card, CardContent } from "~/components/ui/card";
import { api } from "~/trpc/react";

import { useDebounce } from "./useDebounce";
import Spinner from "./Spinner";
import { useUser, SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

export function MainPage() {
  const [query, setQuery] = useState("");
  const [currentOffset, setCurrentOffset] = useState(0);

  const debouncedQuery = useDebounce(query, 300);

  const { data: schools, isLoading } = api.schools.get_paginated.useQuery({
    limit: 10,
    offset: currentOffset,
    query: debouncedQuery?.trim() === "" ? undefined : debouncedQuery,
  });

  const { isLoaded, isSignedIn, user } = useUser();

  const userEmail = user?.emailAddresses[0]?.emailAddress;

  const { data: userObj, isLoading: isUserLoading } = api.users.get.useQuery(
    { email: userEmail! },
    {
      enabled: isLoaded && isSignedIn && !!userEmail,
    }
  );

  const { data: entries, isLoading: isEntriesLoading } =
    api.list_entries.get_by_user.useQuery(
      {
        user_id: userObj?.id ?? 0,
      },
      {
        enabled: !!userObj,
      }
    );

  return (
    <div className="p-4 max-w-2xl mx-auto w-[60vw] flex flex-col min-h-screen">
      <SignedOut>
        <SignInButton />
        <SignUpButton />
      </SignedOut>
        <SignedIn>
        <UserButton />
      </SignedIn>

      {entries ? 
      entries.map((entry) => (
        <div key={entry.entry_id}>
            <div>{entry.list_name}</div>
            <div>{entry.school.name}</div>
        </div>
      ))
      
       : <></>}
      
      <Input
        placeholder="Search schools..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
        }}
        className="mb-4"
      />

      {isLoading ? (
        <Spinner />
      ) : schools && schools.length === 0 ? (
        <div className="text-center text-gray-500 mt-8">No results found.</div>
      ) : (
        schools?.map((school) => (
        <Card key={school.id} className="mb-4">
            <CardContent className="p-4 grid grid-cols-2 gap-4">
                <div>
                    <div className="font-bold text-lg">{school.name}</div>
                    <div>{school.city}, {school.state}</div>
                    <div>Size: {school.size.toLocaleString()}</div>
                    <div>Tuition: ${school.tuition.toLocaleString()}</div>
                    <div>Acceptance Rate: {(Number(school.acceptance_rate) * 100).toFixed(2)}%</div>
                </div>
                <div className="flex flex-col justify-end items-start">
                    <div>
                        Deadlines:{" "}
                        {school.deadlines.map((deadline) => (
                            <div key={deadline.id}>
                                {deadline.appication_type} - {new Date(deadline.date).toLocaleDateString()}
                            </div>
                        ))}
                    </div>
                    <div># of Supplements: {school.supplementsCount}</div>
                </div>
            </CardContent>
        </Card>
      ))
    )}
    </div>
  );
}
