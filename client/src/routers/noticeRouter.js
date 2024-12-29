import React from "react";
import { Route } from "react-router-dom";

import NoticeDetail from "../pages/notice/NoticeDetail";
import NoticeCreate from "../pages/notice/NoticeCreate";
import NoticeEdit from "../pages/notice/NoticeEdit";

const noticeRouter = [
  <Route path="/notice/new" element={<NoticeCreate />} />,
  <Route path="/notice/:id" element={<NoticeDetail />} />,
  <Route path="/notice/edit/:id" element={<NoticeEdit />} />,
];

export default noticeRouter;
