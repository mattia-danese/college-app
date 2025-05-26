ALTER TABLE "deadlines" DROP CONSTRAINT "deadlines_school_id_schools_id_fk";
--> statement-breakpoint
ALTER TABLE "list_entries" DROP CONSTRAINT "list_entries_list_id_lists_id_fk";
--> statement-breakpoint
ALTER TABLE "list_entries" DROP CONSTRAINT "list_entries_school_id_schools_id_fk";
--> statement-breakpoint
ALTER TABLE "lists" DROP CONSTRAINT "lists_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "supplements" DROP CONSTRAINT "supplements_school_id_schools_id_fk";
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "clerk_id" text;--> statement-breakpoint
ALTER TABLE "deadlines" ADD CONSTRAINT "deadlines_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "list_entries" ADD CONSTRAINT "list_entries_list_id_lists_id_fk" FOREIGN KEY ("list_id") REFERENCES "public"."lists"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "list_entries" ADD CONSTRAINT "list_entries_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lists" ADD CONSTRAINT "lists_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supplements" ADD CONSTRAINT "supplements_school_id_schools_id_fk" FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_clerk_id_unique" UNIQUE("clerk_id");