ALTER TABLE "list_entries" DROP CONSTRAINT "list_entries_list_id_school_id_unique";--> statement-breakpoint
ALTER TABLE "list_entries" ADD COLUMN "user_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "list_entries" ADD CONSTRAINT "list_entries_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "list_entries" ADD CONSTRAINT "list_entries_user_id_school_id_unique" UNIQUE("user_id","school_id");