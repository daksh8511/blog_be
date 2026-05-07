import 'dotenv/config'
import fastify from "fastify";
import { db } from '../database/client/client.js';
import { sql } from 'drizzle-orm';
import jwt from '@fastify/jwt'
import cors from '@fastify/cors'
import CreateAccount from '../database/domain/CreateAccount/CreateAccount.js';
import UploadEditBlog from '../database/domain/UploadEditBlog/UploadEditBlog.js';
import HomeBlog from '../database/domain/HomePageBlog/HomeBlog.js';
import SavingBlog from '../database/domain/SavingBlog/SavingBlog.js';
import ProfileSection from '../database/domain/ProfileSection/ProfileSection.js';

const app = fastify({ logger: false })

app.register(cors, {
    methods : ['POST','DELETE', 'PATCH'],
    origin : 'http://localhost:5173'
})

app.register(jwt, {
  secret: process.env.JWT_SECRET || "supersecret",
});

app.register(CreateAccount, {prefix : '/api'})
app.register(UploadEditBlog, {prefix : '/api'})
app.register(HomeBlog, {prefix : '/api'})
app.register(SavingBlog, {prefix : '/api'})
app.register(ProfileSection, {prefix : '/api'})

const start = async () => {
    try {
        await db.execute(sql`select 1`)
        console.log('database connected successfully : ')
        const ports = Number(process.env.PORT) || 3004;
        await app.listen({
            host : '0.0.0.0',
            port : ports
        })

        console.log('server start on the : ',ports)
    } catch (error) {
        console.error('error : ', error)
    }
}

start()