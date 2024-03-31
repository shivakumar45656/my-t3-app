import { faker } from "@faker-js/faker";

const getCatalogueCart = async (dbconn: any, userId: number, catRange: any) => {
  let result: any = [];
  const userCatMapping = await dbconn.userCategoryMapping.findMany({
    select: {
      category_id: true,
    },
    where: {
      user_id: userId,
      category_id: {
        gte: catRange.start,
        lte: catRange.end,
      },
    },
  });
  userCatMapping.forEach((cat: any) => result.push(cat.category_id));
  return result;
};

const modifyResult = (items: any, selectedList: any) => {
  console.log("items", items);
  console.log("select", selectedList);
  items.forEach((item: any) => {
    if (selectedList.includes(item.id)) item.selected = true;
    else item.selected = false;
  });
  return items;
};

export const listCatalogue = async ({ ctx, input }: any) => {
  const limit = input.limit ?? 10;
  const { cursor } = input;
  let items = await ctx.db.category.findMany({
    take: limit + 1,
    cursor: { id: cursor },
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      id: "asc",
    },
  });
  let nextCursor: typeof cursor | undefined = undefined;
  if (items.length > limit) {
    const nextItem = items.pop();
    nextCursor = nextItem!.id;
  }
  let selectedCategories = await getCatalogueCart(ctx.db, ctx.user.userId, {
    start: cursor,
    end: nextCursor,
  });

  if (selectedCategories.length > 0) {
    items = modifyResult(items, selectedCategories);
  }

  console.log(ctx.user);
  return {
    items,
    nextCursor,
  };
};

function createRandomCategory(): any {
  const categories: Set<string> = new Set();
  const numberOfCategories = 100;

  while (categories.size < numberOfCategories) {
    let name: string;
    name = faker.commerce.productName();
    categories.add(name);
  }
  console.log(categories);
  return categories;
}

export const PopulateDB = async ({ ctx }: any) => {
  let data = createRandomCategory();
  for (const cat of data) {
    await ctx.db.category.create({
      data: { name: cat },
    });
  }
};

const verifyCategory = async ({ ctx, input }: any) => {
  return await ctx.db.category.findFirst({
    where: {
      id: input.category_id,
    },
  });
};

const checkMappingExists = async ({ ctx, input }: any) => {
  let result = await ctx.db.userCategoryMapping.findFirst({
    where: {
      category_id: input.category_id,
      user_id: ctx.user.user_id,
    },
  });
  console.log(result);
  return result;
};

export const addToCatalogue = async ({ ctx, input }: any) => {
  if (!input.category_id) {
    throw new Error("no category_id found");
  }
  if (await verifyCategory({ ctx, input })) {
    if (await checkMappingExists({ ctx, input })) {
      return {
        status: 400,
        message: "mapping already exists",
      };
    }
    await ctx.db.userCategoryMapping.create({
      data: {
        user_id: ctx.user.userId,
        category_id: input.category_id,
      },
    });
    return {
      status: 201,
      message: "added to cart",
    };
  }
};

export const deleteFromCatalogue = async ({ ctx, input }: any) => {
  if (!input.category_id) {
    throw new Error("no category_id found");
  }
  if (await verifyCategory({ ctx, input })) {
    console.log(ctx.user.userId, input.category_id);
    await ctx.db.userCategoryMapping.deleteMany({
      where: {
        user_id: ctx.user.userId,
        category_id: input.category_id,
      },
    });
    return {
      status: 201,
      message: "remove from cart",
    };
  }
};
