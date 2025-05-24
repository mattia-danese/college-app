import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { supplements } from "~/server/db/schema";

export const supplementsRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({
        school_id: z.number().int().positive(), 
        prompt: z.string().min(1),
        description: z.string().min(1),
        word_count: z.string().min(1),
    }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(supplements).values({
        school_id: input.school_id,
        prompt: input.prompt,
        description: input.description,
        word_count: input.word_count
      });
    }),
});