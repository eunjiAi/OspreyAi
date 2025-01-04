import React from "react";
import "./QnA.css"; // 스타일 파일 추가

function QnA() {
  return (
    <div className="qna-container">
      <h2 className="qna-title">QnA</h2>
      <p className="qna-description">
        여기에서 내 질문에 대한 답변을 확인할 수 있습니다.
      </p>
      <ul className="qna-list">
        <li className="qna-item">
          <strong>Q1:</strong> 회원탈퇴는 어떻게 하나요?
          <p>회원탈퇴는 '회원탈퇴' 페이지에서 진행할 수 있습니다.</p>
        </li>
        <li className="qna-item">
          <strong>Q2:</strong> 비밀번호를 잊어버렸습니다. 어떻게 해야 하나요?
          <p>비밀번호 찾기 기능을 사용하거나 고객센터에 문의해주세요.</p>
        </li>
        <li className="qna-item">
          <strong>Q3:</strong> 계정 정보는 어디서 변경할 수 있나요?
          <p>'회원정보 수정' 페이지에서 변경할 수 있습니다.</p>
        </li>
      </ul>
    </div>
  );
}

export default QnA;
