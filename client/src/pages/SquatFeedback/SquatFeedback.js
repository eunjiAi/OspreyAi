import React, { useEffect, useState } from 'react';
import './SquatFeedback.css';

function SquatFeedback() {
  const [feedback, setFeedback] = useState(''); // 자세 교정 메시지
  const [angle, setAngle] = useState(null); // 상체 각도
  const [kneePosition, setKneePosition] = useState(null); // 무릎 위치

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

  return (
    <div className="squat-feedback">
      <h1>Squat Feedback</h1>
      <p>상체 각도: {angle}</p>
      <p>무릎 위치: {kneePosition}</p>
      <p>피드백: {feedback}</p>
    </div>
  );
}

export default SquatFeedback;
