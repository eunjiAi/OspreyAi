import React, { useEffect, useState } from 'react';
import './SquatFeedback.css';

function SquatFeedback() {
  const [feedback, setFeedback] = useState(''); // 자세 교정 메시지
  const [angle, setAngle] = useState(null); // 상체 각도
  const [kneePosition, setKneePosition] = useState(null); // 무릎 위치
  const [dailyStats, setDailyStats] = useState([]); // 날짜별 통계

  useEffect(() => {
    // Python 서버에서 실시간 데이터를 가져오기
    const fetchData = () => {
      fetch('http://localhost:5000/squat-analysis')
        .then(response => response.json())
        .then(data => {
          setAngle(data.angle);
          setKneePosition(data.knee_position);
          setFeedback(data.feedback);
        })
        .catch(error => console.error('Error fetching data:', error));
    };

    const intervalId = setInterval(fetchData, 1000); // 1초마다 데이터 가져오기
    return () => clearInterval(intervalId); // 컴포넌트 언마운트 시 interval 제거
  }, []);

  useEffect(() => {
    // Spring Boot에서 날짜별 운동 시간 및 바른 자세 시간 가져오기
    fetch('http://localhost:8888/OspreyAI/api/squat/daily-stats')
      .then(response => response.json())
      .then(data => setDailyStats(data))
      .catch(error => console.error('Error fetching daily stats:', error));
  }, []);

  return (
    <div className="squat-feedback">
      <h1>Squat Feedback</h1>
      <p>상체 각도: {angle}</p>
      <p>무릎 위치: {kneePosition}</p>
      <p>피드백: {feedback}</p>

      <h2>Daily Stats</h2>
      <ul>
        {dailyStats.map((stat, index) => (
          <li key={index}>
            날짜: {stat.date}, 총 운동 시간: {stat.duration}분, 바른 자세 시간: {stat.correctPostureDuration}분
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SquatFeedback;
