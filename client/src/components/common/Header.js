// src/components/common/Header.js

import React, { useState, useContext, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import apiClient from "../../utils/axios";
import { AuthContext } from "../../AuthProvider";

import mainlogo from "../../images/mainlogo.png"; // 로고 이미지
import styles from "./Header.module.css"; // CSS Modules

import Modal from "./Modal"; //Modal 컴포넌트 임포트
import Login from "../../pages/member/login/Login"; // Login 컴포넌트 임포트 (Modal 로 출력)
import Signup from "../../pages/member/signup/Signup"; // Signup 컴포넌트 임포트 (Modal 로 출력)

function Header({
  updatePostsResults,
  updateNoticeResults,
  updateQuestionResults,
  resetSearchInput,
}) {
  const { isLoggedIn, username, logout } = useContext(AuthContext); // AuthProvider 에서 가져오기

  // 로그인 모달 상태변수 추가
  const [showLoginModal, setShowLoginModal] = useState(false);
  // 회원가입 모달 상태변수 추가
  const [showSignupModal, setShowSignupModal] = useState(false);
  // 공지사항 드롭다운 상태
  const [showNoticeDropdown, setShowNoticeDropdown] = useState(false);
  // 게시판 드롭다운 상태
  const [showBoardDropdown, setShowBoardDropdown] = useState(false);
  // 검색 input 에 입력된 검색어 상태 관리 변수
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  // 라우터 정보를 관리할 상태변수
  const location = useLocation();

  // 현재 라우터(/notice:NoticeList or /board:BoardList)를 기반으로 검색 input 의 placeholder 를 표시 처리
  const getSearchPlaceholder = () => {
    if (location.pathname.startsWith("/posts")) {
      return "검색어를 입력하세요.";
    } else if (location.pathname.startsWith("/notice")) {
      return "검색어를 입력하세요.";
    }
    return "검색어를 입력하세요";
  };

  // 검색 버튼 클릭하면
  const handleSearch = async () => {
    try {
      const endpoint = location.pathname.startsWith("/posts")
        ? `/posts/search/title`
        : location.pathname.startsWith("/notice")
          ? `/notice/search/title`
          : "/question/search/title";

      const response = await apiClient.get(endpoint, {
        params: { action: "title", keyword: searchTerm },
      });
      console.log(response.data); // 리턴된 Map (list:...., paging:....) 확인
      // Header.js 에서 받은 결과를 각 XXXList.js 에 출력 처리하는 코드
      if (location.pathname.startsWith("/posts")) {
        updatePostsResults(response.data); // 검색 결과 전달
      } else if (location.pathname.startsWith("/notice")) {
        updateNoticeResults(response.data); // 검색 결과 전달
      } else {
        updateQuestionResults(response.data);
      }
    } catch (error) {
      console.error("검색 요청 실패 : ", error);
    }
  };

  // 로그아웃 클릭시 작동할 핸들러
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // 검색 input 초기화
  const handleResetSearch = () => {
    setSearchTerm(""); // 검색 input 초기화
    resetSearchInput(); // App.js 에서 검색 결과 초기화
  };

  // 공지사항 드롭다운 보이기/숨기기 처리
  const toggleNoticeDropdown = () => {
    setShowNoticeDropdown(!showNoticeDropdown);
  };

  // 게시판 드롭다운 보이기/숨기기 처리
  const toggleBoardDropdown = () => {
    setShowBoardDropdown(!showBoardDropdown);
  };

  // 회원가입 버튼 클릭시 작동할 핸들 함수 추가
  const handleSignupClick = () => {
    // 회원가입 모달창 열기함
    setShowSignupModal(true);
  };

  // 로그인 버튼 클릭시 작동할 핸들 함수 추가
  const handleLoginClick = () => {
    // 로그인 모달창 열기함
    setShowLoginModal(true);
  };

  // 모달의 창닫기(X) 클릭시 작동할 핸들 함수 추가
  const handleCloseModal = () => {
    // 로그인 모달창 닫기함
    setShowLoginModal(false);
    // 회원가입 모달창 닫기함
    setShowSignupModal(false);
  };

  // 로그인 성공시 모달창 닫기 처리
  const handleLoginSuccess = () => {
    isLoggedIn ? setShowLoginModal(false) : setShowLoginModal(false); // 모달창 false 닫기 처리로 수정
  };

  // 회원가입 성공시 회원가입 모달창 닫기하고, 바로 로그인 모달창 열기 처리
  const handleSignupSuccess = () => {
    setShowSignupModal(false); // 회원가입 모달창 false 닫기 처리로 수정
    setShowLoginModal(true); // 로그인 모달창 true 열기 처리로 수정
  };

  return (
    <header className={styles.header}>
      {/* 사이드 메뉴, 로고 및 네비게이션 */}
      <div className={styles.leftSection}>
        <Link to="/" className={styles.logoLink}>
          <img src={mainlogo} alt="Site Logo" className={styles.mainlogo} />
        </Link>
        <nav>
          <ul className={styles.navList}>
            <li
              className={styles.navItem}
              onMouseEnter={toggleNoticeDropdown}
              onMouseLeave={toggleNoticeDropdown}
            >
              공지 및 질문
              {showNoticeDropdown && (
                <ul className={styles.dropdownMenu}>
                  <li>
                    <a href="/notice" className={styles.dropdownItem}>
                      공지사항
                    </a>
                  </li>
                  <li>
                    <a href="/faq" className={styles.dropdownItem}>
                      FAQ
                    </a>
                  </li>
                  <li>
                    <a href="/qna" className={styles.dropdownItem}>
                      Q&A
                    </a>
                  </li>
                </ul>
              )}
            </li>
            <li
              className={styles.navItem}
              onMouseEnter={toggleBoardDropdown}
              onMouseLeave={toggleBoardDropdown}
            >
              회원서비스
              {showBoardDropdown && (
                <ul className={styles.dropdownMenu}>
                  <li>
                    <a href="/squatFeedback" className={styles.dropdownItem}>
                      스쿼트피드백 AI
                    </a>
                  </li>
                  <li>
                    <a href="/posts" className={styles.dropdownItem}>
                      게시판
                    </a>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </nav>
      </div>
      {/* 검색바 */}
      <div className={styles.searchBar}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className={styles.searchForm}
        >
          <input
            type="text"
            placeholder={getSearchPlaceholder()}
            value={searchTerm}
            className={styles.searchInput}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className={styles.searchButton} onClick={handleSearch}>
            검색
          </button>
        </form>
      </div>
      {/* 로그인/로그아웃 버튼 */}
      <div className={styles.rightSection}>
        {isLoggedIn ? (
          <>
            <span className={styles.username}>
              <Link to="/mypage/mypageMain/" className={styles.linkUserName}>
                <strong>{username}</strong>
              </Link>{" "}
              님 환영합니다.
            </span>
            <button onClick={handleLogout} className={styles.authButton}>
              로그아웃
            </button>
          </>
        ) : (
          <>
            <button onClick={handleLoginClick} className={styles.authButton}>
              로그인
            </button>
            <span className={styles.separator}>|</span>
            <button onClick={handleSignupClick} className={styles.authButton}>
              회원가입
            </button>
          </>
        )}
      </div>
      {/* 로그인 모달 */}
      {showLoginModal && (
        <Modal onClose={handleCloseModal}>
          <Login onLoginSuccess={handleLoginSuccess} />
        </Modal>
      )}
      {/* 회원가입 모달 */}
      {showSignupModal && (
        <Modal onClose={handleCloseModal}>
          <Signup onSignupSuccess={handleSignupSuccess} />
        </Modal>
      )}
    </header>
  );
}

export default Header;
