// src/AuthProvider.js

import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

// Context 생성
export const AuthContext = createContext();

// accessToken 파싱 함수 : 페이로드만 추출해서 JSON 객체로 리턴함
const parseAccessToken = (token) => {
  if (!token) return null;
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
      .join("")
  );
  return JSON.parse(jsonPayload);
};

// Axios Interceptor 설정
axios.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Context Provider 컴포넌트
export const AuthProvider = ({ children }) => {
  // authInfo는 로그인 상태 및 토큰 관리
  const [authInfo, setAuthInfo] = useState({
    isLoggedIn: false,
    accessToken: "",
    refreshToken: "",
    role: "",
    username: "",
    userid: "",
  });

  // 로그인 함수
  const login = ({ accessToken, refreshToken }) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

    const parsedToken = parseAccessToken(accessToken);
    setAuthInfo({
      isLoggedIn: true,
      accessToken,
      refreshToken,
      role: parsedToken.role,
      username: parsedToken.name,
      userid: parsedToken.sub,
    });
  };

  // 로그아웃 함수
  const logout = () => {
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
  };

  // refreshToken을 사용하여 새 accessToken을 요청
  const refreshAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) throw new Error("No refresh token available");

      const response = await axios.post(
        "http://localhost:8888/reissue",
        {}, // 요청 body 비워둠
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        }
      );

      const newAccessToken = response.data.accessToken;
      localStorage.setItem("accessToken", newAccessToken);
      const parsedToken = parseAccessToken(newAccessToken);

      setAuthInfo({
        isLoggedIn: true,
        accessToken: newAccessToken,
        refreshToken,
        role: parsedToken.role,
        username: parsedToken.name,
        userid: parsedToken.sub,
      });
    } catch (error) {
      console.error("Failed to refresh token: ", error);
      logout(); // 실패 시 로그아웃 처리
    }
  };

  // 컴포넌트 마운트 시 로컬 스토리지에서 토큰 확인
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (accessToken) {
      const parsedToken = parseAccessToken(accessToken);
      if (parsedToken) {
        setAuthInfo({
          isLoggedIn: true,
          accessToken,
          refreshToken,
          role: parsedToken.role,
          username: parsedToken.name,
          userid: parsedToken.sub,
        });
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
