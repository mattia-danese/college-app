import { z } from "zod";
import { eq, inArray } from "drizzle-orm";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { calendar_events, deadlines, supplements } from "~/server/db/schema";

export const calendarEventsRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({
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
            message: "Exactly one of supplement_id or deadline_id must be provided",
            path: ["supplement_id"], // Could also target both or `["_form"]`
        }
    )
    .refine(
        (data) => data.start < data.end,
        {
            message: "Start time must be before end time",
            path: ["start"],
        }
    ))
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
    .input(z.object({
        user_id: z.number().int().positive(),
    }))
    .query(({ ctx, input }) => {
        return ctx.db
        .select({
            event_id: calendar_events.id,
            event_title: calendar_events.title,
            event_description: calendar_events.description,
            event_start: calendar_events.start,
            event_end: calendar_events.end,
            
            supplement_id: supplements.id,
            deadline_id: deadlines.id,
        })
        .from(calendar_events)
        .leftJoin(supplements, eq(supplements.id, calendar_events.supplement_id))
        .leftJoin(deadlines, eq(deadlines.id, calendar_events.deadline_id))
        .where(eq(calendar_events.user_id, input.user_id))
        .orderBy(calendar_events.start)
    })
});