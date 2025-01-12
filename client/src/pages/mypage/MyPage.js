import React, { useContext, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthProvider";
import styles from "./MyPage.module.css";

function MyPage() {
  const { isLoggedIn, role, userid } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [hoveredTab, setHoveredTab] = useState(null);

  // "마이페이지"와 관련된 모든 경로 상태 확인
  const isMyPagePath =
    location.pathname === "/mypage" ||
    location.pathname.startsWith("/mypage/mypageMain") || // "마이페이지 메인" 경로
    location.pathname.startsWith("/mypage/mypageUpdate"); // "정보 수정" 경로

  const handleMouseEnter = (tabName) => {
    setHoveredTab(tabName);
  };

  const handleMouseLeave = () => {
    setHoveredTab(null);
  };

  const renderTabClass = (tabName, isActive) => {
    let classNames = styles.tab;

    if (isActive) {
      classNames += ` ${styles.tabActive}`;
    } else if (hoveredTab === tabName) {
      classNames += ` ${styles.tabHover}`;
    }

    return classNames;
  };

  return (
    <div className={styles.mypageLayout}>
      {/* 왼쪽 탭 메뉴 */}
      <div className={styles.tabsContainer}>
        <button
          onMouseEnter={() => handleMouseEnter("mypageMain")}
          onMouseLeave={handleMouseLeave}
          onClick={() => navigate("/mypage/mypageMain")}
          className={renderTabClass("mypageMain", isMyPagePath)}
        >
          마이페이지
        </button>
        <button
          onMouseEnter={() => handleMouseEnter("passwordChange")}
          onMouseLeave={handleMouseLeave}
          onClick={() => navigate("/mypage/password-change")}
          className={renderTabClass(
            "passwordChange",
            location.pathname === "/mypage/password-change"
          )}
        >
          비밀번호 변경
        </button>
        <button
          onMouseEnter={() => handleMouseEnter("myinfo")}
          onMouseLeave={handleMouseLeave}
          onClick={() => navigate("/mypage/myinfo")}
          className={renderTabClass(
            "myinfo",
            location.pathname === "/mypage/myinfo"
          )}
        >
          내가 쓴 글
        </button>
        <button
          onMouseEnter={() => handleMouseEnter("withdrawal")}
          onMouseLeave={handleMouseLeave}
          onClick={() => navigate("/mypage/withdrawal")}
          className={renderTabClass(
            "withdrawal",
            location.pathname === "/mypage/withdrawal"
          )}
        >
          회원해지
        </button>
        {isLoggedIn && role === "ADMIN" && (
          <button
            onMouseEnter={() => handleMouseEnter("mypageAdmin")}
            onMouseLeave={handleMouseLeave}
            onClick={() => navigate("/mypage/mypageAdmin")}
            className={renderTabClass(
              "mypageAdmin",
              location.pathname === "/mypage/mypageAdmin"
            )}
          >
            (관리자)회원 관리
          </button>
        )}
        {isLoggedIn && role === "ADMIN" && userid === "master" && (
          <button
            onMouseEnter={() => handleMouseEnter("mypageMaster")}
            onMouseLeave={handleMouseLeave}
            onClick={() => navigate("/mypage/mypageMaster")}
            className={renderTabClass(
              "mypageMaster",
              location.pathname === "/mypage/mypageMaster"
            )}
          >
            (마스터)회원 관리
          </button>
        )}
      </div>

      {/* 오른쪽 페이지 */}
      <div className={styles.contentContainer}>
        <Outlet />
      </div>
    </div>
  );
}

export default MyPage;
