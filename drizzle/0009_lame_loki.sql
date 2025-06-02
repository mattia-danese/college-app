ALTER TABLE "calendar_events" ADD COLUMN "start" timestamp with time zone NOT NULL;--> statement-breakpoint
ALTER TABLE "calendar_events" ADD COLUMN "end" timestamp with time zone NOT NULL;--> statement-breakpoint
ALTER TABLE "calendar_events" DROP COLUMN "date";