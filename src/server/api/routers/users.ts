import { eq } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { users } from "~/server/db/schema";

export const usersRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ 
        name: z.string().min(1),
        email: z.string().min(1),
    }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(users).values({
        name: input.name,
        email: input.email,
      });
    }),

    get: publicProcedure
        .input(z.object({
            email: z.string().min(1),
        }))
        .query(async ({ ctx, input }) => {
            const [user] = await ctx.db
            .select()
            .from(users)
            .where(eq(users.email, input.email))

            return user ?? null
        }),

    get_all: publicProcedure
        .input(z.object({
            limit: z.number().optional()
        }))
        .query(async ({ ctx, input }) => {
            return input.limit
            ? await ctx.db.select().from(users).limit(input.limit)
            : await ctx.db.select().from(users);
        })
});