import 'dotenv/config'
import { integer, jsonb, pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core'

export const AuthSchema = pgTable('create_table', {
    id : serial().primaryKey(),
    name : varchar('name').notNull(),
    email : varchar('email').notNull().unique(),
    password : varchar('password').notNull(),
    create_at : timestamp().defaultNow(),
    followers : integer('followers').default(0),
    about_us : varchar('about_us'),
    interest_category : varchar('interest_category')
})


export const BlogSchema = pgTable("blogs", {
    blogid: serial("blogid").primaryKey(),
    create_at: timestamp("create_at").defaultNow(),
    content: jsonb("content").notNull(),
    blog_short_description : varchar('blog_short_description'),
    authorid: integer("authorid")
        .notNull()
        .references(() => AuthSchema.id),

    likes: integer("likes").default(0),
    status: varchar("status").notNull().default("draft"),
    blog_category: varchar("blog_category").default('Other'),
    blog_title : varchar('blog_title').notNull().default('Hello world'),
    blog_views : integer('blog_views').default(0),
    blog_cover_image : varchar('blog_cover_image').notNull().default('')
});