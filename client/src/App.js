import React, { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AppRouter from "./routers/router";

import Home from "./pages/Home/Home";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import Board from "./pages/Board/Board";
import Notice from "./pages/Notice/Notice";

function App() {
  const [boardResults, setBoardResults] = useState(null); // Board 검색 결과 상태
  const [noticeResults, setNoticeResults] = useState(null); // Notice 검색 결과 상태
  const [generalResults, setGeneralResults] = useState(null); // 다른 페이지 검색 결과 상태

  const resetSearchInput = () => {
    setBoardResults(null);
    setNoticeResults(null);
    setGeneralResults(null);
  };

  return (
    <Router>
      {/* Header에 검색 결과 업데이트 처리 */}
      <Header
        updateBoardResults={setBoardResults}
        updateNoticeResults={setNoticeResults}
        updateGeneralResults={setGeneralResults}
        resetSearchInput={resetSearchInput}
      />

      <Routes>
        {/* 검색 결과 전달 및 기본 경로 */}
        <Route path="/" element={<Home searchResults={generalResults} />} />
        <Route path="/Board" element={<Board searchResults={boardResults} />} />
        <Route path="/Notice" element={<Notice searchResults={noticeResults} />} />
       

        {/* 나머지경로 AppRouter 에서 처리리 */}
        <Route path="/*" element={<AppRouter />} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
