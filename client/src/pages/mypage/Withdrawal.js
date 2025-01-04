import React from "react";

function Withdrawal() {
  const handleWithdrawal = () => {
    const confirm = window.confirm("정말로 회원탈퇴를 진행하시겠습니까?");
    if (confirm) {
      alert("회원탈퇴가 완료되었습니다.");
    }
  };

  return (
    <div>
      <h2>회원탈퇴</h2>
      <p>회원탈퇴를 진행하시겠습니까? 탈퇴 후 모든 정보가 삭제됩니다.</p>
      <button onClick={handleWithdrawal}>회원탈퇴</button>
    </div>
  );
}

export default Withdrawal;
