import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Header from "./components/common/Header/Header";
import Footer from "./components/common/Footer/Footer";
import SquatFeedback from "./pages/SquatFeedback/SquatFeedback";
import Board from "./pages/Board/Board";
import BoardDetail from "./pages/Board/BoardDetail"; 
import BoardCreate from "./pages/Board/BoardCreate"; 
import Login from "./pages/Login/Login";
import FaceLogin from "./pages/Login/FaceLogin";
import Signup from "./pages/Signup/Signup";
import MyPage from "./pages/MyPage/MyPage";
import MyPageUpdate from "./pages/MyPage/MyPageUpdate";

function App() {
  return (
    <Router>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/SquatFeedback" element={<SquatFeedback />} />

        <Route path="/Login" element={<Login />} />
        <Route path="/FaceLogin" element={<FaceLogin />} />

        <Route path="/Signup" element={<Signup />} />
        <Route path="/MyPage" element={<MyPage />} />
        <Route path="/MyPageUpdate" element={<MyPageUpdate />} />

        <Route path="/Board" element={<Board />} />
        <Route path="/Board/new" element={<BoardCreate />} /> 
        <Route path="/Board/:id" element={<BoardDetail />} /> 
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
