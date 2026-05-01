CREATE TABLE "create_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"email" varchar NOT NULL,
	"password" varchar NOT NULL,
	"create_at" timestamp DEFAULT now(),
	"followers" integer DEFAULT 0,
	"about_us" varchar,
	"interest_category" varchar,
	CONSTRAINT "create_table_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "blogs" (
	"blogid" serial PRIMARY KEY NOT NULL,
	"create_at" timestamp DEFAULT now(),
	"content" jsonb NOT NULL,
	"authorid" integer NOT NULL,
	"likes" integer DEFAULT 0,
	"status" varchar DEFAULT 'draft' NOT NULL,
	"blog_category" varchar DEFAULT 'Other',
	"blog_title" varchar DEFAULT 'Hello world' NOT NULL,
	"blog_views" integer DEFAULT 0,
	"blog_cover_image" varchar DEFAULT '' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "blogs" ADD CONSTRAINT "blogs_authorid_create_table_id_fk" FOREIGN KEY ("authorid") REFERENCES "public"."create_table"("id") ON DELETE no action ON UPDATE no action;