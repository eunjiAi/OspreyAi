import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import robotImage from '../images/robot1.png';

function Home() {
    const [message, setMessage] = useState("");

    useEffect(() => {
        // Spring Boot의 /OspreyAI/api/home 엔드포인트로 요청
        fetch("http://localhost:8888/OspreyAI/api/home")
            .then(response => response.json())
            .then(data => {
                // React 콘솔에 응답 출력
                console.log("Received data from Spring Boot:", data);
                
                // message 상태 업데이트
                setMessage(data.message);
            })
            .catch(error => console.error("Error fetching data:", error));
    }, []);

    return (
        <div className="home-container">
            <section className="hero">
                <h1 className="hero-title">OspreyAI</h1>
                <p className="hero-description">실시간 비전 모니터링 AI 시스템</p>
                <p>{message}</p> {/* Spring Boot API의 메시지 표시 */}
                
            </section>
            <section className="features">
                <Link to="/WebcamCapture" className="feature">
                    <div className="feature-icon">
                        <img src={robotImage} alt="AI Process" />
                    </div>
                    <h2 className="feature-title">Real-time Process AI</h2>
                    <p className="feature-description">OspreyAI</p>
                </Link>
            </section>
        </div>
    );
}

export default Home;
