import React, { useEffect, useState, useRef } from 'react';
import './SquatFeedback.css';

function SquatFeedback() {
  const [feedback, setFeedback] = useState(''); // 자세 교정 메시지
  const [angle, setAngle] = useState(null); // 상체 각도
  const [kneePosition, setKneePosition] = useState(null); // 무릎 위치
  const [dailyStats, setDailyStats] = useState([]); // 날짜별 통계
  const [intervalTime, setIntervalTime] = useState(1000); // 검사 간격 (밀리초)
  const [isRunning, setIsRunning] = useState(false); // 분석 중 여부
  const videoRef = useRef(null);
  const intervalIdRef = useRef(null); // setInterval의 ID 저장

  useEffect(() => {
    const startWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing webcam:', error);
      }
    };
    startWebcam();
  }, []);

  const fetchData = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const context = canvas.getContext('2d');
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL('image/png'); // 이미지 데이터를 base64 형식으로 변환

      fetch('http://localhost:5000/squat-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ frame: imageData })
      })
        .then(response => response.json())
        .then(data => {
          setAngle(data.angle);
          setKneePosition(data.knee_position);
          setFeedback(data.feedback);
        })
        .catch(error => console.error('Error fetching feedback:', error));
    }
  };

  const startAnalysis = () => {
    setIsRunning(true);
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
    }
    intervalIdRef.current = setInterval(fetchData, intervalTime);
  };

  const stopAnalysis = () => {
    setIsRunning(false);
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
    }
  };

  useEffect(() => {
    fetch('http://localhost:8888/OspreyAI/api/squat/daily-stats')
      .then(response => response.json())
      .then(data => {
        setDailyStats(Array.isArray(data) ? data : []);
      })
      .catch(error => {
        console.error('Error fetching daily stats:', error);
        setDailyStats([]);
      });
  }, []);

  return (
    <div className="squat-feedback-container">
      {/* 왼쪽 웹캠 화면 */}
      <div className="webcam-container">
        <video ref={videoRef} autoPlay muted className="webcam-video" />
      </div>

      {/* 오른쪽 설정 및 피드백 */}
      <div className="feedback-panel">
        <h1 className="title">Squat Feedback</h1>
        <div className="feedback-info">
          <p>상체 각도: <span>{angle}</span></p>
          <p>무릎 위치: <span>{kneePosition}</span></p>
          <p>피드백: <span>{feedback}</span></p>
        </div>

        <div className="control-panel">
          <label>검사 간격 (초): {intervalTime / 1000}초</label>
          <input
            type="range"
            min="1"
            max="10"
            value={intervalTime / 1000}
            onChange={(e) => setIntervalTime(e.target.value * 1000)}
            className="slider"
          />
          <button onClick={startAnalysis} disabled={isRunning} className="control-button start">시작</button>
          <button onClick={stopAnalysis} disabled={!isRunning} className="control-button stop">종료</button>
        </div>

        <div className="daily-stats">
          <h2>Daily Stats</h2>
          <ul>
            {Array.isArray(dailyStats) && dailyStats.length > 0 ? (
              dailyStats.map((stat, index) => (
                <li key={index}>
                  날짜: {stat.date}, 총 운동 시간: {stat.duration}분, 바른 자세 시간: {stat.correctPostureDuration}분
                </li>
              ))
            ) : (
              <p>No data available</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default SquatFeedback;
