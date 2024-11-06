import React, { useEffect, useState, useRef } from 'react';
import './SquatFeedback.css';

function SquatFeedback() {
  const [feedback, setFeedback] = useState('');
  const [angle, setAngle] = useState(null);
  const [kneePosition, setKneePosition] = useState(null);
  const [dailyStats, setDailyStats] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [intervalTime, setIntervalTime] = useState(1000);
  const [isRunning, setIsRunning] = useState(false);
  const [detected, setDetected] = useState(false); // 감지 여부 상태 추가
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

          // 감지 여부에 따라 detected 상태 업데이트
          if (data.angle !== null && data.knee_position !== null) {
            setDetected(true); // 포즈 감지됨
          } else {
            setDetected(false); // 포즈 미감지
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
    console.log("분석이 종료되었습니다.");
  };

  // 날짜별 통계 가져오기
  const fetchDailyStats = () => {
    fetch(`http://localhost:8888/OspreyAI/api/squat/daily-stats?page=${currentPage}&size=5`)
      .then(response => response.json())
      .then(data => {
        console.log("Fetched data from API:", data);
        setDailyStats(data.feedbackList);               // 피드백 목록 설정
        setTotalPages(Math.ceil(data.totalCount / 6));  // 전체 수 기반 페이지 수 계산
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
      slider.style.background = `linear-gradient(to right, #007bff ${percentage}%, #ddd ${percentage}%)`;
    }
  };
  

  // intervalTime이 변경될 때마다 슬라이더 배경 업데이트
  useEffect(() => {
    updateSliderBackground();
  }, [intervalTime]);

  useEffect(() => {
    fetchDailyStats();
  }, [currentPage]); // 페이지가 변경될 때마다 통계 재가져오기

  return (
    <div className="squat-feedback-container">
      <div className="webcam-container">
        <video ref={videoRef} autoPlay muted className="webcam-video" />
      </div>

      <div className="feedback-panel">
        <h1 className="title">Squat Feedback</h1>
        <div className="feedback-info">
          <p>상체 각도: <span className={detected ? 'detected' : ''}>{angle !== null ? angle : 'N/A'}</span></p>
          <p>무릎 위치: <span className={detected ? 'detected' : ''}>{kneePosition !== null ? kneePosition : 'N/A'}</span></p>
          <p>피드백: <span className={detected ? 'detected' : ''}>{feedback}</span></p>
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
          <h2>Daily Stats</h2>
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
