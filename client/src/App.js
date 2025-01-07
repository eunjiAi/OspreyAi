import React, { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AppRouter from "./routers/router";

import Home from "./pages/home/Home";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import Posts from "./pages/posts/Posts";
import Notice from "./pages/notice/Notice";
import QuestionList from "./pages/qna/QuestionList";
import ChatBot from "./components/chat/ChatBot";

function App() {
  const [postsResults, setPostsResults] = useState(null); // Board 검색 결과 상태
  const [noticeResults, setNoticeResults] = useState(null); // Notice 검색 결과 상태
  const [generalResults, setGeneralResults] = useState(null); // 다른 페이지 검색 결과 상태
  const [questionResults, setQuestionResults] = useState(null);

  const resetSearchInput = () => {
    setPostsResults(null);
    setNoticeResults(null);
    setGeneralResults(null);
    setQuestionResults(null);
  };

  return (
    <Router>
      <Header
        updatePostsResults={setPostsResults}
        updateNoticeResults={setNoticeResults}
        updateGeneralResults={setGeneralResults}
        updateQuestionResults={setQuestionResults}
        resetSearchInput={resetSearchInput}
      />

      <Routes>
        <Route path="/" element={<Home searchResults={generalResults} />} />,
        <Route path="/posts" element={<Posts searchResults={postsResults} />} />,
        <Route path="/notice" element={<Notice searchResults={noticeResults} />} />,
        <Route path="/qna" element={<QuestionList searchResults={questionResults} />} />,
        <Route path="/*" element={<AppRouter />} />,
      </Routes>

      <ChatBot />
      <Footer />
    </Router>
  );
}

export default App;
