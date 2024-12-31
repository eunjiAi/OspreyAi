import React, { useState, useContext } from "react";
import axios from "../../../utils/axios"; // Axios 인스턴스 가져오기
import { AuthContext } from "../../../AuthProvider"; // AuthContext 가져오기
import styles from "./Login.module.css"; // 스타일 가져오기

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가
  const { login } = useContext(AuthContext); // AuthProvider의 login 함수 가져오기

  const handleGoogleLogin = async () => {
    try {
      // 백엔드 API 호출하여 Google 로그인 URL 받기
      const response = await axios.post(
        "http://localhost:8888/api/v1/oauth2/google"
      );
      const googleLoginUrl = response.data;

      // Google 로그인 페이지로 리다이렉트
      window.location.href = googleLoginUrl;
    } catch (error) {
      console.error("Failed to get Google login URL", error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault(); // 기본 submit 동작 취소
    setIsLoading(true); // 로딩 시작

    try {
      // API 요청
      const response = await axios.post("/login", {
        userId: username,
        userPwd: password,
      });

      // 헤더에서 Authorization 정보 추출
      const authorizationHeader = response.headers["authorization"];
      if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
        throw new Error("Authorization 헤더가 잘못되었거나 없습니다.");
      }

      // Access Token 추출
      const accessToken = authorizationHeader.substring("Bearer ".length);
      console.log("Access Token:", accessToken);

      // Response 데이터에서 Refresh Token 추출
      const { refreshToken } = response.data;
      if (!refreshToken) {
        throw new Error("Refresh Token이 응답에 없습니다.");
      }
      console.log("Refresh Token:", refreshToken);

      // AuthProvider의 login 함수 호출
      login({ accessToken, refreshToken });

      // 로그인 성공 후 콜백 호출
      if (onLoginSuccess) onLoginSuccess();
    } catch (error) {
      console.error("로그인 실패:", error.response?.data || error.message);
      alert(
        "로그인 실패: " +
          (error.response?.data?.message || "다시 시도하십시오.")
      );
    } finally {
      setIsLoading(false); // 로딩 종료
    }
  };

  return (
    <div className={styles.container}>
      <h2>로그인 페이지</h2>
      <form className={styles.form} onSubmit={handleLogin}>
        <div className={styles.inputGroup}>
          <label htmlFor="username">아이디:</label>
          <input
            type="text"
            id="username"
            placeholder="아이디를 입력하세요"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="password">비밀번호:</label>
          <input
            type="password"
            id="password"
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className={styles.button} disabled={isLoading}>
          {isLoading ? "로그인 중..." : "로그인"}
        </button>
        <button onClick={handleGoogleLogin}>Login with Google</button>
      </form>
    </div>
  );
}

export default Login;
