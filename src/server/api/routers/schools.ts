import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { schools } from "~/server/db/schema";

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
});