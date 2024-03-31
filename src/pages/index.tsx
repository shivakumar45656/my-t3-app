import Head from "next/head";
import Link from "next/link";

import { useEffect } from "react";

import { api } from "~/utils/api";

export let token: string = "";

export default function Home() {
  const redirectLoc = api.user.redirect.useQuery();
  // const catelogueResult = api.catalogue.list.useInfiniteQuery(
  //   {
  //     limit: 10,
  //   },
  //   {
  //     getNextPageParam: (lastPage) => lastPage.nextCursor,
  //     initialCursor: 1, // <-- optional you can pass an initialCursor
  //   },
  // );

  // const userCatMapping = api.catalogue.remove.useMutation();

  // const paginateCategories = async () => {
  //   let result = await catelogueResult
  //     .fetchNextPage({})
  //     .then((res) => console.log(res));
  // };

  // useEffect(() => {
  //   userCatMapping.mutate(
  //     {
  //       category_id: 6,
  //     },
  //     {
  //       onSettled(data, error) {
  //         if (error) {
  //           alert(error.message);
  //         } else if (data && data.status === 200) {
  //           alert(data.message);
  //         }
  //       },
  //     },
  //   );
  // }, []);

  // const callCatelogue = async () => {
  //   paginateCategories();
  // };

  useEffect(() => {
    if (redirectLoc.status !== "pending") {
      if (redirectLoc.status !== "error") {
        location.href = "/catalogue";
      } else {
        location.href = "/signup";
      }
    }
  }, [redirectLoc.status]);

  return (
    <>
      <h1>home page nothing here</h1>
    </>
  );
}
