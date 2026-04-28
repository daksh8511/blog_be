ALTER TABLE "blogs" ADD COLUMN "category" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "blogs" ADD COLUMN "status" varchar DEFAULT 'draft';