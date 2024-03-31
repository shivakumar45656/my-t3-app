import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { createUser, verifyUser } from "../services/user";
import { invalidateSession } from "../services/tokens";

const userCreationSchema = {
  name: z
    .string()
    .regex(/^[a-zA-Z\s]+$/, {
      message: "Name must contain only alphabets and spaces",
    }),
  email: z.string().email({ message: "Invalid email format" }),
  password: z
    .string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      {
        message:
          "Password must contain at least 1 lowercase letter, 1 uppercase letter, 1 digit, 1 special character, and be at least 8 characters long",
      },
    ),
};

const loginSchema = {
  email: z.string().email({ message: "Invalid email format" }),
  password: z.string(),
};

export const userRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object(userCreationSchema))
    .mutation(createUser),

  login: publicProcedure.input(z.object(loginSchema)).mutation(verifyUser),

  logout: protectedProcedure.mutation(invalidateSession),

  redirect: protectedProcedure.query(() => {
    return {
      status : 200,
      location : '/catalogue'
    };
  })
});
