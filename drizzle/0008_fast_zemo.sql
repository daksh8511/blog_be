ALTER TABLE "blogs" RENAME COLUMN "authorId" TO "authorid";--> statement-breakpoint
ALTER TABLE "blogs" DROP CONSTRAINT "blogs_authorId_create_table_id_fk";
--> statement-breakpoint
ALTER TABLE "blogs" ADD CONSTRAINT "blogs_authorid_create_table_id_fk" FOREIGN KEY ("authorid") REFERENCES "public"."create_table"("id") ON DELETE no action ON UPDATE no action;