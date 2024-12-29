import React from "react";
import { Routes, Route } from "react-router-dom";

import memberRouter from "./memberRouter";
import squatFeedbackRouter from "./squatFeedbackRouter";
import postsRouter from "./postsRouter";
import noticeRouter from "./noticeRouter";
import faqRouter from "./faqRouter";

const AppRouter = () => {
  return (
    <Routes>
      {memberRouter}
      {squatFeedbackRouter}
      {postsRouter}
      {noticeRouter}
      {faqRouter}
    </Routes>
  );
};

export default AppRouter;
