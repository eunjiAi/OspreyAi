import React, { useEffect } from "react";

function NaverCallback() {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = urlParams.get("access_token");
    const refreshToken = urlParams.get("refresh_token");

    // 부모 창이 있는 경우 메시지 전달
    if (window.opener) {
      window.opener.postMessage(
        {
          success: !!accessToken, // accessToken이 존재하면 성공
          accessToken,
          refreshToken,
          message: accessToken ? "로그인 성공" : "로그인 실패",
        },
        "http://localhost:3000" // 부모 창의 도메인
      );

      // 팝업 창 닫기
      window.close();
    } else {
      console.error("부모 창이 존재하지 않습니다.");
    }

  }, []);

  return null; // 화면에 UI가 필요 없으므로 null 반환
}

export default NaverCallback;
