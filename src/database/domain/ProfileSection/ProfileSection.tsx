import type { FastifyReply, FastifyRequest } from "fastify";
import { db } from "../../client/client.js";
import { BlogSchema, SavingBlogSchema } from "../../schema/schema.js";
import { eq } from "drizzle-orm";

const ProfileSection = async (app: any, options: any) => {
  app.get(
    "/get_profile/:userid",
    async (
      req: FastifyRequest<{ Params: { userid: number } }>,
      reply: FastifyReply,
    ) => {
      const userid = req.params.userid;

      if (!userid) {
        return reply
          .status(401)
          .send({ msg: "Userid are not provide", success: false });
      }

      try {
        const getCreatedBlogs = await db
          .select()
          .from(BlogSchema)
          .where(eq(BlogSchema.authorid, userid));
        const savedBlogs = await db
          .select({
            blogid: BlogSchema.blogid,
            create_at: BlogSchema.create_at,
            content: BlogSchema.content,
            blog_short_description: BlogSchema.blog_short_description,
            authorid: BlogSchema.authorid,
            likes: BlogSchema.likes,
            status: BlogSchema.status,
            blog_category: BlogSchema.blog_category,
            blog_title: BlogSchema.blog_title,
            blog_views: BlogSchema.blog_views,
            blog_cover_image: BlogSchema.blog_cover_image,
          })
          .from(SavingBlogSchema)
          .innerJoin(BlogSchema, eq(SavingBlogSchema.blogid, BlogSchema.blogid))
          .where(eq(SavingBlogSchema.userid, userid));

        return reply.status(201).send({msg : 'Profile fetch successfully', savedBlogs, getCreatedBlogs, success : true})
      } catch (error) {
        console.error("server side error : ", error);
        return reply
          .status(501)
          .send({ msg: "server side error", success: false });
      }
    },
  );
};

export default ProfileSection;
