import React, { useContext } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthProvider";
import "./MyPage.css";

function MyPage() {
  const { isLoggedIn, role, userid } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // "마이페이지"와 관련된 모든 경로 상태 확인
  const isMyPagePath =
    location.pathname === "/mypage" ||
    location.pathname.startsWith("/mypage/mypageMain") || // "마이페이지 메인" 경로
    location.pathname.startsWith("/mypage/mypageUpdate"); // "정보 수정" 경로

  return (
    <div className="mypage-layout">
      {/* 왼쪽 탭 메뉴 */}
      <div className="tabs-container">
        <button
          onClick={() => navigate("/mypage/mypageMain")}
          className={`tab ${isMyPagePath ? "active" : ""}`}
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
          onClick={() => navigate("/mypage/myinfo")}
          className={`tab ${location.pathname === "/mypage/myinfo" ? "active" : ""}`}
        >
          내가 쓴 글
        </button>
        <button
          onClick={() => navigate("/mypage/withdrawal")}
          className={`tab ${location.pathname === "/mypage/withdrawal" ? "active" : ""}`}
        >
          회원해지
        </button>
        {isLoggedIn && role === "ADMIN" && (
          <button
            onClick={() => navigate("/mypage/mypageAdmin")}
            className={`tab ${location.pathname === "/mypage/mypageAdmin" ? "active" : ""}`}
          >
            (관리자)회원 관리
          </button>
        )}
        {isLoggedIn && role === "ADMIN" && userid === "master" && (
          <button
            onClick={() => navigate("/mypage/mypageMaster")}
            className={`tab ${location.pathname === "/mypage/mypageMaster" ? "active" : ""}`}
          >
            (마스터)회원 관리
          </button>
        )}
      </div>

      {/* 오른쪽 페이지 */}
      <div className="content-container">
        <Outlet />
      </div>
    </div>
  );
}

export default MyPage;
