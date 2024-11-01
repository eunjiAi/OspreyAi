import React, { useEffect, useState, useRef } from 'react';
import './SquatFeedback.css';

function SquatFeedback() {
  const [feedback, setFeedback] = useState(''); // 자세 교정 메시지
  const [angle, setAngle] = useState(null); // 상체 각도
  const [kneePosition, setKneePosition] = useState(null); // 무릎 위치
  const [dailyStats, setDailyStats] = useState([]); // 날짜별 통계
  const videoRef = useRef(null);

  useEffect(() => {
    // 웹캠 스트림 가져오기
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

  useEffect(() => {
    // 1초마다 Python 서버로 웹캠 이미지를 전송하여 자세 분석
    const intervalId = setInterval(() => {
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
    }, 1000); // 1초마다 전송

    return () => clearInterval(intervalId); // 컴포넌트 언마운트 시 interval 제거
  }, []);

  useEffect(() => {
    // Spring Boot에서 날짜별 운동 시간 및 바른 자세 시간 가져오기
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
    <div className="squat-feedback">
      <h1>Squat Feedback</h1>
      <video ref={videoRef} autoPlay muted className="webcam-video" />
      <p>상체 각도: {angle}</p>
      <p>무릎 위치: {kneePosition}</p>
      <p>피드백: {feedback}</p>

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
  );
}

export default SquatFeedback;
