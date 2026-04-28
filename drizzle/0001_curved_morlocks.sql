CREATE TABLE "blogs" (
	"id" serial PRIMARY KEY NOT NULL,
	"create_at" timestamp DEFAULT now(),
	"content" jsonb NOT NULL,
	"author" varchar NOT NULL,
	"likes" integer DEFAULT 0,
	"comment" varchar
);
--> statement-breakpoint
ALTER TABLE "create_table" ADD COLUMN "create_at" timestamp DEFAULT now();