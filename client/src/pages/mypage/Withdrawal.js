import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../utils/axios";
import { AuthContext } from "../../AuthProvider";
import styles from "./Withdrawal.module.css"; // 모듈 CSS import

function Withdrawal() {
  const { uuid, accessToken, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [reason, setReason] = useState("");

  const handleWithdrawal = async () => {
    const confirm = window.confirm("정말로 회원탈퇴를 진행하시겠습니까?");
    if (!confirm) return;

    try {
      const response = await apiClient.delete(`/member/${uuid}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        data: { reason },
      });

      if (response.status === 200) {
        alert("회원탈퇴가 완료되었습니다.");
        logout();
        navigate("/");
      } else {
        alert("회원탈퇴에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("Error during withdrawal:", error);
      alert("회원탈퇴 중 문제가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className={styles.withdrawalContainer}>
      <h2>회원해지</h2>
      <p>
        정말로 회원탈퇴를 진행하시겠습니까?
        <br />
        (탈퇴하려면 '이용종료'를 입력해주세요.)
      </p>
      <div className={styles.reasonContainer}>
        <textarea
          id="reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="이용종료"
        />
      </div>
      <div className={styles.buttonGroup}>
        <button
          onClick={handleWithdrawal}
          className={styles.withdrawalBtn}
          disabled={reason !== "이용종료"}
        >
          이용종료
        </button>
        <button onClick={() => navigate(-1)} className={styles.cancelBtn}>
          취소
        </button>
      </div>
    </div>
  );
}

export default Withdrawal;
