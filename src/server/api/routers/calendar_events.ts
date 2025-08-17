import { z } from 'zod';
import { eq, inArray, or, and, isNull, sql } from 'drizzle-orm';

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
  create_or_update: publicProcedure
    .input(
      z
        .object({
          user_id: z.number().int().positive(),
          supplement_id: z.number().int().positive(),
          deadline_id: z.number().int().positive().nullable(),
          title: z.string().min(1),
          description: z.string().min(1),
          start: z.date(),
          end: z.date(),
        })
        .refine((data) => data.start <= data.end, {
          message: 'Start time must be equal or before end time',
          path: ['start'],
        }),
    )
    .mutation(async ({ ctx, input }) => {
      const rows = await ctx.db
        .insert(calendar_events)
        .values({
          user_id: input.user_id,
          supplement_id: input.supplement_id,
          deadline_id: input.deadline_id,
          title: input.title,
          description: input.description,
          start: input.start,
          end: input.end,
        })
        .onConflictDoUpdate({
          target: [calendar_events.user_id, calendar_events.supplement_id],
          set: {
            title: input.title,
            description: input.description,
            start: input.start,
            end: input.end,
            updatedAt: new Date(),
          },
        })
        .returning({
          id: calendar_events.id,
          wasInserted: sql<boolean>`(xmax = 0)`,
        });

      const result = rows[0];
      if (!result) {
        throw new Error(
          `Failed to create or update calendar event. user_id: ${input.user_id} supplement_id: ${input.supplement_id} deadline_id: ${input.deadline_id} title: ${input.title} description: ${input.description} start: ${input.start} end: ${input.end}`,
        );
      }

      return {
        event_id: result.id,
        wasInserted: result.wasInserted,
      } as const;
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

  get_supplements_without_events_by_user: publicProcedure
    .input(
      z.object({
        user_id: z.number().int().positive(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const records = await ctx.db
        .select({
          list_id: lists.id,

          school_id: schools.id,
          school_name: schools.name,

          supplement_id: supplements.id,
          supplement_prompt: supplements.prompt,
          supplement_description: supplements.description,
          supplement_word_count: supplements.word_count,

          deadline_id: deadlines.id,
          deadline_application_type: deadlines.application_type,
          deadline_date: deadlines.date,
        })
        .from(lists)
        .innerJoin(list_entries, eq(list_entries.list_id, lists.id))
        .innerJoin(schools, eq(list_entries.school_id, schools.id))
        .innerJoin(deadlines, eq(list_entries.deadline_id, deadlines.id))
        .innerJoin(supplements, eq(schools.id, supplements.school_id))
        .leftJoin(
          calendar_events,
          and(
            eq(calendar_events.user_id, input.user_id),
            eq(calendar_events.supplement_id, supplements.id),
          ),
        )
        .where(
          and(
            eq(lists.user_id, input.user_id),
            isNull(calendar_events.id), // <-- Only supplements with NO event for this user
          ),
        );

      const grouped: Record<
        number, // list_id
        Record<
          number, // school_id
          {
            school_id: number;
            school_name: string;
            supplements: {
              supplement_id: number;
              supplement_prompt: string;
              supplement_description: string;
              supplement_word_count: string;
            }[];
            deadlines: {
              deadline_id: number;
              deadline_application_type: string;
              deadline_date: Date;
            }[];
          }
        >
      > = {};

      for (const record of records) {
        if (!grouped[record.list_id]) {
          grouped[record.list_id] = {};
        }

        if (!grouped[record.list_id]![record.school_id]) {
          grouped[record.list_id]![record.school_id] = {
            school_id: record.school_id,
            school_name: record.school_name,
            supplements: [],
            deadlines: [],
          };
        }

        grouped[record.list_id]![record.school_id]!.supplements.push({
          supplement_id: record.supplement_id,
          supplement_prompt: record.supplement_prompt,
          supplement_description: record.supplement_description,
          supplement_word_count: record.supplement_word_count,
        });

        grouped[record.list_id]![record.school_id]!.deadlines.push({
          deadline_id: record.deadline_id,
          deadline_application_type: record.deadline_application_type!,
          deadline_date: record.deadline_date,
        });
      }

      return grouped;
    }),
});
