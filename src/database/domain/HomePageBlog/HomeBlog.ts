import type { FastifyReply, FastifyRequest } from "fastify"
import { db } from "../../client/client.js"
import { BlogSchema } from "../../schema/schema.js"

const HomeBlog = async (app : any, option : any) => {
    app.get('/get_home_blogs', async (req : FastifyRequest, relpy : FastifyReply) => {
        try {
            const getBlogs = await db.select().from(BlogSchema)
            return relpy.status(201).send({msg : 'Blogs are fetched', getBlogs, success : true})
        } catch (error) {
            console.error("server side error : ", error)
            return relpy.status(501).send({msg : 'server side erorr', success : false})
        }
    })
}

export default HomeBlog