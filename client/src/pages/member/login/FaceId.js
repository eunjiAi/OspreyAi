import React, { useState } from 'react';

const FaceIdComponent = () => {
  const [status, setStatus] = useState('');

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

  return (
    <div>
      <h2>Face ID 로그인</h2>
      <button onClick={handleFaceIDLogin}>Face ID로 로그인</button>
      <p>{status}</p>
    </div>
  );
};

export default FaceIdComponent;
