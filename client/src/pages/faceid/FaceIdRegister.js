import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";
import styles from "./FaceIdRegister.module.css"; // CSS 모듈 가져오기

function FaceIdRegister() {
    const [statusMessage, setStatusMessage] = useState("모델 로딩 중입니다...");
    const [userUuid, setUserUuid] = useState("");
    const [modelsLoaded, setModelsLoaded] = useState(false); // 모델 로딩 상태
    const [faceDetected, setFaceDetected] = useState(false);
    const [captureTimer, setCaptureTimer] = useState(null); // 3초 타이머 관리
    const [imageCaptured, setImageCaptured] = useState(false); // 촬영 여부 상태
    const webcamRef = useRef(null);
    const detectionIntervalRef = useRef(null); // 얼굴 감지 반복 관리

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
                await faceapi.nets.ssdMobilenetv1.loadFromUri(
                    "https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js/weights/"
                );
                await faceapi.nets.faceLandmark68Net.loadFromUri(
                    "https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js/weights/"
                );
                await faceapi.nets.faceRecognitionNet.loadFromUri(
                    "https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js/weights/"
                );

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
            startDetectingFaces();
        }

        return () => {
            // 컴포넌트 언마운트 시 감지 중지
            stopDetectingFaces();
        };
    }, [modelsLoaded]);

    const startDetectingFaces = () => {
        detectionIntervalRef.current = setInterval(async () => {
            console.log("detectFace 함수 호출됨");

            if (webcamRef.current && webcamRef.current.video.readyState === 4) {
                const video = webcamRef.current.video;
                const detections = await faceapi
                    .detectAllFaces(video)
                    .withFaceLandmarks()
                    .withFaceDescriptors();

                if (detections.length > 0) {
                    setFaceDetected(true);
                    setStatusMessage("얼굴 인식 완료! 3초간 멈춰주세요.");

                    // 이미 이미지가 캡처된 상태라면 중복 호출 방지
                    if (!imageCaptured && !captureTimer) {
                        const timer = setTimeout(() => {
                            sendImageToServer();
                            stopDetectingFaces(); // 얼굴 감지 중지
                        }, 3000);

                        setCaptureTimer(timer);
                    }
                } else {
                    setFaceDetected(false);
                    setStatusMessage("얼굴을 맞춰주세요.");
                }
            }
        }, 1000); // 1초마다 얼굴 인식
    };

    const stopDetectingFaces = () => {
        if (detectionIntervalRef.current) {
            clearInterval(detectionIntervalRef.current);
            detectionIntervalRef.current = null;
        }
    };

    const sendImageToServer = async () => {
        if (!userUuid || imageCaptured) {
            return; // UUID가 없거나 이미 저장된 경우 실행하지 않음
        }

        try {
            const imageSrc = webcamRef.current.getScreenshot();
            if (!imageSrc) {
                setStatusMessage("이미지 캡처 실패!");
                return;
            }

            const response = await axios.post("http://localhost:5001/register-faceid", {
                image: imageSrc,
                uuid: userUuid,
            });

            if (response.status === 200) {
                setStatusMessage("저장 완료! 이미지가 저장됐습니다.");
                setImageCaptured(true); // 촬영 상태 업데이트
                console.log("Face ID 등록 성공:", response.data);
            } else {
                setStatusMessage("Face ID 등록 실패!");
            }
        } catch (error) {
            console.error("Face ID 등록 오류:", error);
            setStatusMessage("Face ID 등록 실패!");
        } finally {
            if (captureTimer) clearTimeout(captureTimer);
            setCaptureTimer(null);
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
                uuid: userUuid,
            });

            if (response.status === 200) {
                setStatusMessage("기존 이미지가 삭제됐습니다. 다시 촬영을 시작합니다.");
                setImageCaptured(false); // 다시 촬영할 수 있도록 상태 초기화
                setFaceDetected(false); // 얼굴 인식 상태 초기화
                startDetectingFaces(); // 얼굴 감지 시작
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
            {imageCaptured && <button onClick={retryCapture}>다시 촬영</button>}
        </div>
    );
}

export default FaceIdRegister;
