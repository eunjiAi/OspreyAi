import React, { useState } from "react";
import axios from "../../../utils/axios";
import styles from "./FindPassword.module.css";

const FindPassword = () => {
  const [formData, setFormData] = useState({ userId: "", email: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { id, value } = e.target;

    // 공백을 제거한 값으로 업데이트
    const updatedValue = value.replace(/\s+/g, ''); // 모든 공백 제거

    setFormData((prev) => ({ ...prev, [id]: updatedValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await axios.post("/member/resetPassword", formData);
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
          <label htmlFor="userId" className={styles.label}>
            아이디 :
          </label>
          <input
            type="text"
            id="userId"
            placeholder="아이디를 입력하세요"
            value={formData.userId}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="email" className={styles.label}>
            이메일 :
          </label>
          <input
            type="email"
            id="email"
            placeholder="이메일을 입력하세요"
            value={formData.email}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>
        <p></p>
        <button
          type="submit"
          disabled={isLoading}
          className={`${styles.button} ${isLoading ? styles.disabledButton : ""}`}
        >
          {isLoading ? "처리 중..." : "비밀번호 찾기"}
        </button>
      </form>

      {successMessage && (
        <p className={styles.successMessage}>{successMessage}</p>
      )}
      {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
    </div>
  );
};

export default FindPassword;
