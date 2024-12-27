import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

// Context 생성
export const AuthContext = createContext();

// accessToken 파싱 함수 : 페이로드만 추출해서 JSON 객체로 리턴함
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
    console.error("잘못된 Access Token 형식입니다:", error);
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
    console.error("Axios 요청 중 에러 발생:", error);
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

  // React 상태 감지용 useEffect
  useEffect(() => {
    console.log("authInfo 상태가 변경되었습니다:", authInfo);
  }, [authInfo]);

  // 로그인 함수
  const login = ({ accessToken, refreshToken }) => {
    if (!accessToken || !refreshToken) {
      console.error("로그인 중 토큰이 누락되었습니다.");
      return;
    }

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

    const parsedToken = parseAccessToken(accessToken);
    console.log("Access Token 파싱 결과:", parsedToken);

    if (!parsedToken) {
      console.error("로그인 중 Access Token 파싱에 실패했습니다.");
      logout();
      return;
    }

    setAuthInfo({
      isLoggedIn: true,
      accessToken,
      refreshToken,
      role: parsedToken.role || "user", // 기본 역할 설정
      username: parsedToken.name || "알 수 없음", // 기본 이름 설정
      userid: parsedToken.sub || "알 수 없음", // 기본 사용자 ID 설정
    });

    console.log("로그인 성공: authInfo가 업데이트되었습니다.");
  };

  // 로그아웃 함수
  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        console.warn("로그아웃 중 Refresh Token이 누락되었습니다.");
      } else {
        console.log("백엔드로 로그아웃 요청을 보냅니다.");
        // Refresh Token을 Authorization 헤더에 포함하여 백엔드로 로그아웃 요청
        await axios.post(
          "http://localhost:8888/logout",
          {}, // 요청 body 비워둠
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`, // Refresh Token 사용
            },
          }
        );
        console.log("백엔드 로그아웃 요청 성공.");
      }
    } catch (error) {
      console.error("백엔드 로그아웃 요청 실패:", error);
    } finally {
      // 로컬 스토리지 초기화 및 상태 초기화
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

  // refreshToken을 사용하여 새 accessToken을 요청
  const refreshAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) throw new Error("리프레시 토큰이 없습니다.");

      console.log("Access Token 갱신 요청을 시작합니다.");
      const response = await axios.post(
        "http://localhost:8888/reissue",
        {}, // 요청 body 비워둠
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`, // Refresh Token 사용
          },
        }
      );

      const newAccessToken = response.data.accessToken;
      if (!newAccessToken) throw new Error("새로운 Access Token 수신에 실패했습니다.");

      localStorage.setItem("accessToken", newAccessToken);
      const parsedToken = parseAccessToken(newAccessToken);

      console.log("Access Token 갱신 결과:", parsedToken);

      setAuthInfo((prev) => ({
        ...prev,
        isLoggedIn: true,
        accessToken: newAccessToken,
        role: parsedToken.role || prev.role,
        username: parsedToken.name || prev.username,
        userid: parsedToken.sub || prev.userid,
      }));

      console.log("Access Token 갱신 성공: authInfo가 업데이트되었습니다.");
    } catch (error) {
      console.error("Access Token 갱신 실패:", error);
      logout(); // 실패 시 로그아웃 처리
    }
  };

  // 컴포넌트 마운트 시 로컬 스토리지에서 토큰 확인
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (accessToken) {
      const parsedToken = parseAccessToken(accessToken);
      console.log("로컬 스토리지에서 Access Token 파싱 결과:", parsedToken);

      if (parsedToken) {
        setAuthInfo({
          isLoggedIn: true,
          accessToken,
          refreshToken,
          role: parsedToken.role || "user",
          username: parsedToken.name || "알 수 없음",
          userid: parsedToken.sub || "알 수 없음",
        });
        console.log("로컬 스토리지에서 authInfo를 복원했습니다.");
      } else {
        console.error("로컬 스토리지에 잘못된 Access Token이 있습니다.");
        logout();
      }
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ ...authInfo, login, logout, refreshAccessToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};
