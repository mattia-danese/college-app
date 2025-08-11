import { and, eq, ilike, inArray, sql } from 'drizzle-orm';
import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import {
  schools,
  deadlines,
  supplements,
  list_entries,
  lists,
} from '~/server/db/schema';

import type { InferSelectModel } from 'drizzle-orm';

export const schoolsRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        city: z.string().min(1),
        state: z.string().min(1),
        size: z.number().int().min(1),
        tuition: z.number().int().min(1),
        acceptance_rate: z.number().min(0).max(1),
      }),
    )
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
    return records;
  }),

  get_paginated: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).default(10),
        offset: z.number().min(0).default(0),
        query: z.string().optional(),
        user_id: z.number().int().positive().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { limit, offset, query } = input;

      const joined = await ctx.db
        .select({
          school: schools,
          supplementsCount: sql<number>`COUNT(${supplements.id})`.mapWith(
            Number,
          ),
        })
        .from(schools)
        .leftJoin(supplements, eq(schools.id, supplements.school_id))
        .where(query ? ilike(schools.name, `${query}%`) : undefined)
        .groupBy(schools.id)
        .limit(limit)
        .offset(offset);

      const schoolIds = joined.map(({ school, supplementsCount }) => school.id);

      const joined2 = await ctx.db
        .select({ deadline: deadlines })
        .from(deadlines)
        .where(
          schoolIds.length > 0
            ? inArray(deadlines.school_id, schoolIds)
            : undefined,
        );

      const deadlineMap = new Map<number, (typeof deadlines.$inferSelect)[]>();
      for (const { deadline } of joined2) {
        if (!deadlineMap.has(deadline.school_id)) {
          deadlineMap.set(deadline.school_id, []);
        }
        deadlineMap.get(deadline.school_id)!.push(deadline);
      }

      const records = joined.map(({ school, supplementsCount }) => ({
        id: school.id,
        name: school.name,
        city: school.city,
        state: school.state,
        size: school.size,
        tuition: school.tuition,
        acceptance_rate: school.acceptance_rate,
        deadlines: (
          (deadlineMap.get(school.id)?.sort().reverse() as InferSelectModel<
            typeof deadlines
          >[]) ?? []
        ).map((d) => ({
          id: d.id,
          application_type: d.application_type as 'RD' | 'EA' | 'ED' | 'ED2',
          date: d.date,
        })),
        supplementsCount,
        list_id: null as number | null,
        list_entry_id: null as number | null,
      }));

      // If user_id provided, annotate each school with the user's list_id (if any)
      if (input.user_id && schoolIds.length > 0) {
        const entries = await ctx.db
          .select({
            id: list_entries.id,
            school_id: list_entries.school_id,
            list_id: list_entries.list_id,
          })
          .from(list_entries)
          .where(
            and(
              eq(list_entries.user_id, input.user_id),
              inArray(list_entries.school_id, schoolIds),
            ),
          );

        const listBySchool = new Map<number, number>();
        for (const entry of entries) {
          listBySchool.set(entry.school_id, entry.list_id);
        }

        const entriesBySchool = new Map<number, number>();
        for (const entry of entries) {
          entriesBySchool.set(entry.school_id, entry.id);
        }

        for (const record of records) {
          record.list_id = listBySchool.get(record.id) ?? null;
          record.list_entry_id = entriesBySchool.get(record.id) ?? null;
        }
      }

      return records;
    }),

  get_schools_dashboard_data: publicProcedure
    .input(
      z.object({
        user_id: z.number().int().positive(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const records = await ctx.db
        .select({
          school_id: schools.id,
          school_name: schools.name,
          list_name: lists.name,
          application_type: deadlines.application_type,
          deadline_date: deadlines.date,
          num_supplements: sql<number>`count(${supplements.id})`,
        })
        .from(supplements)
        .innerJoin(schools, eq(schools.id, supplements.school_id))
        .innerJoin(list_entries, eq(list_entries.school_id, schools.id))
        .innerJoin(lists, eq(lists.id, list_entries.list_id))
        .innerJoin(deadlines, eq(deadlines.school_id, schools.id))
        .where(eq(lists.user_id, input.user_id))
        .groupBy(
          schools.id,
          schools.name,
          lists.name,
          deadlines.application_type,
          deadlines.date,
        );

      return records.map((record) => ({
        id: record.school_id.toString(),
        school_name: record.school_name,
        list_name: record.list_name,
        application_type: record.application_type as 'RD' | 'EA' | 'ED' | 'ED2',
        deadline: record.deadline_date,
        num_supplements: record.num_supplements,
      }));
    }),
});
