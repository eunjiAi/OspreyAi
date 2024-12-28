import React from "react";
import { Route } from "react-router-dom";

import NoticeDetail from "../pages/Notice/NoticeDetail";
import NoticeCreate from "../pages/Notice/NoticeCreate";
import NoticeEdit from "../pages/Notice/NoticeEdit";

const noticeRouter = [
  <Route path="/Notice/new" element={<NoticeCreate />} />,
  <Route path="/Notice/:id" element={<NoticeDetail />} />,
  <Route path="/Notice/edit/:id" element={<NoticeEdit />} />,
];

export default noticeRouter;
