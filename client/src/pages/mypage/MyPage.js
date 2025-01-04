import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import MyPageMain from "./MyPageMain";
import "./MyPage.css";

function MyPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const isRootPath = location.pathname === "/mypage";

  return (
    <div className="mypage-layout">
      <div className="tabs-container">
        <button
          className="faceid-register-btn"
          onClick={() => navigate("/FaceIdRegister")} // Face ID 등록 페이지로 이동
        >
          Face ID 등록
        </button>
        <button
          onClick={() => navigate("/mypage")}
          className={`tab ${location.pathname === "/mypage/mypageMain" ? "active" : ""}`}
        >
          마이페이지
        </button>
        <button
          onClick={() => navigate("/mypage/password-change")}
          className={`tab ${
            location.pathname === "/mypage/password-change" ? "active" : ""
          }`}
        >
          비밀번호 변경
        </button>
        <button
          onClick={() => navigate("/mypage/qna")}
          className={`tab ${location.pathname === "/mypage/qna" ? "active" : ""}`}
        >
          QnA
        </button>
        <button
          onClick={() => navigate("/mypage/withdrawal")}
          className={`tab ${
            location.pathname === "/mypage/withdrawal" ? "active" : ""
          }`}
        >
          회원탈퇴
        </button>
      </div>

      {/* 오른쪽 페이지 */}
      <div className="content-container">
        {isRootPath ? <MyPageMain /> : <Outlet />}
      </div>
    </div>
  );
}

export default MyPage;
