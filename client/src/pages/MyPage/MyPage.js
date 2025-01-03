import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../utils/axios";
import styles from "./MyPage.css";
import { AuthContext } from "../../AuthProvider";

function MyPage() {
  const { userid, accessToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    name: "",
    nickname: "",
    id: "",
    phoneNumber: "",
    gender: "",
    enrollDate: "",
    lastModified: "",
    google: "",
    naver: "",
    kakao: "",
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
        setLoading(false); // 로딩 종료
      }
    };

    fetchMyPage();
  }, [userid, accessToken]);

  const handleEditClick = () => {
    navigate("/myPageUpdate"); // 정보 수정 페이지로 이동
  };

  if (loading) {
    return <div className={styles.loading}>로딩 중...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className="mypage-container">
      <h1 className="mypage-title">마이페이지</h1>
      <div className="user-info">
        <p>
          <strong>이름:</strong> {userData.name || "정보 없음"}
        </p>
        <p>
          <strong>닉네임:</strong> {userData.nickname || "정보 없음"}
        </p>
        <p>
          <strong>아이디:</strong> {userData.email || "정보 없음"}
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
          <strong>구글 연동:</strong>
          {userData.google || "미연동"}
        </p>
        <p>
          <strong>네이버 연동:</strong>
          {userData.naver || "미연동"}
        </p>
        <p>
          <strong>카카오 연동:</strong>
          {userData.kakao || "미연동"}
        </p>
      </div>
      <button className="update-btn" onClick={handleEditClick}>
        정보 수정
      </button>

      <button
        className="faceid-register-btn"
        onClick={() => navigate("/FaceIdRegister")} // Face ID 등록 페이지로 이동
      >
        Face ID 등록
      </button>


    </div>
  );
}

export default MyPage;
