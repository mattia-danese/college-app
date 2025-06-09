import { z } from 'zod';
import { eq, inArray } from 'drizzle-orm';

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import {
  deadlines,
  list_entries,
  lists,
  schools,
  supplements,
} from '~/server/db/schema';

export const supplementsRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        school_id: z.number().int().positive(),
        prompt: z.string().min(1),
        description: z.string().min(1),
        word_count: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(supplements).values({
        school_id: input.school_id,
        prompt: input.prompt,
        description: input.description,
        word_count: input.word_count,
      });
    }),

  get_by_school: publicProcedure
    .input(
      z.object({
        school_id: z.number().int().positive(),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db
        .select()
        .from(supplements)
        .where(eq(supplements.school_id, input.school_id));
    }),

  get_by_schools: publicProcedure
    .input(z.array(z.number().int().positive()))
    .query(({ ctx, input }) => {
      return ctx.db
        .select()
        .from(supplements)
        .where(inArray(supplements.school_id, input));
    }),

  get_by_user: publicProcedure
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
          list_id: lists.id,
          list_name: lists.name,
          deadline: deadlines,
          supplement: supplements,
        })
        .from(lists)
        .innerJoin(list_entries, eq(list_entries.list_id, lists.id))
        .innerJoin(schools, eq(schools.id, list_entries.school_id))
        .innerJoin(deadlines, eq(deadlines.school_id, schools.id))
        .innerJoin(supplements, eq(supplements.school_id, schools.id))
        .where(eq(lists.user_id, input.user_id));

      const result: {
        lists: { id: number; name: string }[];
        schools_by_list: Record<
          number,
          {
            school_id: number;
            school_name: string;
            deadlines: {
              application_type: 'RD' | 'EA' | 'ED' | 'ED2';
              date: Date;
            }[];
            supplements: (typeof supplements.$inferSelect)[];
          }[]
        >;
      } = {
        lists: [],
        schools_by_list: {},
      };

      const seenLists = new Set<number>();
      const seenSupplements = new Set<number>();
      const seenDeadlines = new Set<number>();

      for (const record of records) {
        if (!seenLists.has(record.list_id)) {
          result.lists.push({ id: record.list_id, name: record.list_name });
          seenLists.add(record.list_id);
        }

        const entry = (result.schools_by_list[record.list_id] ??= []);
        let schoolEntry = entry.find((s) => s.school_id === record.school_id);

        if (!schoolEntry) {
          schoolEntry = {
            school_id: record.school_id,
            school_name: record.school_name,
            deadlines: [],
            supplements: [],
          };
          entry.push(schoolEntry);
        }

        if (!seenSupplements.has(record.supplement.id)) {
          schoolEntry.supplements.push(record.supplement);
        }

        if (!seenDeadlines.has(record.deadline.id)) {
          schoolEntry.deadlines.push({
            application_type: record.deadline.application_type as
              | 'RD'
              | 'EA'
              | 'ED'
              | 'ED2',
            date: record.deadline.date,
          });
        }
      }

      return result;
    }),
});
