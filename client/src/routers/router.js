import React from "react";
import { Routes, Route } from "react-router-dom";

import memberRouter from "./memberRouter";
import squatFeedbackRouter from "./squatFeedbackRouter";
import postsRouter from "./postsRouter";
import noticeRouter from "./noticeRouter";
import faqRouter from "./faqRouter";
import qnaRouter from "./qnaRouter";

const AppRouter = () => {
  return (
    <Routes>
      {memberRouter}
      {squatFeedbackRouter}
      {postsRouter}
      {noticeRouter}
      {faqRouter}
      {qnaRouter}
    </Routes>
  );
};

export default AppRouter;
