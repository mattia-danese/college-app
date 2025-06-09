import { eq } from 'drizzle-orm';
import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { lists } from '~/server/db/schema';

export const listsRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        user_id: z.number().int().positive(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(lists).values({
        name: input.name,
        user_id: input.user_id,
      });
    }),

  get: publicProcedure
    .input(
      z.object({
        id: z.number().int().positive(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const [user_list] = await ctx.db
        .select()
        .from(lists)
        .where(eq(lists.id, input.id));

      return user_list ?? null;
    }),

  get_by_user: publicProcedure
    .input(
      z.object({
        user_id: z.number().int().positive(),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db
        .select()
        .from(lists)
        .where(eq(lists.user_id, input.user_id));
    }),
});
