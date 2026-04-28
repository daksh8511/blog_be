import postgres from "postgres";
import {drizzle} from 'drizzle-orm/postgres-js'
import { AuthSchema } from "../schema/schema.js";

const client = postgres(process.env.DATABASE_URL!, {
    max : 10,
    idle_timeout : 20,
    max_lifetime : 10
})

export const db = drizzle(client, {logger :true, schema : { auth: AuthSchema}})