import React, { useState } from "react";

function PasswordChange() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handlePasswordChange = () => {
    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    alert("비밀번호가 성공적으로 변경되었습니다!");
  };

  return (
    <div>
      <h2>비밀번호 변경</h2>
      <div>
        <label>새 비밀번호:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div>
        <label>비밀번호 확인:</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>
      <button onClick={handlePasswordChange}>변경하기</button>
    </div>
  );
}

export default PasswordChange;
