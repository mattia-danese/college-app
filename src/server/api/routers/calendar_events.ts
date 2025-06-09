import { z } from 'zod';
import { eq, inArray, or } from 'drizzle-orm';

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import {
  calendar_events,
  deadlines,
  list_entries,
  lists,
  schools,
  supplements,
} from '~/server/db/schema';

export const calendarEventsRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z
        .object({
          user_id: z.number().int().positive(),
          supplement_id: z.number().int().positive().nullable(),
          deadline_id: z.number().int().positive().nullable(),
          title: z.string().min(1),
          description: z.string().min(1),
          start: z.date(),
          end: z.date(),
        })
        .refine(
          (data) =>
            (data.supplement_id !== null && data.deadline_id === null) ||
            (data.supplement_id === null && data.deadline_id !== null),
          {
            message:
              'Exactly one of supplement_id or deadline_id must be provided',
            path: ['supplement_id'], // Could also target both or `["_form"]`
          },
        )
        .refine((data) => data.start < data.end, {
          message: 'Start time must be before end time',
          path: ['start'],
        }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(calendar_events).values({
        user_id: input.user_id,
        supplement_id: input.supplement_id,
        deadline_id: input.deadline_id,
        title: input.title,
        description: input.description,
        start: input.start,
        end: input.end,
      });
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
          event_id: calendar_events.id,
          event_title: calendar_events.title,
          event_description: calendar_events.description,
          event_start: calendar_events.start,
          event_end: calendar_events.end,

          list_id: lists.id,
          list_name: lists.name,

          supplement_id: calendar_events.supplement_id,
          deadline_id: calendar_events.deadline_id,
        })
        .from(calendar_events)
        .leftJoin(
          supplements,
          eq(supplements.id, calendar_events.supplement_id),
        )
        .leftJoin(deadlines, eq(deadlines.id, calendar_events.deadline_id))
        .innerJoin(
          schools,
          or(
            eq(schools.id, supplements.school_id),
            eq(schools.id, deadlines.school_id),
          ),
        )
        .innerJoin(list_entries, eq(list_entries.school_id, schools.id))
        .innerJoin(lists, eq(lists.id, list_entries.list_id))
        .where(eq(calendar_events.user_id, input.user_id))
        .orderBy(calendar_events.start);

      // Group by list_id
      const grouped: Record<
        number,
        {
          list_id: number;
          list_name: string;

          events: {
            event_id: number;
            event_title: string;
            event_description: string | null;
            event_start: Date;
            event_end: Date;

            supplement_id: number | null;
            deadline_id: number | null;
          }[];
        }
      > = {};

      for (const record of records) {
        if (!grouped[record.list_id]) {
          grouped[record.list_id] = {
            list_id: record.list_id,
            list_name: record.list_name,

            events: [],
          };
        }

        grouped[record.list_id]!.events.push({
          event_id: record.event_id,
          event_title: record.event_title,
          event_description: record.event_description,
          event_start: record.event_start,
          event_end: record.event_end,
          supplement_id: record.supplement_id,
          deadline_id: record.deadline_id,
        });
      }

      return grouped;
    }),
});
