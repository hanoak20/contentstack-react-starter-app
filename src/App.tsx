import React, { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "./components/layout";
import Home from "./pages/index";
import Blog from "./pages/blog";
import BlogPost from "./pages/blog-post";
import Error from "./pages/error";
import "./styles/third-party.css";
import "./styles/style.css";
import "./styles/modal.css";
import "@contentstack/live-preview-utils/dist/main.css";
import "react-loading-skeleton/dist/skeleton.css";
import { EntryProps } from "./typescript/components";
import Personalization from "@contentstack/personalization-sdk-js";
import {setUserIdCookie, getuserIdCookie} from "./helper"

const {
  REACT_APP_PERSONALIZE_EDGE_API_URL,
  REACT_APP_PERSONALIZATION_PROJECT_UID,
} = process.env;

function App() {
  const [getEntry, setEntry] = useState({} as EntryProps );
  const [personalize, setPersonalize] = useState(false);

  function getPageRes(response: EntryProps) {
    setEntry(response);
  }

  useEffect(() => {
    // Personalization SDK initialization
    setUserIdCookie();
    Personalization.setEdgeApiUrl(REACT_APP_PERSONALIZE_EDGE_API_URL as string);
    console.info("REACT_APP_PERSONALIZATION_PROJECT_UID : ", REACT_APP_PERSONALIZATION_PROJECT_UID)
    Personalization.init(REACT_APP_PERSONALIZATION_PROJECT_UID as string, {
      edgeMode: true,
      userId: getuserIdCookie(),
    }).then(() => {
      console.log("Personalization SDK initialized")
      console.info("userId = ", Personalization.getUserId());
      setPersonalize(true);
    });
  }, []);


  return (
     <div className="App">
      { personalize && <Routes>
        <Route path="/" element={<Layout entry={getEntry} />}>
          <Route index element={<Home entry={getPageRes} />} />
          <Route path="/:page" element={<Home entry={getPageRes} />} />
          <Route path="/blog" element={<Blog entry={getPageRes} />} />
          <Route
            path="/blog/:blogId"
            element={<BlogPost entry={getPageRes} />}
          />
          <Route path="/404" element={<Error />}></Route>
          <Route path="*" element={<Error />}></Route>
        </Route>
      </Routes>
}
    </div>);
}

export default App;
