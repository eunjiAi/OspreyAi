import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Webcam from "react-webcam";

function FaceIdRegister() {
    const [capturedImage, setCapturedImage] = useState(null);
    const [statusMessage, setStatusMessage] = useState("");
    const [userUuid, setUserUuid] = useState("");
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
    }, []);

    const captureImage = () => {
        const imageSrc = webcamRef.current.getScreenshot();
        setCapturedImage(imageSrc);
        console.log("Captured Image:", imageSrc);
    };

    const handleRegister = async () => {
        if (!capturedImage) {
            setStatusMessage("얼굴을 캡처해야 합니다.");
            return;
        }

        if (!userUuid) {
            setStatusMessage("사용자 UUID를 확인할 수 없습니다.");
            return;
        }

        try {
            console.log("Sending image and UUID to server...");
            const response = await axios.post("http://localhost:5001/register-faceid", {
                image: capturedImage,
                uuid: userUuid,
            });

            if (response.status === 200) {
                setStatusMessage("Face ID 등록 성공!");
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
        <div>
            <h1>Face ID 등록</h1>
            <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width={300}
            />
            <button onClick={captureImage}>얼굴 캡처</button>
            <button onClick={handleRegister}>Face ID 등록</button>
            {capturedImage && <img src={capturedImage} alt="Captured face" />}
            <p>{statusMessage}</p>
        </div>
    );
}

export default FaceIdRegister;
