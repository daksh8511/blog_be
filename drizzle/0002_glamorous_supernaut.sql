CREATE TABLE "saving_blog" (
	"blogid" integer,
	"userid" integer,
	"save_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "saving_blog" ADD CONSTRAINT "saving_blog_blogid_blogs_blogid_fk" FOREIGN KEY ("blogid") REFERENCES "public"."blogs"("blogid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saving_blog" ADD CONSTRAINT "saving_blog_userid_create_table_id_fk" FOREIGN KEY ("userid") REFERENCES "public"."create_table"("id") ON DELETE no action ON UPDATE no action;