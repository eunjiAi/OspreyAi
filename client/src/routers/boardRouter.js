import React from "react";
import { Route } from "react-router-dom";

import BoardDetail from "../pages/Board/BoardDetail";
import BoardCreate from "../pages/Board/BoardCreate";

const boardRouter = [
  <Route path="/Board/new" element={<BoardCreate />} />,
  <Route path="/Board/:id" element={<BoardDetail />} />,
];

export default boardRouter;
