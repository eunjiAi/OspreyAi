import React from "react";
import { Route } from "react-router-dom";

import PostsDetail from "../pages/posts/PostsDetail";
import PostsCreate from "../pages/posts/PostsCreate";

const postsRouter = [
  <Route path="/posts/new" element={<PostsCreate />} />,
  <Route path="/posts/:id" element={<PostsDetail />} />,
];

export default postsRouter;
