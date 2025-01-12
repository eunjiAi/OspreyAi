import React, { useEffect, useState, useContext } from "react";
import apiClient from "../../utils/axios";
import { useSearchParams } from "react-router-dom";
import { AuthContext } from "../../AuthProvider";

const NaverLinkCallback = () => {
  const { accessToken, uuid } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState(null);

  useEffect(() => {
    const extractedEmail = searchParams.get("email");
    if (extractedEmail) {
      setEmail(extractedEmail);
    } else {
      console.error("이메일 정보가 없습니다.");
      alert("이메일 정보가 전달되지 않았습니다. 다시 시도하세요.");
    }
  }, [searchParams]);

  useEffect(() => {
    if (email && uuid) {
      handleLogin(email);
    }
  }, [email, uuid]);

  const handleLogin = async (email) => {
    try {
      await apiClient.post(
        `/member/naver`,
        { email, uuid },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      if (window.opener) {
        window.opener.location.href =
          "http://localhost:3000/mypage/mypageUpdate";
        window.close();
      } else {
        console.error("부모 창을 찾을 수 없습니다.");
      }
    } catch (error) {
      console.error("Naver 연동 실패:", error.response?.data || error.message);
    }
  };

  return (
    <div>
      <p>연동 처리가 진행 중입니다...</p>
    </div>
  );
};

export default NaverLinkCallback;
