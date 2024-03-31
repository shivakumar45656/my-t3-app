import { hashPassword, comparePassword } from "../auth/passwordManager";
import { generateAccessToken, generateRefreshToken } from "../auth/tokens";
import { updateUserTokens } from "./tokens";

export const getUser = async ({ dbconn, email }: any) => {
  return await dbconn.user.findFirst({
    where: { email: email },
  });
};

export const createUser = async ({ ctx, input }: any) => {
  console.log(input);
  if (await getUser({ dbconn: ctx.db, email: input.email })) {
    return {
      status: 400,
      message: "user already exists, please login",
    };
  }

  let password = await hashPassword(input.password);
  if (!password) throw new Error("unable to hash password");
  await ctx.db.user.create({
    data: {
      name: input.name,
      email: input.email,
      password: password,
    },
  });
  return {
    status: 201,
    message: "user registered successfully",
  };
};

export const verifyUser = async ({ ctx, input }: any) => {
  let user = await getUser({ dbconn: ctx.db, email: input.email });
  console.log(user);
  if (user) {
    if (await comparePassword(input.password, user.password)) {
      let payload = {
        userId: user.id,
        email: user.email,
      };
      let accessToken = generateAccessToken(payload);
      let refreshToken = generateRefreshToken(payload);
      updateUserTokens(ctx, user.id, {
        access: accessToken,
        refresh: refreshToken,
      });
      let result = {
        status: 200,
        data: {
          userId: user.id,
          accessToken: accessToken,
          // refreshToken: refreshToken,
        },
      };
      return result;
    }
    throw new Error("User not found");
  }
};
