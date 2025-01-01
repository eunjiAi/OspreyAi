import React, { useState, useContext } from "react";
import axios from "../../../utils/axios"; // Axios 인스턴스 가져오기
import { AuthContext } from "../../../AuthProvider"; // AuthContext 가져오기
import styles from "./Login.module.css"; // 스타일 가져오기

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가
  const { login } = useContext(AuthContext); // AuthProvider의 login 함수 가져오기

  // Google OAuth 설정
  const GOOGLE_CLIENT_ID =
    "1087336071184-odcsdaa33savuptnd86oi2kbv2ida6jd.apps.googleusercontent.com";
  const GOOGLE_REDIRECT_URI = "http://localhost:3000";
  const GOOGLE_SCOPE = "email profile openid";

  const handleGoogleLogin = async () => {
    try {
      // Google OAuth URL 생성
      const googleLoginUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_REDIRECT_URI}&response_type=token&scope=${GOOGLE_SCOPE}`;
      console.log("Google Login URL:", googleLoginUrl);

      // Google 로그인 페이지로 리디렉트
      window.location.href = googleLoginUrl;
    } catch (error) {
      console.error("Google 로그인 초기화 실패:", error);
      alert("Google 로그인 초기화 중 문제가 발생했습니다. 다시 시도해주세요.");
    }
  };

  const handleGoogleCallback = async () => {
    try {
      console.log("Google Callback Handling Started");

      // URL에서 Access Token 추출
      const params = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = params.get("access_token");

      if (!accessToken) {
        alert("Google 인증 실패: Access Token을 찾을 수 없습니다.");
        return;
      }
      console.log("Google Access Token:", accessToken);

      // Google API를 사용하여 사용자 이메일 가져오기
      const response = await axios.get(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      const email = response.data.email;
      console.log("Google 사용자 이메일:", email);

      // 이메일을 FormData로 /login으로 전송
      const formData = new FormData();
      formData.append("googleEmail", email);

      const loginResponse = await axios.post("/login", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // FormData 전송을 위해 Content-Type 설정
        },
      });

      // 헤더에서 Authorization 정보 추출
      const authorizationHeader = loginResponse.headers["authorization"];
      if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
        throw new Error("Authorization 헤더가 잘못되었거나 없습니다.");
      }

      // Access Token 추출
      const jwtAccessToken = authorizationHeader.substring("Bearer ".length);

      // Response 데이터에서 Refresh Token 추출
      const { refreshToken } = loginResponse.data;
      if (!refreshToken) {
        throw new Error("Refresh Token이 응답에 없습니다.");
      }

      // AuthProvider의 login 함수 호출
      login({ accessToken: jwtAccessToken, refreshToken });

      // 로그인 성공 후 콜백 호출
      if (onLoginSuccess) onLoginSuccess();
    } catch (error) {
      console.error(
        "Google Callback 처리 실패:",
        error.response?.data || error.message
      );
      alert(
        "Google 로그인 실패: " +
          (error.response?.data?.message || "다시 시도하십시오.")
      );
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault(); // 기본 submit 동작 취소
    setIsLoading(true); // 로딩 시작

    try {
      // 일반 로그인 요청
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

      // Response 데이터에서 Refresh Token 추출
      const { refreshToken } = response.data;
      if (!refreshToken) {
        throw new Error("Refresh Token이 응답에 없습니다.");
      }

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

  // Google 로그인 콜백 처리
  React.useEffect(() => {
    if (window.location.hash.includes("access_token")) {
      handleGoogleCallback();
    }
  }, []);

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
        <button
          type="button"
          className={styles.googleButton}
          onClick={handleGoogleLogin}
        >
          Login with Google
        </button>
      </form>
    </div>
  );
}

export default Login;
