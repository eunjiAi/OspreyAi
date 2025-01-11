import React, { useEffect, useContext } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { AuthContext } from "../../../AuthProvider";

const NaverCallback = ({ onLoginSuccess }) => {
  const { login } = useContext(AuthContext);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const email = searchParams.get("email");
    console.log("추출된 이메일:", email);

    if (email) {
      handleLogin(email);
    } else {
      console.error("이메일 정보가 없습니다.");
      alert("이메일 정보가 전달되지 않았습니다. 다시 시도하세요.");
      closePopupAndRefreshParent();
    }
  }, [searchParams]);

  const handleLogin = async (email) => {
    try {
      const formData = new FormData();
      formData.append("naverEmail", email);

      const response = await axios.post(
        "http://localhost:8888/login",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const authorizationHeader = response.headers["authorization"];
      if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
        throw new Error("Authorization 헤더가 잘못되었거나 없습니다.");
      }

      const jwtAccessToken = authorizationHeader.substring("Bearer ".length);

      const { refreshToken } = response.data;
      if (!refreshToken) {
        throw new Error("Refresh Token이 응답에 없습니다.");
      }
      console.log("49번줄");
      login({ accessToken: jwtAccessToken, refreshToken });
      console.log("51번줄");

      console.log("로그인 성공!");
      if (onLoginSuccess) onLoginSuccess();
      closePopupAndRefreshParent();
    } catch (error) {
      closePopupAndRefreshParent();
    }
  };

  const closePopupAndRefreshParent = () => {
    if (window.opener) {
      window.opener.location.reload();
    }
    window.close();
  };

  return (
    <div>
      <p>로그인 처리가 진행 중입니다...</p>
    </div>
  );
};

export default NaverCallback;
