ALTER TABLE "public"."calendar_events" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."calendar_event_status_enum";--> statement-breakpoint
CREATE TYPE "public"."calendar_event_status_enum" AS ENUM('not_planned', 'planned', 'in_progress', 'completed');--> statement-breakpoint
ALTER TABLE "public"."calendar_events" ALTER COLUMN "status" SET DATA TYPE "public"."calendar_event_status_enum" USING "status"::"public"."calendar_event_status_enum";