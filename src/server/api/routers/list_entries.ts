import { eq, sql } from 'drizzle-orm';
import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { list_entries, lists, schools } from '~/server/db/schema';

export const listEntriesRouter = createTRPCRouter({
  create_or_update: publicProcedure
    .input(
      z.object({
        user_id: z.number().int().positive(),
        list_id: z.number().int().positive(),
        school_id: z.number().int().positive(),
        deadline_id: z.number().int().positive(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const rows = await ctx.db
        .insert(list_entries)
        .values({
          user_id: input.user_id,
          list_id: input.list_id,
          school_id: input.school_id,
          deadline_id: input.deadline_id,
        })
        .onConflictDoUpdate({
          target: [list_entries.user_id, list_entries.school_id],
          set: {
            list_id: input.list_id,
            deadline_id: input.deadline_id,
            updatedAt: new Date(),
          },
        })
        .returning({
          id: list_entries.id,
          wasInserted: sql<boolean>`(xmax = 0)`,
        });

      const result = rows[0];
      if (!result) {
        throw new Error(
          `Failed to create or update list entry. user_id: ${input.user_id} school_id: ${input.school_id} list_id: ${input.list_id} deadline_id: ${input.deadline_id}`,
        );
      }

      return {
        list_entry_id: result.id,
        action: result.wasInserted ? 'created' : 'updated',
      } as const;
    }),

  get: publicProcedure
    .input(
      z.object({
        id: z.number().int().positive(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const [list_entry] = await ctx.db
        .select()
        .from(list_entries)
        .where(eq(list_entries.id, input.id));

      return list_entry ?? null;
    }),

  get_by_list: publicProcedure
    .input(
      z.object({
        list_id: z.number().int().positive(),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db
        .select()
        .from(list_entries)
        .where(eq(list_entries.list_id, input.list_id));
    }),

  get_by_user: publicProcedure
    .input(
      z.object({
        user_id: z.number().int().positive(),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db
        .select({
          entry_id: list_entries.id,
          school_id: list_entries.school_id,
          list_id: list_entries.list_id,
        })
        .from(list_entries)
        .innerJoin(lists, eq(list_entries.list_id, lists.id))
        .where(eq(lists.user_id, input.user_id));
    }),

  delete: publicProcedure
    .input(
      z.object({
        list_entry_id: z.number().int().positive(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(list_entries)
        .where(eq(list_entries.id, input.list_entry_id));
    }),
});
