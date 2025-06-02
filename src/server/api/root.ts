import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

import { postRouter } from "~/server/api/routers/post";
import { schoolsRouter } from "./routers/schools";
import { deadlinesRouter } from "./routers/deadlines";
import { supplementsRouter } from "./routers/supplements";
import { usersRouter } from "./routers/users";
import { listsRouter } from "./routers/lists";
import { listEntriesRouter } from "./routers/list_entries";
import { calendarEventsRouter } from "./routers/calendar_events";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  schools: schoolsRouter,
  deadlines: deadlinesRouter,
  supplements: supplementsRouter,
  users: usersRouter,
  lists: listsRouter,
  list_entries: listEntriesRouter,
  calendar_events: calendarEventsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
