import React, { useEffect, useContext } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { AuthContext } from "../../../AuthProvider"; // AuthContext 가져오기

const NaverCallback = ({ onLoginSuccess }) => {
  const { login } = useContext(AuthContext); // AuthProvider의 login 함수 가져오기
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const email = searchParams.get("email"); // 네이버에서 받은 이메일 파라미터
    console.log("추출된 이메일:", email);

    if (email) {
      handleLogin(email);
    } else {
      console.error("이메일 정보가 없습니다.");
      alert("이메일 정보가 전달되지 않았습니다. 다시 시도하세요.");
      closePopupAndRefreshParent(); // 팝업 닫기 및 부모창 새로고침
    }
  }, [searchParams]);

  const handleLogin = async (email) => {
    try {
      // 이메일을 FormData로 /login으로 전송
      const formData = new FormData();
      formData.append("naverEmail", email);

      const response = await axios.post(
        "http://localhost:8888/login",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // FormData 전송을 위한 헤더
          },
        }
      );

      // 헤더에서 Authorization 정보 추출
      const authorizationHeader = response.headers["authorization"];
      if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
        throw new Error("Authorization 헤더가 잘못되었거나 없습니다.");
      }

      // Access Token 추출
      const jwtAccessToken = authorizationHeader.substring("Bearer ".length);

      // Response 데이터에서 Refresh Token 추출
      const { refreshToken } = response.data;
      if (!refreshToken) {
        throw new Error("Refresh Token이 응답에 없습니다.");
      }

      // AuthProvider의 login 함수 호출
      login({ accessToken: jwtAccessToken, refreshToken });

      console.log("로그인 성공!");
      // 로그인 성공 후 추가 동작 수행
      if (onLoginSuccess) onLoginSuccess();
      closePopupAndRefreshParent(); // 팝업 닫기 및 부모창 새로고침
    } catch (error) {
      closePopupAndRefreshParent(); // 팝업 닫기 및 부모창 새로고침
    }
  };

  const closePopupAndRefreshParent = () => {
    // 부모창 새로고침
    if (window.opener) {
      window.opener.location.reload(); // 부모창 새로고침
    }
    // 현재 팝업창 닫기
    window.close();
  };

  return (
    <div>
      <h1>Naver Login Callback</h1>
      <p>로그인 처리가 진행 중입니다...</p>
    </div>
  );
};

export default NaverCallback;
