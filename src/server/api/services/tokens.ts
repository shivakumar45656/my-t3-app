export const updateUserTokens = async (
  ctx: any,
  userId: number,
  tokens: any,
) => {
  let existingTokens = await ctx.db.token.findFirst({
    where: { user_id: userId },
  });
  if (existingTokens) {
    await ctx.db.token.update({
      where: { user_id: userId },
      data: { access_token: tokens.access, refresh_token: tokens.refresh },
    });
  } else {
    await ctx.db.token.create({
      data: {
        user_id: userId,
        access_token: tokens.access,
        refresh_token: tokens.refresh,
      },
    });
  }
};

export const invalidateSession = async ({ ctx }: any) => {
  await ctx.db.token.update({
    where: { user_id: ctx.user.userId },
    data: { access_token: null, refresh_token: null },
  });
  return {
    status: 200,
    message: "user logged out",
  };
};
