import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

// Context 생성
export const AuthContext = createContext();

// Access Token 파싱 함수
const parseAccessToken = (token) => {
  if (!token) return null;
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Access Token 파싱에 실패했습니다:", error);
    return null;
  }
};

// Axios Interceptor 설정
axios.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (config.url.endsWith("/logout") || config.url.endsWith("/reissue")) {
      if (refreshToken) {
        config.headers["Authorization"] = `Bearer ${refreshToken}`;
        console.log("Refresh Token을 Authorization 헤더에 설정하였습니다.");
      } else {
        console.warn("Refresh Token이 누락되었습니다.");
      }
    } else if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
      console.log("Access Token을 Authorization 헤더에 설정하였습니다.");
    } else {
      console.warn("Authorization 헤더 설정 실패: Access Token이 없습니다.");
    }
    return config;
  },
  (error) => {
    console.error("Axios 요청 중 에러가 발생했습니다:", error);
    return Promise.reject(error);
  }
);

// Context Provider 컴포넌트
export const AuthProvider = ({ children }) => {
  const [authInfo, setAuthInfo] = useState({
    isLoggedIn: false,
    accessToken: "",
    refreshToken: "",
    role: "",
    username: "",
    userid: "",
  });

  // Access Token 갱신 함수
  const refreshAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) throw new Error("Refresh Token이 없습니다.");

      console.log("Access Token 갱신 요청을 시작합니다.");
      const response = await axios.post(
        "http://localhost:8888/reissue",
        {},
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        }
      );

      const newAccessToken = response.data.accessToken;
      if (!newAccessToken) throw new Error("새로운 Access Token을 받을 수 없습니다.");

      console.log("Access Token 갱신 성공: 새 Access Token을 저장합니다.");
      localStorage.setItem("accessToken", newAccessToken);
      const parsedToken = parseAccessToken(newAccessToken);

      setAuthInfo((prev) => ({
        ...prev,
        isLoggedIn: true,
        accessToken: newAccessToken,
        role: parsedToken.role || prev.role,
        username: parsedToken.name || prev.username,
        userid: parsedToken.sub || prev.userid,
      }));
    } catch (error) {
      console.error("Access Token 갱신 실패:", error);
      logout();
    }
  };

  // 로그인 함수
  const login = ({ accessToken, refreshToken }) => {
    if (!accessToken || !refreshToken) {
      console.error("로그인 중 Access Token 또는 Refresh Token이 누락되었습니다.");
      return;
    }

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

    const parsedToken = parseAccessToken(accessToken);
    if (!parsedToken) {
      console.error("로그인 중 Access Token 파싱에 실패했습니다.");
      logout();
      return;
    }

    setAuthInfo({
      isLoggedIn: true,
      accessToken,
      refreshToken,
      role: parsedToken.role || "user",
      username: parsedToken.name || "알 수 없음",
      userid: parsedToken.sub || "알 수 없음",
    });

    console.log("로그인 성공: authInfo가 업데이트되었습니다.");
  };

  // 로그아웃 함수
  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        console.log("백엔드로 로그아웃 요청을 보냅니다.");
        await axios.post(
          "http://localhost:8888/logout",
          {},
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          }
        );
        console.log("백엔드 로그아웃 요청 성공.");
      }
    } catch (error) {
      console.error("백엔드 로그아웃 요청 실패:", error);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setAuthInfo({
        isLoggedIn: false,
        accessToken: "",
        refreshToken: "",
        role: "",
        username: "",
        userid: "",
      });
      console.log("로그아웃 완료: authInfo가 초기화되었습니다.");
    }
  };

  // 새로고침 시 로그인 상태 복원
  useEffect(() => {
    const initializeAuthState = () => {
      const storedAccessToken = localStorage.getItem("accessToken");
      const storedRefreshToken = localStorage.getItem("refreshToken");

      if (storedAccessToken) {
        const parsedToken = parseAccessToken(storedAccessToken);
        if (parsedToken && parsedToken.exp * 1000 > Date.now()) {
          console.log("유효한 Access Token을 발견했습니다. 로그인 상태를 복원합니다.");
          setAuthInfo({
            isLoggedIn: true,
            accessToken: storedAccessToken,
            refreshToken: storedRefreshToken || "",
            role: parsedToken.role || "user",
            username: parsedToken.name || "알 수 없음",
            userid: parsedToken.sub || "알 수 없음",
          });
        } else {
          console.warn("Access Token이 만료되었습니다. 로그아웃합니다.");
          logout();
        }
      } else {
        console.log("저장된 Access Token이 없습니다. 로그아웃 상태로 시작합니다.");
      }
    };

    initializeAuthState();
  }, []);

  // Access Token 주기적 갱신
  useEffect(() => {
    const checkAndRefreshToken = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) return;

      const parsedToken = parseAccessToken(accessToken);
      if (!parsedToken) {
        console.error("잘못된 Access Token이 발견되었습니다.");
        logout();
        return;
      }

      const expirationTime = parsedToken.exp * 1000 - Date.now();
      if (expirationTime < 60000) {
        console.log("Access Token이 곧 만료됩니다. 갱신을 시도합니다.");
        await refreshAccessToken();
      } else {
        console.log(
          `Access Token 유효 기간 남음:\n >>${Math.floor(expirationTime / 1000 / 60)}분 ${Math.floor((expirationTime / 1000) % 60)}초`
        );
      }
    };

    const intervalId = setInterval(checkAndRefreshToken, 50000); // 50초마다 검사

    return () => clearInterval(intervalId); // 컴포넌트 언마운트 시 interval 해제
  }, []);

  return (
    <AuthContext.Provider
      value={{ ...authInfo, login, logout, refreshAccessToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};
