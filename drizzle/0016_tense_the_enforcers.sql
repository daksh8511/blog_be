ALTER TABLE "blogs" ALTER COLUMN "blog_category" SET DEFAULT 'Other';--> statement-breakpoint
ALTER TABLE "create_table" ADD COLUMN "followers" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "create_table" ADD COLUMN "about_us" varchar;--> statement-breakpoint
ALTER TABLE "create_table" ADD COLUMN "interest_category" varchar;