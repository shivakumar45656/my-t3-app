
import {useEffect} from 'react'

import { api } from "~/utils/api";

export default function PopulateDB() {

  const catelogueResult = api.catalogue.populate.useMutation();


  useEffect(() => {
    catelogueResult.mutate();
  },[]);

  return (
    <>
    </>
  );
}
