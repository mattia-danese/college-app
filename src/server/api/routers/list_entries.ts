import { eq } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { list_entries, lists, schools } from "~/server/db/schema";

export const listEntriesRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ 
        list_id: z.number().int().positive(),
        school_id: z.number().int().positive(),
    }))
    .mutation(async ({ ctx, input }) => {
        await ctx.db.insert(list_entries)
        .values({
            list_id: input.list_id,
            school_id: input.school_id,
        })
        .onConflictDoNothing();
    }),

    get: publicProcedure
    .input(z.object({
        id: z.number().int().positive()
    }))
    .query(async ({ ctx, input }) => {        
        const [list_entry] = await ctx.db
        .select()
        .from(list_entries)
        .where(eq(list_entries.id, input.id))

        return list_entry ?? null
    }),

    get_by_list: publicProcedure
    .input(z.object({
        list_id: z.number().int().positive()
    }))
    .query(({ ctx, input }) => {
        return ctx.db
        .select()
        .from(list_entries)
        .where(eq(list_entries.list_id, input.list_id))
    }),

    get_by_user: publicProcedure
    .input(z.object({
        user_id: z.number().int().positive()
    }))
    .query(({ ctx, input }) => {
        return ctx.db
        .select({
            user_id: lists.user_id,
            list_id: lists.id,
            entry_id: list_entries.id,
            list_name: lists.name,
            school: schools, // This will be null for empty lists
        })
        .from(lists)
        .leftJoin(list_entries, eq(list_entries.list_id, lists.id))
        .leftJoin(schools, eq(list_entries.school_id, schools.id))
        .where(eq(lists.user_id, input.user_id));
    })
});