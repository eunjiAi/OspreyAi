import React, { useEffect, useContext } from "react";
import apiClient from "../../utils/axios";
import { useSearchParams } from "react-router-dom";
import { AuthContext } from "../../AuthProvider";

const NaverLinkCallback = () => {
  const { accessToken, uuid } = useContext(AuthContext);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const email = searchParams.get("email");
    console.log("추출된 이메일:", email);

    if (email) {
      handleLogin(email);
    } else {
      console.error("이메일 정보가 없습니다.");
      alert("이메일 정보가 전달되지 않았습니다. 다시 시도하세요.");
    }
  }, [searchParams]);

  const handleLogin = async (email) => {
    try {
      // 이메일을 서버로 전송하여 연동 완료
      await apiClient.post(
        `/member/naver`,
        { email, uuid },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      alert("Naver 연동이 완료되었습니다.");
    } catch (error) {
      console.log("Naver 연동 실패");
    }
  };
  

  return (
    <div>
      <p>연동 처리가 진행 중입니다...</p>
    </div>
  );
};

export default NaverLinkCallback;
