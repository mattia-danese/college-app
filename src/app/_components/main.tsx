"use client";

import { useState } from "react";
import { Input } from "~/components/ui/input";
import { Card, CardContent } from "~/components/ui/card";
import { api } from "~/trpc/react";

import { useDebounce } from "./useDebounce";
import Spinner from "./Spinner";

export function MainPage() {
  const [query, setQuery] = useState("");
  const [currentOffset, setCurrentOffset] = useState(0);

  const debouncedQuery = useDebounce(query, 300);

  const { data: schools, isLoading } = api.schools.get_paginated.useQuery({
    limit: 10,
    offset: currentOffset,
    query: debouncedQuery?.trim() === "" ? undefined : debouncedQuery,
  });

  const userEmail = "test@test.com";

  const { data: user } = api.users.get.useQuery({ email: userEmail });

  console.log("USER:", user);

  const { data: entries } = api.list_entries.get_by_user.useQuery({
    user_id: user?.id ?? 0
  },{
    enabled: !!user, // only run this query after user is available
  });

  console.log("ALL ENTRIES:", entries);

  return (
    <div className="p-4 max-w-2xl mx-auto w-[60vw] flex flex-col min-h-screen">
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
