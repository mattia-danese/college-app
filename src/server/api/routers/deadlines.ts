import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { deadlines } from '~/server/db/schema';

export const deadlinesRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        school_id: z.number().int().positive(),
        application_type: z.enum(['RD', 'EA', 'ED', 'ED2']),
        date: z.string().refine((val) => !isNaN(Date.parse(val)), {
          message: 'Invalid date format',
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(deadlines).values({
        school_id: input.school_id,
        application_type: input.application_type,
        date: new Date(input.date),
      });
    }),
});
