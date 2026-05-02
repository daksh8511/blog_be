import type { FastifyReply, FastifyRequest } from "fastify";
import { db } from "../../client/client.js";
import { BlogSchema } from "../../schema/schema.js";
import { eq } from "drizzle-orm";

const UploadEditBlog = async (app: any, options: any) => {
  app.post(
    "/upload_blog",
    async (
      req: FastifyRequest<{ Body: { content: any; authorid: number; status : string; blog_title : string, blog_category : string, blog_cover_image : string } }>,
      reply: FastifyReply,
    ) => {
      const { content, authorid, status, blog_title, blog_cover_image, blog_category } = req.body;

      if (!content) {
        return reply
          .status(401)
          .send({ msg: "Content are required", success: false });
      }

      if (!authorid) {
        return reply
          .status(401)
          .send({ msg: "Author ID are required", success: false });
      }

      try {
        const CreateBlog = await db
          .insert(BlogSchema)
          .values({ content, authorid, blog_title, status, blog_category, blog_cover_image })
          .returning();

        if (CreateBlog.length === 0) {
          return reply
            .status(401)
            .send({ msg: "Something wrong, please try again", success: false });
        }
        return reply
          .status(201)
          .send({ msg: "Blog create successfully", success: true });
      } catch (error) {
        console.error("Error : ", error);
        return reply
          .status(501)
          .send({ msg: "Server side error", success: false });
      }
    },
  );

  app.patch(
    "/edit/:blogid",
    async (
      req: FastifyRequest<{
        Params: { blogid: string };
        Body: { content: any, status : string, blog_title?: string, blog_category?: string, blog_cover_image?: string };
      }>,
      reply: FastifyReply,
    ) => {
      const { blogid } = req.params;
      const { content, status, blog_title, blog_category, blog_cover_image } = req.body;
      const BlogIdInNumber = Number(blogid);

      if (!BlogIdInNumber) {
        return reply
          .status(401)
          .send({ msg: "Blog id are not available", success: false });
      }

      try {
        const findBlog = await db
          .select()
          .from(BlogSchema)
          .where(eq(BlogSchema.blogid, BlogIdInNumber));

        if (findBlog.length === 0) {
          return reply
            .status(401)
            .send({ msg: "Blog are not found", success: false });
        }

        await db
          .update(BlogSchema)
          .set({ 
            content: content, 
            status: status,
            ...(blog_title !== undefined && { blog_title }),
            ...(blog_category !== undefined && { blog_category }),
            ...(blog_cover_image !== undefined && { blog_cover_image })
          })
          .where(eq(BlogSchema.blogid, BlogIdInNumber))
          .returning();

          return reply.status(201).send({msg : 'Story update successfully', success : true})
      } catch (error) {
        console.error("server side error : ", error);
        return reply
          .status(501)
          .send({ msg: "server side error ", success: false });
      }
    },
  );

  app.delete(
    "/delete_blog/:blogid",
    async (
      req: FastifyRequest<{ Params: { blogid: string } }>,
      reply: FastifyReply,
    ) => {
      const { blogid } = req.params;
      const BlogIdInNumber = Number(blogid);

      if (!BlogIdInNumber) {
        return reply
          .status(401)
          .send({ msg: "Blog id not found", success: false });
      }

      try {
        const findBlog = await db
          .select()
          .from(BlogSchema)
          .where(eq(BlogSchema.blogid, BlogIdInNumber));

        if (findBlog.length === 0) {
          return reply
            .status(401)
            .send({ msg: "Blog are not found", success: false });
        }

        const deleteBlog = await db
          .delete(BlogSchema)
          .where(eq(BlogSchema.blogid, BlogIdInNumber))
          .returning();

        if (deleteBlog.length > 0) {
          return reply
            .status(201)
            .send({ msg: "Blog delete succesfull delete", success: true });
        }
      } catch (error) {
        console.error("server side error : ", error);
        return reply
          .status(501)
          .send({ msg: "Server side error", success: false });
      }
    },
  );

  app.get(
    "/get_all_by_id/:userId",
    async (
      req: FastifyRequest<{ Params: { userId: string } }>,
      reply: FastifyReply,
    ) => {
      const { userId } = req.params;
      const userIdInNumber = Number(userId);

      if (isNaN(userIdInNumber)) {
        return reply.status(400).send({
          msg: "Invalid user id",
          success: false,
        });
      }

      try {
        const blogs = await db
          .select()
          .from(BlogSchema)
          .where(eq(BlogSchema.authorid, userIdInNumber));

        return reply.status(200).send({
          msg: "Blogs fetched successfully",
          success: true,
          data: blogs,
        });
      } catch (error) {
        console.error("Error:", error);
        return reply.status(500).send({
          msg: "Server side error",
          success: false,
        });
      }
    },
  );

  app.get('/get_single_blog/:blogid', async(req : FastifyRequest<{Params : {blogid : string}}>, reply : FastifyReply) => {
    const {blogid} = req.params;
    const blogidInNumber = Number(blogid)

    if(!blogidInNumber){
      return reply.status(401).send({msg : "Blog id is not there", success : false})
    }

    try {
      const findBlog = await db.select().from(BlogSchema).where(eq(BlogSchema.blogid, blogidInNumber))
      if(findBlog.length === 0){
        return reply.status(400).send({msg : 'Blog are not found', success : false})
      }
      return reply.status(200).send({msg : 'Blog are successfully fetch', success : true, findBlog})
    } catch (error) {
      console.error("Error : ", error)
      return reply.status(500).send({msg : 'Server side error', success : false})
    }
  })
};

export default UploadEditBlog;
