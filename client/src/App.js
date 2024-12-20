import React, { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import SquatFeedback from "./pages/SquatFeedback/SquatFeedback";
import Board from "./pages/Board/Board";
import BoardDetail from "./pages/Board/BoardDetail"; 
import BoardCreate from "./pages/Board/BoardCreate"; 
import FaceLogin from "./pages/Login/FaceLogin";
import Signup from "./pages/Signup/Signup";
import MyPage from "./pages/MyPage/MyPage";
import MyPageUpdate from "./pages/MyPage/MyPageUpdate";

function App() {
  const [boardResults, setBoardResults] = useState(null); // Board 검색 결과 상태
  const [generalResults, setGeneralResults] = useState(null); // 다른 페이지 검색 결과 상태

  const resetSearchInput = () => {
    setBoardResults(null);
    setGeneralResults(null);
  };

  return (
    <Router>
      {/* Header에 검색 결과 업데이트 처리 추가 */}
      <Header
        updateBoardResults={setBoardResults}
        updateGeneralResults={setGeneralResults}
        resetSearchInput={resetSearchInput}
      />

      <Routes>
        {/* 검색 결과 전달 및 기본 경로 */}
        <Route path="/" element={<Home searchResults={generalResults} />} />
        <Route path="/SquatFeedback" element={<SquatFeedback />} />

        <Route path="/FaceLogin" element={<FaceLogin />} />

        <Route path="/Signup" element={<Signup />} />
        <Route path="/MyPage" element={<MyPage />} />
        <Route path="/MyPageUpdate" element={<MyPageUpdate />} />

        {/* Board 관련 라우트에 검색 결과 전달 */}
        <Route path="/Board" element={<Board searchResults={boardResults} />} />
        <Route path="/Board/new" element={<BoardCreate />} />
        <Route path="/Board/:id" element={<BoardDetail />} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
