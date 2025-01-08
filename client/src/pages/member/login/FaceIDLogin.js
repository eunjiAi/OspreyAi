import React, { useRef, useEffect, forwardRef, useImperativeHandle, useState } from "react";
import styles from "./FaceIDLogin.module.css"; // 스타일 불러오기

const FaceIDLogin = forwardRef((props, ref) => {
  const videoRef = useRef(null); // 웹캠 video 엘리먼트 참조
  const canvasRef = useRef(null); // 얼굴 캡처 후 이미지를 저장할 canvas 참조
  const [isWebcamActive, setIsWebcamActive] = useState(false); // 웹캠 활성화 상태

  const startWebcam = async () => {
    if (videoRef.current && !isWebcamActive) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        videoRef.current.srcObject = stream; // 웹캠 스트림 연결
        setIsWebcamActive(true); // 웹캠 활성화 상태 업데이트
      } catch (error) {
        console.error("웹캠을 시작하는 동안 오류 발생:", error);
        alert("웹캠을 시작하는 동안 오류가 발생했습니다.");
      }
    }
  };

  useEffect(() => {
    return () => {
      if (videoRef.current) {
        const stream = videoRef.current.srcObject;
        if (stream) {
          const tracks = stream.getTracks();
          tracks.forEach((track) => track.stop()); // 웹캠 종료
        }
      }
    };
  }, []);

  const captureImage = () => {
    if (!isWebcamActive) {
      alert("웹캠이 활성화되지 않았습니다. 먼저 캠을 활성화하세요.");
      return null;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    return canvas.toDataURL("image/jpeg");
  };

  useImperativeHandle(ref, () => ({
    captureImage,
  }));

  return (
    <div className={styles.container}>
      <h3 className={styles.header}>얼굴 인식</h3>
      {!isWebcamActive && (
        <button onClick={startWebcam} className={styles.button}>
          캠 열기
        </button>
      )}
      <video
        ref={videoRef}
        autoPlay
        className={`${styles.video} ${!isWebcamActive ? styles.hidden : ""}`}
      />
      <canvas ref={canvasRef} className={styles.hidden}></canvas>
    </div>
  );
});

export default FaceIDLogin;
