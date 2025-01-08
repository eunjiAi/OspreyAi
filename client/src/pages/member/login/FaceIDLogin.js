import React, { useRef, useEffect, forwardRef, useImperativeHandle, useState } from "react";
import styles from "./FaceIDLogin.module.css";

const FaceIDLogin = forwardRef((props, ref) => {
  const videoRef = useRef(null); // 비디오 엘리먼트 참조
  const canvasRef = useRef(null); // 캔버스 엘리먼트 참조
  const [isWebcamActive, setIsWebcamActive] = useState(false); // 웹캠 활성화 상태

  // 웹캠 시작 함수
  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true }); // 웹캠 스트림 요청
      if (videoRef.current) {
        videoRef.current.srcObject = stream; // 비디오에 스트림 연결
        videoRef.current.play(); // 비디오 재생
        setIsWebcamActive(true); // 상태 업데이트
      }
    } catch (error) {
      console.error("웹캠 시작 오류:", error);
      alert("웹캠을 시작하는 데 실패했습니다. 브라우저 설정을 확인해주세요.");
    }
  };

  // 웹캠 종료 함수
  const stopWebcam = () => {
    if (videoRef.current) {
      const stream = videoRef.current.srcObject;
      if (stream) {
        stream.getTracks().forEach((track) => track.stop()); // 스트림의 모든 트랙 종료
      }
      videoRef.current.srcObject = null; // 스트림 해제
      setIsWebcamActive(false); // 상태 업데이트
    }
  };

  // 컴포넌트가 언마운트될 때 웹캠 종료
  useEffect(() => {
    return () => stopWebcam();
  }, []);

  // 얼굴 이미지 캡처 함수
  const captureImage = () => {
    if (!isWebcamActive) {
      alert("웹캠이 활성화되지 않았습니다. 캠을 먼저 열어주세요.");
      return null;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // 캔버스를 비디오 크기에 맞게 설정
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // 비디오 이미지를 캔버스에 그리기
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // 캔버스를 이미지 데이터로 변환 후 반환
    return canvas.toDataURL("image/jpeg");
  };

  // 외부에서 사용할 메서드 등록
  useImperativeHandle(ref, () => ({
    captureImage, // 이미지 캡처 메서드
    startWebcam, // 웹캠 시작 메서드
    stopWebcam, // 웹캠 종료 메서드
  }));

  return (
    <div className={styles.container}>
      <h3 className={styles.header}>얼굴 인식</h3>

      {/* 캠 대기 중 메시지 */}
      {!isWebcamActive && (
        <div className={styles.videoPlaceholder}>캠 대기 중</div>
      )}

      {/* 비디오 화면 */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className={`${styles.video} ${!isWebcamActive ? styles.hidden : ""}`}
      ></video>

      {/* 캠 열기/닫기 버튼 */}
      <button onClick={isWebcamActive ? stopWebcam : startWebcam} className={styles.button}>
        {isWebcamActive ? "캠 닫기" : "캠 열기"}
      </button>

      <canvas ref={canvasRef} className={styles.hidden}></canvas>
    </div>
  );
});

export default FaceIDLogin;
