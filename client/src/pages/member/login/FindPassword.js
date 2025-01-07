import React, { useState } from "react";
import axios from "../../../utils/axios"; // Axios 유틸리티 가져오기
import styles from "./FindPassword.module.css"; // CSS 모듈 스타일 가져오기

function FindPassword() {
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      // 서버에 아이디와 이메일 전송
      const response = await axios.post("/member/resetPassword", {
        userId,
        email,
      });

      setSuccessMessage(
        "비밀번호 재설정 링크가 이메일로 전송되었습니다. 이메일을 확인하세요."
      );
    } catch (error) {
      console.error(error.response?.data || error.message);
      setErrorMessage(
        error.response?.data?.message || "비밀번호를 찾을 수 없습니다."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2>비밀번호 찾기</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="userId">아이디</label>
          <input
            type="text"
            id="userId"
            placeholder="아이디를 입력하세요"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="email">이메일</label>
          <input
            type="email"
            id="email"
            placeholder="이메일을 입력하세요"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={isLoading} className={styles.button}>
          {isLoading ? "처리 중..." : "비밀번호 찾기"}
        </button>
      </form>

      {successMessage && (
        <p className={styles.successMessage}>{successMessage}</p>
      )}
      {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
    </div>
  );
}

export default FindPassword;
