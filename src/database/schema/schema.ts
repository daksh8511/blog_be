import 'dotenv/config'
import { integer, jsonb, pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core'

export const AuthSchema = pgTable('create_table', {
    id : serial().primaryKey(),
    name : varchar('name').notNull(),
    email : varchar('email').notNull().unique(),
    password : varchar('password').notNull(),
    create_at : timestamp().defaultNow()
})


export const BlogSchema = pgTable("blogs", {
    blogid: serial("blogid").primaryKey(),
    create_at: timestamp("create_at").defaultNow(),
    content: jsonb("content").notNull(),

    authorid: integer("authorid")
        .notNull()
        .references(() => AuthSchema.id),

    likes: integer("likes").default(0),
    status: varchar("status").notNull().default("draft"),
    blog_category: varchar("blog_category"),
    blog_title : varchar('blog_title').notNull().default('Hello world')
});