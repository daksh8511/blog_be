import type { FastifyReply, FastifyRequest } from "fastify";
import type {
  CreateAccountType,
  SigninAccountType,
} from "./CreateAccount.types.js";
import { db } from "../../client/client.js";
import { AuthSchema } from "../../schema/schema.js";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

const CreateAccount = async (app: any, option: any) => {
  app.post(
    "/create",
    async (
      req: FastifyRequest<{ Body: CreateAccountType }>,
      reply: FastifyReply,
    ) => {
      const { email, name, password,about_us, interest_category } = req.body;

      try {
        const findUser = await db
          .select()
          .from(AuthSchema)
          .where(eq(AuthSchema.email, email));

        if (findUser.length > 0) {
          return reply.status(400).send({
            msg: "User already registered",
            success: false,
          });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const createUser = await db
          .insert(AuthSchema)
          .values({ name, email, password: hashPassword, about_us, interest_category })
          .returning();

        const user = createUser[0];

        const token = app.jwt.sign({
          id: user!.id,
          email: user!.email,
        });

        return reply.status(201).send({
          msg: "Account created successfully",
          success: true,
          user,
          token,
        });
      } catch (error) {
        console.error("Error:", error);
        return reply.status(500).send({
          msg: "Internal server error",
          success: false,
        });
      }
    },
  );

  app.post(
    "/signin",
    async (
      req: FastifyRequest<{ Body: SigninAccountType }>,
      reply: FastifyReply,
    ) => {
      const { email, password } = req.body;

      try {
        const findUser = await db
          .select()
          .from(AuthSchema)
          .where(eq(AuthSchema.email, email));

        if (findUser.length === 0) {
          return reply.status(404).send({
            msg: "User not found",
            success: false,
          });
        }

        const user = findUser[0];

        const matchPassword = await bcrypt.compare(password, user!.password);

        if (!matchPassword) {
          return reply.status(201).send({
            msg: "Invalid credentials",
            success: false,
          });
        }

        const token = app.jwt.sign({
          id: user!.id,
          email: user!.email,
        });

        return reply.status(200).send({
          msg: "Login successfully",
          success: true,
          User: user,
          token,
        });
      } catch (error) {
        console.error("Error:", error);
        return reply.status(500).send({
          msg: "Internal server error",
          success: false,
        });
      }
    },
  );

  app.post(
    "/check_user",
    async (
      req: FastifyRequest<{ Body: { email: string } }>,
      reply: FastifyReply,
    ) => {
      const { email } = req.body;

      if (!email) {
        return reply
          .status(401)
          .send({ msg: "Email are not there", success: false });
      }

      try {
        const findUser = await db
          .select()
          .from(AuthSchema)
          .where(eq(AuthSchema.email, email));

        if (findUser.length > 0) {
          return reply
            .status(401)
            .send({
              msg: "User are already registered, please login",
              success: false,
            });
        }

        return reply
          .status(201)
          .send({ msg: "user not found, please next steps", success: true });
      } catch (error) {
        return reply
          .status(501)
          .send({ msg: "server side error", success: false });
      }
    },
  );
};

export default CreateAccount;
