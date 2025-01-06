
// npm install face-api.js
import React, { useState, useRef, useEffect } from 'react';
import * as faceapi from 'face-api.js';

const FaceIdComponent = () => {
  const [status, setStatus] = useState('');
  const [imageData, setImageData] = useState(null);   // 촬영된 이미지 상태
  const [userUuid, setUserUuid] = useState('');       // UUID 저장
  const imageInputRef = useRef(null);

  // 로그인한 사용자 UUID를 서버에서 받아오기 (useEffect로 초기화)
  useEffect(() => {
    const fetchUserUuid = async () => {
      const response = await fetch('/get-user-uuid');  // 서버에서 로그인한 UUID를 가져오는 API 호출
      if (response.ok) {
        const data = await response.json();
        setUserUuid(data.uuid);  // 서버에서 받은 UUID로 설정
      } else {
        setStatus('사용자 UUID를 가져오는 데 실패했습니다.');
      }
    };

    fetchUserUuid();  // 컴포넌트가 마운트될 때 호출
  }, []);

  const handleCaptureImage = async () => {
    if (!userUuid) {
      setStatus('로그인된 사용자 정보가 없습니다.');
      return;
    }

    setStatus('얼굴 인식 중...');
    
    // WebCam 사용하여 얼굴 인식
    const video = document.createElement('video');
    const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
    video.srcObject = stream;
    video.play();

    // 얼굴 인식 모델 로드
    await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
    await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
    await faceapi.nets.faceRecognitionNet.loadFromUri('/models');

    video.onplaying = async () => {
      // 얼굴 인식 진행
      const detections = await faceapi.detectAllFaces(video)
        .withFaceLandmarks()
        .withFaceDescriptors();

      if (detections.length > 0) {
        // 얼굴이 인식되었을 경우 이미지 캡처
        setStatus('얼굴 인식 완료, 3초 뒤 촬영...');

        setTimeout(async () => {
          // 캡처한 이미지
          const canvas = faceapi.createCanvasFromMedia(video);
          const imageUrl = canvas.toDataURL();  // 이미지 URL을 base64로 저장

          // 이미지 데이터와 UUID 설정
          setImageData(imageUrl);  // 캡처된 이미지 URL
          setStatus('얼굴 인식 후 이미지 캡처 완료!');
          
          // 추가적으로 이미지 데이터를 서버에 전송하는 로직을 추가할 수 있습니다.
          await handleImageSave(imageUrl, userUuid);  // 로그인된 사용자의 UUID 사용
        }, 3000);  // 3초 후 촬영
      } else {
        setStatus('얼굴이 인식되지 않았습니다. 다시 시도해주세요.');
      }
    };
  };

  const handleImageSave = async (imageUrl, uuid) => {
    // 이미지 저장 API 호출 (서버로 이미지를 전송)
    const response = await fetch('/register-faceid', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image: imageUrl,  // base64 이미지 데이터
        uuid: uuid,  // 로그인된 사용자 UUID 사용
      }),
    });

    if (response.ok) {
      setStatus('이미지 저장 성공!');
    } else {
      setStatus('이미지 저장 실패!');
    }
  };

  const goBack = () => {
    window.history.back(); // 이전 페이지로 이동
  };

  return (
    <div>
      <h2>Face ID 로그인</h2>
      <button onClick={handleCaptureImage}>얼굴 인식 후 촬영</button>
      <p>{status}</p>

      {/* 뒤로가기 버튼 */}
      <button onClick={goBack}>뒤로가기</button>

      {/* 다시 촬영 버튼 */}
      {imageData && (
        <button onClick={handleCaptureImage}>다시 촬영</button>
      )}
    </div>
  );
};

export default FaceIdComponent;
