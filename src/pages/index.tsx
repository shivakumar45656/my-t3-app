import Head from "next/head";
import Link from "next/link";

import { useEffect } from "react";

import { api } from "~/utils/api";

export let token: string = "";

export default function Home() {
  const redirectLoc = api.user.redirect.useQuery();

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
