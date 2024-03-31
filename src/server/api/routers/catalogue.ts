import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

import {
  listCatalogue,
  PopulateDB,
  addToCatalogue,
  deleteFromCatalogue,
} from "../services/catalogue";

const paginateSchema = {
  limit: z.number().min(1).max(100).nullish(),
  cursor: z.number().nullish(), // <-- "cursor" needs to exist, but can be any type
  direction: z.enum(["forward", "backward"]), // optional, useful for bi-directional query
};

export const catalogueRouter = createTRPCRouter({
  list: protectedProcedure.input(z.object(paginateSchema)).query(listCatalogue),
  populate: publicProcedure.mutation(PopulateDB),
  add: protectedProcedure
    .input(z.object({ category_id: z.number() }))
    .mutation(addToCatalogue),
  remove: protectedProcedure
    .input(z.object({ category_id: z.number() }))
    .mutation(deleteFromCatalogue),
});
