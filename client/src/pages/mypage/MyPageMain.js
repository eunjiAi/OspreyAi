import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../utils/axios";
import styles from "./MyPageMain.module.css"; // CSS 모듈 import
import { AuthContext } from "../../AuthProvider";

function MyPage() {
  const { userid, accessToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    name: "",
    nickname: "",
    memberId: "",
    phoneNumber: "",
    gender: "",
    enrollDate: "",
    lastModified: "",
    google: "",
    naver: "",
    kakao: "",
    faceId: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyPage = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/member/mypage/${userid}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setUserData(response.data);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("회원 정보를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyPage();
  }, [userid, accessToken]);

  const handleEditClick = () => {
    navigate("/mypage/mypageUpdate");
  };

  if (loading) {
    return <div className={styles.loading}>로딩 중...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.mypageContainer}>
      <h1 className={styles.mypageTitle}>마이페이지</h1>
      <div className={styles.userInfo}>
        <p>
          <strong>이름:</strong> {userData.name || "정보 없음"}
        </p>
        <p>
          <strong>닉네임:</strong> {userData.nickname || "정보 없음"}
        </p>
        <p>
          <strong>아이디:</strong> {userData.memberId || "정보 없음"}
        </p>
        <p>
          <strong>전화번호:</strong> {userData.phoneNumber || "정보 없음"}
        </p>
        <p>
          <strong>성별:</strong>
          {userData.gender === "F"
            ? "Female"
            : userData.gender === "M"
              ? "Male"
              : "정보 없음"}
        </p>
        <p>
          <strong>가입 날짜:</strong> {userData.enrollDate || "정보 없음"}
        </p>
        <p>
          <strong>구글 연동:</strong> {userData.google ? "연동" : "미연동"}
        </p>
        <p>
          <strong>네이버 연동:</strong> {userData.naver ? "연동" : "미연동"}
        </p>
        <p>
          <strong>카카오 연동:</strong> {userData.kakao ? "연동" : "미연동"}
        </p>
        <p>
          <strong>Face ID:</strong> {userData.faceId ? "등록" : "미등록"}
        </p>
      </div>
      <button className={styles.updateBtn} onClick={handleEditClick}>
        정보 수정
      </button>
    </div>
  );
}

export default MyPage;
