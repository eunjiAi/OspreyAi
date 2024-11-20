import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home/Home';
import Header from './common/Header/Header';
import Footer from './common/Footer/Footer';
import SquatFeedback from './pages/SquatFeedback/SquatFeedback';
import Board from './pages/Board/Board';
import BoardCreate from './pages/Board/BoardCreate';
import BoardDetail from './pages/Board/BoardDetail';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import MyPage from './pages/MyPage/MyPage';
import MyPageUpdate from './pages/MyPage/MyPageUpdate';

function App() {
  const [posts, setPosts] = useState([
    { id: 1, title: '이용 후 운동 자세가 좋아졌습니다.', date: '2023-11-12', content: '상세 내용' },
    { id: 2, title: '운동하면서 느낀 점', date: '2023-11-11', content: '상세 내용' },
    { id: 3, title: '버전2로 언제 업데이트 되는 지 궁금합니다.', date: '2023-11-10', content: '상세 내용' },
  ]);

  return (
    <Router>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/SquatFeedback" element={<SquatFeedback />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/MyPage" element={<MyPage />} />
        <Route path="/MyPageUpdate" element={<MyPageUpdate />} />

        {/* 게시판 라우트에 posts와 setPosts를 전달 */}
        <Route path="/Board" element={<Board posts={posts} setPosts={setPosts} />} />
        <Route path="/BoardCreate" element={<BoardCreate posts={posts} setPosts={setPosts} />} />
        <Route path="/post/:id" element={<BoardDetail posts={posts} setPosts={setPosts} />} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
