DROP INDEX "unique_user_deadline_event";--> statement-breakpoint
DROP INDEX "unique_user_supplement_event";--> statement-breakpoint
ALTER TABLE "calendar_events" ALTER COLUMN "supplement_id" SET NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "unique_user_supplement_event" ON "calendar_events" USING btree ("user_id","supplement_id");