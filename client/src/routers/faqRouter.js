import React from "react";
import { Route } from "react-router-dom";

import FaqDetail from "../pages/faq/FaqDetail";
import FaqWrite from "../pages/faq/FaqWrite";
import FaqList from "../pages/faq/FaqList";

const faqRouter = [
  <Route path="/faq" element={<FaqList />} />,
  <Route path="/faqd/:no" element={<FaqDetail />} />,
  <Route path="/faqw" element={<FaqWrite />} />,
];

export default faqRouter;
