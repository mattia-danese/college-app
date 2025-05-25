import { eq, ilike, inArray, sql } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { schools, deadlines, supplements } from "~/server/db/schema";

import type { InferSelectModel } from "drizzle-orm";

export const schoolsRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ 
        name: z.string().min(1),
        city: z.string().min(1),
        state: z.string().min(1),
        size: z.number().int().min(1),
        tuition: z.number().int().min(1),
        acceptance_rate: z.number().min(0).max(1)
    }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(schools).values({
        name: input.name,
        city: input.city,
        state: input.state,
        size: input.size,
        tuition: input.tuition,
        acceptance_rate: input.acceptance_rate.toString(), // Drizzle treats decimal columns as strings, not numbers 
      });
    }),

    get: publicProcedure.query(async ({ ctx }) => {
        const records = await ctx.db.query.schools.findMany();
        return records
    }),
    
    get_paginated: publicProcedure
        .input(
            z.object({
            limit: z.number().min(1).default(10),
            offset: z.number().min(0).default(0),
            query: z.string().optional(),
            }),
        )
        .query(async ({ ctx, input }) => {
            const { limit, offset, query } = input;

            const joined = await ctx.db
            .select({
                school: schools,
                supplementsCount: sql<number>`COUNT(${supplements.id})`.mapWith(Number),
            })
            .from(schools)
            .leftJoin(supplements, eq(schools.id, supplements.school_id))
            .where(query ? ilike(schools.name, `${query}%`) : undefined)
            .groupBy(schools.id)
            .limit(limit)
            .offset(offset);

            const schoolIds = joined.map(({ school, supplementsCount }) => (school.id));

            const joined2 = await ctx.db
            .select({deadline: deadlines})
            .from(deadlines)
            .where(schoolIds.length > 0 ? inArray(deadlines.school_id, schoolIds) : undefined);

            const deadlineMap = new Map<number, typeof deadlines.$inferSelect[]>();
            for (const { deadline } of joined2) {
            if (!deadlineMap.has(deadline.school_id)) {
                deadlineMap.set(deadline.school_id, []);
            }
            deadlineMap.get(deadline.school_id)!.push(deadline);
            }

            const records = joined.map(({ school, supplementsCount }) => ({
                ...school,
                supplementsCount,
                deadlines: deadlineMap.get(school.id)?.sort().reverse() as InferSelectModel<typeof deadlines>[] ?? []
            }));

            return records
        }),
});