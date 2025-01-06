import React, { useState, useRef } from 'react';

const FaceIdComponent = () => {
  const [status, setStatus] = useState('');
  const [imageData, setImageData] = useState(null);  // 촬영된 이미지 상태
  const [userUuid, setUserUuid] = useState('');  // UUID 저장
  const imageInputRef = useRef(null);

  const handleFaceIDLogin = async () => {
    if (!window.PublicKeyCredential) {
      setStatus('WebAuthn을 지원하지 않습니다.');
      return;
    }

    try {
      const response = await navigator.credentials.get({
        publicKey: {
          challenge: new Uint8Array(32),
          allowCredentials: [],
          timeout: 60000,
          userVerification: "required",
        },
      });

      const authData = {
        id: response.id,
        rawId: response.rawId,
        response: {
          clientDataJSON: response.response.clientDataJSON,
          authenticatorData: response.response.authenticatorData,
          signature: response.response.signature,
          userHandle: response.response.userHandle,
        },
      };

      const serverResponse = await fetch('/member/faceid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authData),
      });

      if (serverResponse.ok) {
        setStatus('Face ID 인증 성공!');
      } else {
        setStatus('Face ID 인증 실패. 다시 시도해주세요.');
      }
    } catch (error) {
      setStatus('Face ID 인증 실패. 오류가 발생했습니다.');
    }
  };

  const handleCaptureImage = async () => {
    // 이미지 촬영 및 저장 로직 추가
    // 예시: 이미지 URL을 `imageData`에 저장하고, UUID를 설정합니다.
    // 이 부분은 실제 얼굴 인식 로직에 맞게 수정이 필요합니다.
    setImageData("capturedImage");  // 임시로 'capturedImage' 설정
    setUserUuid("user-uuid-123");  // 임시로 UUID 설정
    setStatus('얼굴 인식 후 3초 뒤 촬영 시작...');
  };

  const handleRetryCapture = async () => {
    if (imageData) {
      // 기존 이미지를 삭제하고 DB에서 관련된 데이터 삭제
      await fetch(`/delete-faceid`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uuid: userUuid })
      });

      // 새로 촬영 시작
      setImageData(null);
      handleCaptureImage();
    }
  };

  const goBack = () => {
    window.history.back(); // 이전 페이지로 이동
  };

  return (
    <div>
      <h2>Face ID 로그인</h2>
      <button onClick={handleFaceIDLogin}>Face ID로 로그인</button>
      <button onClick={handleCaptureImage}>얼굴 인식 후 촬영</button>
      <p>{status}</p>

      {/* 뒤로가기 버튼 */}
      <button onClick={goBack}>뒤로가기</button>

      {/* 다시 촬영 버튼 */}
      {imageData && (
        <button onClick={handleRetryCapture}>다시촬영</button>
      )}
    </div>
  );
};

export default FaceIdComponent;
