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
    const [registering, setRegistering] = useState(false); // 등록 중 상태
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
                await faceapi.nets.ssdMobilenetv1.loadFromUri("https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js/weights/");
                await faceapi.nets.faceLandmark68Net.loadFromUri("https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js/weights/");
                await faceapi.nets.faceRecognitionNet.loadFromUri("https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js/weights/");

                setModelsLoaded(true); // 모델 로드 완료 상태
                setStatusMessage("모델 로딩 완료! 얼굴을 맞춰주세요.");
                console.log("Face-api models loaded");
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
            detectFace();
        }
    }, [modelsLoaded]);

    const detectFace = async () => {
        if (webcamRef.current && webcamRef.current.video.readyState === 4) {
            const video = webcamRef.current.video;
            const detections = await faceapi.detectAllFaces(video).withFaceLandmarks().withFaceDescriptors();

            if (detections.length > 0) {
                setFaceDetected(true); // 얼굴 인식 성공
                setStatusMessage("얼굴 인식 중...");
                // 얼굴을 인식하면 3초 후에 등록
                setRegistering(true);
                setTimeout(() => {
                    setStatusMessage("얼굴 인식 완료! 3초간 멈춰주세요.");
                    setTimeout(() => {
                        sendImageToServer();
                    }, 3000); // 3초 대기 후 서버로 이미지 전송
                }, 1000); // 얼굴 인식 완료 후 1초 대기
            } else {
                setFaceDetected(false);
                setStatusMessage("얼굴을 맞춰주세요.");
            }
        }
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
                setStatusMessage("저장 완료! 이미지가 서버에 저장되었습니다.");
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

    return (
        <div className={styles.faceIdContainer}>
            <h1 className={styles.title}>Face ID 등록</h1>
            <div className={styles.webcamWrapper}>
                <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    width="100%"   // 화면 크기에 맞게 100%로 설정
                    height="100%"  // 100% 높이로 설정하여 전체 화면을 꽉 채우도록
                />
            </div>
            <p>{statusMessage}</p>
        </div>
    );
}

export default FaceIdRegister;
