import React, { useState, useRef, useEffect } from "react";
import axios from "../../../utils/axios"; // axios import

const FaceIDLogin = ({ onClose, onLoginSuccess }) => {
  const [isProcessing, setIsProcessing] = useState(false); // 얼굴 인식 진행 중 여부
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태
  const videoRef = useRef(null); // 웹캠 video 엘리먼트 참조
  const canvasRef = useRef(null); // 얼굴 인식 후 이미지를 그릴 canvas 참조

  useEffect(() => {
    const startWebcam = async () => {
      // videoRef가 null인지 확인
      if (videoRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        videoRef.current.srcObject = stream; // 비디오 스트림 설정
      } else {
        console.error("videoRef.current is null");
      }
    };

    // 컴포넌트가 마운트된 후 웹캠을 시작
    startWebcam();

    // 클린업: 컴포넌트 언마운트 시 웹캠 중지
    return () => {
      if (videoRef.current) {
        const stream = videoRef.current.srcObject;
        if (stream) {
          const tracks = stream.getTracks();
          tracks.forEach((track) => track.stop()); // 웹캠 중지
        }
      }
    };
  }, []); // 빈 배열로 인해 컴포넌트가 처음 렌더링될 때만 실행됨

  const handleCapture = () => {
    if (isLoggedIn) {
      alert("이미 로그인되었습니다.");
      return;
    }

    setIsProcessing(true); // 얼굴 인식 시작
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // 캔버스 크기 설정
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // 캔버스에 웹캠 이미지 그리기
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL("image/jpeg"); // 캔버스의 이미지를 base64로 변환

    console.log("Captured image data:", imageData); // 캡처된 이미지 데이터 확인

    // 얼굴 인식 결과를 서버로 전송
    axios
      .post("http://localhost:5001/compare-faceid", { image: imageData })
      .then((response) => {
        console.log("Server response:", response.data); // 서버 응답 로그 추가

        const { uuid, id } = response.data;

        if (uuid && id) {
          // 얼굴 인식 후 UUID로 로그인
          alert("로그인 성공!");

          // 로그인 상태 갱신
          setIsLoggedIn(true);

          // 로그인 후 성공적으로 모달 닫기
          onLoginSuccess(); // 로그인 성공 시 콜백 호출
          onClose(); // 모달 닫기
        } else {
          alert("얼굴 인식 실패: 일치하는 사용자를 찾을 수 없습니다.");
          setIsProcessing(false); // 처리 종료
        }
      })
      .catch((error) => {
        alert("얼굴 인식 실패: " + (error.response?.data?.message || "다시 시도하십시오."));
        setIsProcessing(false); // 처리 종료
      });
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h3>얼굴 인식 로그인</h3>
      {/* 웹캠 비디오 화면 */}
      <video ref={videoRef} autoPlay width="300" height="200" />
      {/* 얼굴 인식 후 이미지를 그릴 캔버스 (화면에는 보이지 않음) */}
      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>

      <div>
        {/* 얼굴 인식 버튼 */}
        <button onClick={handleCapture} disabled={isProcessing || isLoggedIn}>
          {isProcessing ? "인식 중..." : isLoggedIn ? "이미 로그인되었습니다" : "얼굴 인식 시작"}
        </button>
        {/* 모달 닫기 버튼 */}
        <button onClick={onClose}>닫기</button>
      </div>
    </div>
  );
};

export default FaceIDLogin;
