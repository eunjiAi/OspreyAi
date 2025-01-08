import React, { useState } from "react";
import axios from "../../../utils/axios";
import Modal from "../../../components/common/Modal"; // Modal 컴포넌트 가져오기
import Login from "../../member/login/Login"; // Login 컴포넌트 가져오기
import styles from "./FindId.module.css";

function FindId() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [foundId, setFoundId] = useState(null);
  const [error, setError] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false); // 로그인 모달 상태

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setFoundId(null);
    setError("");

    try {
      const response = await axios.get("/member/findId", {
        params: { name, email },
      });
      setFoundId(response.data.id);
    } catch (error) {
      console.error(error.response?.data || error.message);
      setError(
        error.response?.data?.message ||
          "아이디를 찾을 수 없습니다. 정보를 다시 확인해주세요."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenLoginModal = () => {
    setShowLoginModal(true); // 로그인 모달 열기
  };

  const handleCloseLoginModal = () => {
    setShowLoginModal(false); // 로그인 모달 닫기
  };

  return (
    <div className={styles.container}>
      <h2>아이디 찾기</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="name">이름</label>
          <input
            type="text"
            id="name"
            placeholder="이름을 입력하세요"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
          {isLoading ? "처리 중..." : "아이디 찾기"}
        </button>
      </form>

      {foundId && (
        <div className={styles.successSection}>
          <p className={styles.successMessage}>
            찾으신 아이디는 <strong>{foundId}</strong> 입니다.
          </p>
          <div className={styles.buttonGroup}>
            <button
              className={`${styles.button} ${styles.secondaryButton}`}
              onClick={() => (window.location.href = "/findPassword")}
            >
              비밀번호 찾기
            </button>
            <button
              className={`${styles.button} ${styles.primaryButton}`}
              onClick={handleOpenLoginModal} // 로그인 모달 열기
            >
              로그인하기
            </button>
          </div>
        </div>
      )}

      {error && <p className={styles.errorMessage}>{error}</p>}

      {/* 로그인 모달 */}
      {showLoginModal && (
        <Modal onClose={handleCloseLoginModal}>
          <Login onLoginSuccess={handleCloseLoginModal} />
        </Modal>
      )}
    </div>
  );
}

export default FindId;