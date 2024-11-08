import React, { useEffect, useState, useRef } from 'react';
import './SquatFeedback.css';

function SquatFeedback() {
  const [feedback, setFeedback] = useState('시작 버튼을 눌러주세요!');
  const [angle, setAngle] = useState(null);
  const [kneePosition, setKneePosition] = useState(null);
  const [dailyStats, setDailyStats] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [intervalTime, setIntervalTime] = useState(1000);
  const [isRunning, setIsRunning] = useState(false);
  const [detected, setDetected] = useState(false);
  const videoRef = useRef(null);
  const intervalIdRef = useRef(null);

  // 웹캠 시작
  useEffect(() => {
    const startWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('웹캠 접근 오류:', error);
      }
    };
    startWebcam();
  }, []);

  // 데이터 전송 함수
  const fetchData = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const context = canvas.getContext('2d');
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL('image/png');

      console.log("Python 서버에 데이터 전송 중...");
      fetch('http://localhost:5000/squat-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ frame: imageData }),
        mode: 'cors'
      })
        .then(response => response.json())
        .then(data => {
          console.log("Python 서버로부터 응답 수신:", data);
          setAngle(data.angle !== null ? data.angle.toFixed(2) : null);
          setKneePosition(data.knee_position !== null ? data.knee_position.toFixed(2) : null);
          setFeedback(data.feedback);

          if (data.angle !== null && data.knee_position !== null) {
            setDetected(true);
          } else {
            setDetected(false);
          }
        })
        .catch(error => console.error('피드백 가져오기 오류:', error));
    }
  };

  // 분석 시작
  const startAnalysis = () => {
    setIsRunning(true);
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
    }
    intervalIdRef.current = setInterval(fetchData, intervalTime);
    console.log("분석이 시작되었습니다.");
  };

  // 분석 종료
  const stopAnalysis = () => {
    setIsRunning(false);
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
    }
    setFeedback('시작 버튼을 눌러주세요!');
    console.log("분석이 종료되었습니다.");
  };

  // 날짜별 통계 가져오기
  const fetchDailyStats = () => {
    fetch(`http://localhost:8888/OspreyAI/api/squat/daily-stats?page=${currentPage}&size=5`)
      .then(response => response.json())
      .then(data => {
        console.log("Fetched data from API:", data);
        setDailyStats(data.feedbackList);
        setTotalPages(Math.ceil(data.totalCount / 6));
      })
      .catch(error => {
        console.error('Error fetching daily stats:', error);
        setDailyStats([]);
      });
  };

  // 슬라이더 배경 업데이트 함수
  const updateSliderBackground = () => {
    const slider = document.querySelector('.slider');
    if (slider) {
      const percentage = ((intervalTime / 1000 - 1) / 9) * 100;
      slider.style.background = `linear-gradient(to right, #4a90e2 ${percentage}%, #ddd ${percentage}%)`;
    }
  };

  useEffect(() => {
    updateSliderBackground();
  }, [intervalTime]);

  useEffect(() => {
    fetchDailyStats();
  }, [currentPage]);

  const getFeedbackClass = (feedback) => {
    switch (feedback) {
      case '시작 버튼을 눌러주세요!':
        return 'start-message';
      case '포즈가 감지되지 않았습니다':
        return 'pose-not-detected';
      case '상체를 더 숙이세요':
        return 'lean-forward';
      case '무릎을 앞으로 내세요':
        return 'move-knees';
      case '바른 자세입니다':
        return 'correct-posture';
      default:
        return '';
    }
  };

  return (
    <div className="squat-feedback-container">
      <div className="webcam-container">
        <p className="webcam-message">전신을 보여주세요!</p>
        <video ref={videoRef} autoPlay muted className="webcam-video" />
      </div>

      <div className="feedback-panel">
        <h1 className="title">스쿼트 피드백</h1>
        <div className="feedback-info">
          <p className={`feedback-text ${getFeedbackClass(feedback)}`}>{feedback}</p>
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
          <button onClick={startAnalysis} disabled={isRunning} className={`control-button start ${isRunning ? 'active' : ''}`}>시작</button>
          <button onClick={stopAnalysis} disabled={!isRunning} className={`control-button stop ${!isRunning ? 'disabled' : 'active'}`}>종료</button>
        </div>

        <div className="daily-stats">
          <h2>일일 통계</h2>
          <ul>
            {Array.isArray(dailyStats) && dailyStats.length > 0 ? (
              dailyStats.map((stat, index) => (
                <li key={index}>
                  <span className="date">날짜: {stat.date}</span>
                  <span className="count">바른 자세 횟수: {stat.correctPostureCount}</span>
                </li>
              ))
            ) : (
              <p>데이터가 없습니다</p>
            )}
          </ul>

          <div className="pagination">
            <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))} disabled={currentPage === 0}>이전</button>
            <span>페이지 {currentPage + 1} / {totalPages}</span>
            <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages - 1))} disabled={currentPage === totalPages - 1}>다음</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SquatFeedback;
