import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../utils/axios";
import { AuthContext } from "../../AuthProvider";
import "./Withdrawal.css";

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
    <div className="withdrawal-container">
      <h2>회원탈퇴</h2>
      <p>정말로 회원탈퇴를 진행하시겠습니까? 탈퇴 후 모든 정보가 삭제됩니다.</p>
      <div className="reason-container">
        <label htmlFor="reason">탈퇴 사유 (선택):</label>
        <textarea
          id="reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="탈퇴 사유를 입력해주세요."
        />
      </div>
      <div className="button-group">
        <button onClick={handleWithdrawal} className="withdrawal-btn">
          회원탈퇴
        </button>
        <button onClick={() => navigate(-1)} className="cancel-btn">
          취소
        </button>
      </div>
    </div>
  );
}

export default Withdrawal;
