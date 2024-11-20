import React from 'react';
import './FaceLogin.css';

function FaceLogin() {
  const handleGoBack = () => {
    console.log('Go back clicked');
    // 이전 페이지로 이동하는 코드 추가 예정
  };

  const handleFaceScan = () => {
    console.log('Face scan initiated');
    // Face 스캔 로직 추가 예정
  };

  return (
    <div className="face-login-container">
      <div className="face-login-box">
        <h1 className="face-login-title">Face Login</h1>
        <div className="face-scan-area">
          <div className="face-placeholder">
            <p>Face Scan Area</p>
          </div>
        </div>
        <button className="face-scan-button" onClick={handleFaceScan}>
          얼굴 스캔 시작
        </button>
        <button className="go-back-button" onClick={handleGoBack}>
          돌아가기
        </button>
      </div>
    </div>
  );
}

export default FaceLogin;
