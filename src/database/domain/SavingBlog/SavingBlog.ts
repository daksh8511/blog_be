import type { FastifyReply, FastifyRequest } from "fastify";
import { db } from "../../client/client.js";
import { SavingBlogSchema } from "../../schema/schema.js";
import { and, eq } from "drizzle-orm";

const SavingBlog = async (app: any, options: any) => {
  app.get(
    "/find_save_blog/:blogid/:userid",
    async (
      req: FastifyRequest<{ Params: { blogid: string; userid: string } }>,
      reply: FastifyReply,
    ) => {
      const blogid = Number(req.params.blogid);
      const userid = Number(req.params.userid);

      if (Number.isNaN(blogid) || Number.isNaN(userid)) {
        return reply.status(400).send({
          msg: "Invalid ids",
          success: false,
        });
      }

      try {
        const existing = await db
          .select()
          .from(SavingBlogSchema)
          .where(and(eq(SavingBlogSchema.blogid, blogid), eq(SavingBlogSchema.userid, userid)))

          if(existing.length > 0){
            return reply.status(201).send({msg : 'Blog is already saved', success : true, existing})
          }

          return reply.status(201).send({msg : 'Blog is not saved', success : false})
      } catch (error) {
        console.error("server side error : ", error);
        return reply
          .status(501)
          .send({ msg: "server side error ", success: false });
      }
    },
  );

  app.post(
    "/save_blog",
    async (
      req: FastifyRequest<{ Body: { blogid: number; userid: number } }>,
      reply: FastifyReply,
    ) => {
      const blogid = Number(req.body.blogid);
      const userid = Number(req.body.userid);

      if (!blogid || !userid) {
        return reply
          .status(401)
          .send({ msg: "blog and user id are not provided", success: false });
      }

      try {
        const saveBlog = await db
          .insert(SavingBlogSchema)
          .values({ blogid: blogid, userid: userid })
          .returning();

        if (saveBlog.length > 0) {
          return reply.status(201).send({
            msg: "Blog are saved successfully",
            success: true,
          });
        }
      } catch (error) {
        console.error("Server side error : ", error);
        return reply
          .status(501)
          .send({ msg: "Server side error", success: false });
      }
    },
  );

  app.delete('/remove_blog/:blogid/:userid', async (req : FastifyRequest<{Params : {blogid : number, userid : number}}>, reply : FastifyReply) => {
    const blogid = Number(req.params.blogid); 
    const userid = Number(req.params.userid); 

    if(!blogid || !userid){
        return reply.status(401).send({msg : "Blog or user id are not provided", success : false})
    }

    try {
        const deleteBlog = await db.delete(SavingBlogSchema).where(and(eq(SavingBlogSchema.blogid, blogid), eq(SavingBlogSchema.userid, userid))).returning();

        return reply.status(201).send({msg : 'Blog is removed', success : true})

    } catch (error) {
        console.error("Server side error : ", error)
        return reply.status(501).send({msg : 'server side error', success : false})
    }
  })
};

export default SavingBlog;
