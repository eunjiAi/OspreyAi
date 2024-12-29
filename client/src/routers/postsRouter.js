import React from "react";
import { Route } from "react-router-dom";

import BoardDetail from "../pages/posts/PostsDetail";
import BoardCreate from "../pages/posts/PostsCreate";

const boardRouter = [
  <Route path="/posts/new" element={<BoardCreate />} />,
  <Route path="/posts/:id" element={<BoardDetail />} />,
];

export default boardRouter;
