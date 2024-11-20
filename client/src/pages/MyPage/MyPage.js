import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./MyPage.css";

const MyPage = () => {
  const [userData, setUserData] = useState({
    name: null,
    email: null,
    password: null,
  });

  const navigate = useNavigate();

  useEffect(() => {
    // 데이터베이스에서 사용자 데이터를 가져오는 시뮬레이션
    const fetchUserData = async () => {
      const data = {
        name: "홍길동",
        email: "hong@gmail.com",
        password: "honghong123",
      };
      setUserData(data);
    };
    fetchUserData();
  }, []);

  const handleUpdateClick = () => {
    navigate("/MyPageUpdate");
  };

  return (
    <div className="mypage-container">
      <h1 className="mypage-title">마이페이지</h1>
      <div className="user-info">
        <p>
          <strong>이름:</strong> {userData.name || "정보 없음"}
        </p>
        <p>
          <strong>이메일:</strong> {userData.email || "정보 없음"}
        </p>
        <p>
          <strong>현재 비밀번호:</strong> {userData.password || "정보 없음"}
        </p>
      </div>
      <button onClick={handleUpdateClick} className="update-btn">
        수정하기
      </button>
    </div>
  );
};

export default MyPage;
