import React, { useRef, useEffect, forwardRef, useImperativeHandle } from "react";

const FaceIDLogin = forwardRef((props, ref) => {
  const videoRef = useRef(null); // 웹캠 video 엘리먼트 참조
  const canvasRef = useRef(null); // 얼굴 캡처 후 이미지를 저장할 canvas 참조

  useEffect(() => {
    const startWebcam = async () => {
      if (videoRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        videoRef.current.srcObject = stream; // 웹캠 스트림 연결
      } else {
        console.error("videoRef.current is null");
      }
    };

    // 컴포넌트가 마운트되면 웹캠 시작
    startWebcam();

    // 컴포넌트가 언마운트될 때 웹캠 중지
    return () => {
      if (videoRef.current) {
        const stream = videoRef.current.srcObject;
        if (stream) {
          const tracks = stream.getTracks();
          tracks.forEach((track) => track.stop()); // 웹캠 중지
        }
      }
    };
  }, []);

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // 캔버스 크기 설정
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // 캔버스에 현재 웹캠 화면 캡처
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // 캡처된 이미지를 base64로 변환
    return canvas.toDataURL("image/jpeg");
  };

  // 외부에서 captureImage 호출 가능하도록 설정
  useImperativeHandle(ref, () => ({
    captureImage,
  }));

  return (
    <div style={{ textAlign: "center" }}>
      <h3>얼굴 인식 로그인</h3>
      {/* 웹캠 화면 */}
      <video ref={videoRef} autoPlay width="300" height="200" />
      {/* 캡처된 이미지를 처리할 캔버스 (화면에 보이지 않음) */}
      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
    </div>
  );
});

export default FaceIDLogin;
