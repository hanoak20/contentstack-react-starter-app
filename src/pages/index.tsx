import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import RenderComponents from "../components/render-components";
import { getPageRes } from "../helper";
import Skeleton from "react-loading-skeleton";
import { useLivePreviewCtx } from "../context/live-preview-context-provider";
import { EntryProps } from "../typescript/components";
import { Page } from "../typescript/pages";
import Personalization from "@contentstack/personalization-sdk-js";

export default function Home({ entry }:{entry:({page, blogPost}:EntryProps)=> void}) {
  const lpTs = useLivePreviewCtx();
  const params = useParams();
  const entryUrl = params.page ? `/${params.page}` : "/";
  const history = useNavigate();
  const [getEntries, setEntries] = useState({} as Page);
  const [error, setError] = useState(false);

  async function fetchData() {
    try {
      const result = await getPageRes(entryUrl);
      !result && setError(true);
      setEntries({ ...result });
      entry({ page: [result] });
    } catch (error) {
      setError(true);
      console.error(error);
    }
  }

  const setImpression = () => {
    if(entryUrl === "/about-us") {
      Personalization.triggerImpression(process.env.REACT_APP_PERSONALIZATION_AB_EXPERIENCE_ID as string);
    }
  }

  useEffect(() => {
    fetchData();
    setImpression();
    error && history("/404");
  }, [entryUrl, lpTs, error]);

  return Object.keys(getEntries).length ? (
    <RenderComponents
      pageComponents={getEntries?.page_components}
      contentTypeUid='page'
      entryUid={getEntries?.uid}
      locale={getEntries?.locale}
      entryUrl={entryUrl}
    />
  ) : (
    <Skeleton count={5} height={400} />
  );
}
