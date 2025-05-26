import { eq } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { users } from "~/server/db/schema";

export const usersRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ 
        name: z.string().min(1),
        email: z.string().min(1),
        clerk_id: z.string().min(1),
    }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(users).values({
        name: input.name,
        email: input.email,
        clerk_id: input.clerk_id,
      });
    }),

  delete: publicProcedure
    .input(z.object({
        clerk_id: z.string().min(1)
    }))
    .mutation(async ({ ctx, input }) => {
        await ctx.db.delete(users).where(eq(users.clerk_id, input.clerk_id))
    }),

    update: publicProcedure
      .input(
        z.object({
          // Require at least one identifier
          id: z.number().optional(),
          clerk_id: z.string().optional(),
          data: z.object({
            name: z.string().max(256).optional(),
            email: z.string().email().max(256).optional(),
            googleCalendarAccessToken: z.string().optional().nullable(),
            googleCalendarRefreshToken: z.string().optional().nullable(),
            googleCalendarTokenExpires: z.date().optional().nullable(),
            appleCalendarAccessToken: z.string().optional().nullable(),
            appleCalendarRefreshToken: z.string().optional().nullable(),
            appleCalendarTokenExpires: z.date().optional().nullable(),
          }).refine(
            (obj) => Object.keys(obj).length > 0,
            { message: "At least one field to update must be provided" }
          ),
        })
        .refine(
          (input) => input.id !== undefined || input.clerk_id !== undefined,
          { message: "Either 'id' or 'clerk_id' must be provided" }
        )
      )
      .mutation(async ({ ctx, input }) => {
        // Prepare filter condition based on provided id or clerk_id
        const filter = input.id !== undefined
          ? eq(users.id, input.id)
          : eq(users.clerk_id, input.clerk_id!);

        // Add updatedAt field with current timestamp
        const updateData = {
          ...input.data,
          updatedAt: new Date(),
        };

        const result = await ctx.db
          .update(users)
          .set(updateData)
          .where(filter)
          .returning();

        if (result.length === 0) {
          throw new Error("User not found");
        }

        return result[0];
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