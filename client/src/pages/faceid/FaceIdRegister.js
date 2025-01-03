import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";
import styles from "./FaceIdRegister.module.css";  // CSS 모듈 가져오기

function FaceIdRegister() {
    const [statusMessage, setStatusMessage] = useState("");
    const [userUuid, setUserUuid] = useState("");
    const [faceDetected, setFaceDetected] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);  // 등록 중 상태
    const [modelsLoaded, setModelsLoaded] = useState(false);  // 모델 로드 상태
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);

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

        // Load face-api.js models
        const loadModels = async () => {
            await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
            await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
            await faceapi.nets.faceRecognitionNet.loadFromUri("/models");

            setModelsLoaded(true);  // 모델 로드 완료 상태
            console.log("Face-api models loaded");
        };

        loadModels();

    }, []);

    const startRegistration = () => {
        if (!modelsLoaded) {
            setStatusMessage("모델 로딩 중입니다...");
            return;
        }

        setIsRegistering(true);
        setStatusMessage("얼굴을 빨간 네모칸에 맞춰주세요.");
    };

    const detectFace = async () => {
        if (webcamRef.current && webcamRef.current.video.readyState === 4) {
            const video = webcamRef.current.video;
            const detections = await faceapi.detectAllFaces(video).withFaceLandmarks().withFaceDescriptors();
    
            if (detections.length > 0) {
                setFaceDetected(true); // 얼굴 인식 성공
                const canvas = canvasRef.current;
                faceapi.matchDimensions(canvas, {
                    width: video.width,
                    height: video.height
                });
                const resizedDetections = faceapi.resizeResults(detections, {
                    width: video.width,
                    height: video.height
                });
                canvas?.clear();
                // 얼굴이 인식되면 초록 박스로 그리기
                faceapi.draw.drawDetections(canvas, resizedDetections, { 
                    withScore: false, 
                    color: 'green' 
                });
                faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
            } else {
                setFaceDetected(false);
                // 얼굴이 인식되지 않으면 빨간 박스로 다시 그리기
                const canvas = canvasRef.current;
                faceapi.matchDimensions(canvas, {
                    width: webcamRef.current.video.width,
                    height: webcamRef.current.video.height
                });
                canvas?.clear();
            }
        }
    };
    

    const handleRegister = async () => {
        if (!userUuid) {
            setStatusMessage("사용자 UUID를 확인할 수 없습니다.");
            return;
        }

        try {
            const timestamp = new Date().toISOString();
            const filename = `${userUuid}_${timestamp}.jpg`;  // UUID + 타임스탬프 기반 파일명

            console.log("Sending image and UUID to server...");

            const response = await axios.post("http://localhost:5001/register-faceid", {
                image: webcamRef.current.getScreenshot(),
                filename: filename,
            });

            if (response.status === 200) {
                setStatusMessage("등록 성공! 이미지 저장 완료.");
                console.log("Face ID 등록 성공:", response.data);
            } else {
                setStatusMessage("Face ID 등록 실패!");
                console.log("Face ID 등록 실패:", response.data);
            }
        } catch (error) {
            console.error("Face ID 등록 오류:", error);
            setStatusMessage("Face ID 등록 실패!");
        }
    };

    useEffect(() => {
        if (isRegistering) {
            const interval = setInterval(() => {
                detectFace();
            }, 100);

            return () => clearInterval(interval); // cleanup on component unmount
        }
    }, [isRegistering]);

    return (
        <div className={styles.faceIdContainer}>
            <h1 className={styles.title}>Face ID 등록</h1>
            <div className={styles.webcamWrapper}>
                <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    width={300}
                />
                {!isRegistering && (
                    <div className={styles.redRectangle}></div>
                )}
                {isRegistering && faceDetected && (
                    <div className={styles.greenRectangle}></div>
                )}
                <canvas ref={canvasRef} className={styles.canvas} />
            </div>
            {!isRegistering && (
                <button className={styles.registerButton} onClick={startRegistration}>
                    등록 시작
                </button>
            )}
            {faceDetected && !isRegistering && (
                <button className={styles.registerButton} onClick={handleRegister}>
                    등록중...
                </button>
            )}
            <p className={styles.statusMessage}>{statusMessage}</p>
        </div>
    );
}

export default FaceIdRegister;
