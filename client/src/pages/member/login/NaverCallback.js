import React, { useEffect } from "react";

function NaverCallback() {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = urlParams.get("accessToken");
    const refreshToken = urlParams.get("refreshToken");

    if (accessToken) {
      // 로컬 스토리지 저장
      try {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        console.log("토큰 저장 성공");
      } catch (e) {
        console.error("로컬 스토리지 저장 오류: ", e);
      }
    } else {
      console.error("액세스 토큰이 없습니다.");
    }

    // 부모 창으로 메시지 전달
    if (window.opener) {
      window.opener.postMessage(
        {
          success: !!accessToken,
          accessToken,
          refreshToken,
          message: accessToken ? "로그인 성공" : "로그인 실패",
        },
        "http://localhost:8888"
      );
      window.close();
    } else {
      console.error("부모 창이 존재하지 않습니다.");
    }
  }, []);

  // 화면 렌더링 방지
  return null;
}

export default NaverCallback;
