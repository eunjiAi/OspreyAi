import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";
import styles from "./FaceIdRegister.module.css";  // CSS 모듈 가져오기

function FaceIdRegister() {
    const [statusMessage, setStatusMessage] = useState("모델 로딩 중입니다...");
    const [userUuid, setUserUuid] = useState("");
    const [modelsLoaded, setModelsLoaded] = useState(false); // 모델 로딩 상태
    const [faceDetected, setFaceDetected] = useState(false);
    const [captureTimer, setCaptureTimer] = useState(null);  // 3초 타이머 관리
    const [imageCaptured, setImageCaptured] = useState(false); // 촬영 여부 상태
    const webcamRef = useRef(null);

    // JWT 토큰에서 UUID 추출
    const getPayloadFromToken = (token) => {
        if (!token) return null;
        try {
            const base64Url = token.split(".")[1];
            const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
            const decodedPayload = atob(base64);
            return JSON.parse(decodedPayload);
        } catch (e) {
            console.error("JWT 디코딩 오류:", e);
            return null;
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        const payload = getPayloadFromToken(token);

        if (payload && payload.uuid) {
            setUserUuid(payload.uuid);
            console.log("Extracted UUID:", payload.uuid);
        } else {
            setStatusMessage("사용자 인증 정보가 없습니다.");
            console.log("No UUID found in token.");
        }

        // Load face-api.js models from CDN
        const loadModels = async () => {
            try {
                setStatusMessage("모델 로딩 중...");
                console.log("모델 로딩 시작...");
                await faceapi.nets.ssdMobilenetv1.loadFromUri("https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js/weights/");
                await faceapi.nets.faceLandmark68Net.loadFromUri("https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js/weights/");
                await faceapi.nets.faceRecognitionNet.loadFromUri("https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js/weights/");

                setModelsLoaded(true); // 모델 로드 완료 상태
                setStatusMessage("모델 로딩 완료! 얼굴을 맞춰주세요.");
                console.log("모델 로딩 완료");
            } catch (error) {
                console.error("모델 로드 실패:", error);
                setStatusMessage("모델 로드 실패!");
            }
        };

        loadModels();

    }, []);

    useEffect(() => {
        if (modelsLoaded) {
            // 모델 로딩 완료 후 얼굴 감지 시작
            console.log("모델 로딩 완료 후 얼굴 감지 시작");
            detectFace();
        }
    }, [modelsLoaded]);

    const detectFace = async () => {
        setInterval(async () => { // 1초마다 얼굴을 인식
            console.log("detectFace 함수 호출됨");

            // 비디오가 준비되었을 때만 얼굴 인식 진행
            if (webcamRef.current && webcamRef.current.video.readyState === 4) {
                const video = webcamRef.current.video;
                console.log("비디오가 준비되었습니다.", video);
                const detections = await faceapi.detectAllFaces(video).withFaceLandmarks().withFaceDescriptors();
                console.log("얼굴 감지 결과:", detections); // 얼굴 인식 결과 출력

                if (detections.length > 0) {
                    setFaceDetected(true); // 얼굴 인식 성공
                    setStatusMessage("얼굴 인식 중...");
                    console.log("얼굴이 인식되었습니다.");  // 얼굴 인식 성공 로그
                    
                    // 얼굴을 인식하면 3초 후에 등록
                    setStatusMessage("얼굴 인식 완료! 3초간 멈춰주세요.");
                    if (captureTimer) clearTimeout(captureTimer);  // 기존 타이머가 있으면 취소
                    const timer = setTimeout(() => {
                        sendImageToServer();
                    }, 3000); // 3초 대기 후 서버로 이미지 전송
                    setCaptureTimer(timer);  // 새 타이머 저장
                } else {
                    setFaceDetected(false);
                    setStatusMessage("얼굴을 맞춰주세요.");
                    console.log("얼굴이 인식되지 않았습니다.");  // 얼굴 인식 실패 로그
                }
            }
        }, 1000); // 1초마다 얼굴 인식
    };

    const sendImageToServer = async () => {
        if (!userUuid) {
            setStatusMessage("사용자 UUID를 확인할 수 없습니다.");
            return;
        }

        try {
            const imageSrc = webcamRef.current.getScreenshot();

            if (!imageSrc) {
                setStatusMessage("이미지 캡처 실패!");
                return;
            }

            const response = await axios.post("http://localhost:5001/register-faceid", {
                image: imageSrc,
                uuid: userUuid
            });

            if (response.status === 200) {
                setStatusMessage("저장 완료! 이미지가 저장됐습니다.");
                console.log("Face ID 등록 성공:", response.data);
                setImageCaptured(true); // 촬영 상태 업데이트
            } else {
                setStatusMessage("Face ID 등록 실패!");
                console.log("Face ID 등록 실패:", response.data);
            }
        } catch (error) {
            console.error("Face ID 등록 오류:", error);
            setStatusMessage("Face ID 등록 실패!");
        }
    };

    const retryCapture = async () => {
        if (!imageCaptured) {
            setStatusMessage("이미 촬영된 이미지가 없습니다.");
            return;
        }

        try {
            // 기존 이미지 삭제 요청
            const response = await axios.post("http://localhost:5001/delete-faceid", {
                uuid: userUuid
            });

            if (response.status === 200) {
                setStatusMessage("기존 이미지가 삭제됐습니다. 다시 촬영을 시작합니다.");
                setImageCaptured(false);        // 다시 촬영할 수 있도록 상태 초기화
                setFaceDetected(false);         // 얼굴 인식 상태 초기화
                detectFace();                   // 얼굴 감지 시작
            } else {
                setStatusMessage("기존 이미지 삭제 실패!");
            }
        } catch (error) {
            console.error("기존 이미지 삭제 오류:", error);
            setStatusMessage("기존 이미지 삭제 실패!");
        }
    };

    const goBack = () => {
        window.history.back(); // 이전 페이지로 이동
    };

    return (
        <div className={styles.faceIdContainer}>
            <h1 className={styles.title}>Face ID 등록</h1>
            <div className={styles.webcamWrapper}>
                <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    width="100%"  
                    height="100%" 
                />
            </div>
            <p>{statusMessage}</p>

            {/* 뒤로가기 버튼 */}
            <button onClick={goBack}>뒤로가기</button>

            {/* 다시 촬영 버튼 (이미지 촬영 후에만 활성화) */}
            {imageCaptured && (
                <button onClick={retryCapture}>다시 촬영</button>
            )}
        </div>
    );
}

export default FaceIdRegister;
