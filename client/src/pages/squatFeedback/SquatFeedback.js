import React, { useEffect, useState, useRef } from 'react';
import './SquatFeedback.css';

function SquatFeedback() {
  const [feedback, setFeedback] = useState('시작 버튼을 눌러주세요');
  const [angle, setAngle] = useState(null);
  const [kneePosition, setKneePosition] = useState(null);
  const [dailyStats, setDailyStats] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [intervalTime, setIntervalTime] = useState(100);
  const [isRunning, setIsRunning] = useState(false);
  const [detected, setDetected] = useState(false);
  const [loading, setLoading] = useState(false);           // 로딩 상태

  const [name, setName] = useState('');           // 사용자 이름 상태
  const videoRef = useRef(null);
  const intervalIdRef = useRef(null);

  // JWT 토큰에서 UUID와 이름 추출
  const getPayloadFromToken = (token) => {
    if (!token) return null;
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const decodedPayload = atob(base64);
      
      // UTF-8로 복원
      const utf8DecodedPayload = decodeURIComponent(
        Array.from(decodedPayload)
          .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, '0')}`)
          .join('')
      );
  
      return JSON.parse(utf8DecodedPayload); // JSON으로 파싱
    } catch (e) {
      console.error('JWT 디코딩 오류:', e);
      return null;
    }
  };  
  

  const getNameFromToken = () => {
    const token = localStorage.getItem('accessToken');
    const payload = getPayloadFromToken(token);
    return payload ? payload.name : '';       
  };

  // JWT 토큰 유효성 검사 및 갱신 함수
  const isTokenExpired = (token) => {
    if (!token) return true;
    const payload = getPayloadFromToken(token);
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  };

  const ensureValidToken = async () => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (!accessToken || isTokenExpired(accessToken)) {
      console.log('Access token expired, refreshing...');
      try {
        const response = await fetch('http://localhost:8888/reissue', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${refreshToken}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) throw new Error('Failed to refresh token');
        const data = await response.json();
        localStorage.setItem('accessToken', data.accessToken);
        return data.accessToken;
      } catch (error) {
        console.error('Token refresh failed:', error);
        alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
        window.location.href = '/';              // 홈 페이지로 리다이렉트
        throw error;
      }
    }
    return accessToken;
  };

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

    const token = localStorage.getItem('accessToken');                 // JWT 토큰 가져오기
    const payload = getPayloadFromToken(token);                        // JWT에서 payload 추출
    const fetchedName = payload ? payload.name : '알 수 없는 사용자';   // 이름 가져오기

    setName(fetchedName);       // React 상태에 설정
    console.log('Decoded user name:', fetchedName);                    // 디코딩된 이름 출력
  }, []);
    
    

  // 데이터 전송
  const fetchData = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const context = canvas.getContext('2d');
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL('image/png');
  
      console.log('Python 서버에 데이터 전송 중...');
      
      // 첫 번째 시도일 때 feedback 값을 'start'로 설정하여 서버에 전송
      const feedbackType = isRunning ? 'start' : 'continue';  // 'start'로 첫 번째 시도를 나타냄
      
      fetch('http://localhost:5000/squat-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,   // JWT 
        },
        body: JSON.stringify({ 
          frame: imageData,
          feedback: feedbackType,  // 첫 번째 시도 알리기
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log('서버 응답 데이터:', data);
  
          // 유효성 검사
          const angle = data.angle !== null && data.angle !== undefined ? data.angle.toFixed(2) : null;
          const kneePosition = data.knee_position !== null && data.knee_position !== undefined ? data.knee_position.toFixed(2) : null;
  
          setFeedback(data.feedback || '분석 실패');
          setAngle(angle);
          setKneePosition(kneePosition);
          setDetected(angle !== null && kneePosition !== null);
        })
        .catch((error) => {
          console.error('피드백 가져오기 오류:', error);
          setFeedback('서버 오류가 발생했습니다.');
        });
    }
  };
  
  
  

  // 분석 시작
  const startAnalysis = () => {
    setIsRunning(true);
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
    }
    intervalIdRef.current = setInterval(fetchData, intervalTime);
    console.log('분석이 시작되었습니다.');
  };

  // 분석 종료
  const stopAnalysis = () => {
    setIsRunning(false);
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
    }
    setFeedback('시작 버튼을 눌러주세요');
    console.log('분석이 종료되었습니다.');
  };

  // 날짜별 통계 가져오기
  const fetchDailyStats = async () => {
    setLoading(true); // 로딩 시작
    try {
      const validToken = await ensureValidToken();
      console.log('Current user name (daily stats):', name); // 현재 이름 출력
  
      const response = await fetch(
        `http://localhost:8888/api/squat/daily-stats?page=${currentPage}&size=5`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${validToken}`,
          },
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error fetching daily stats');
      }
  
      const data = await response.json();
      console.log('Fetched daily stats:', data);
  
      const formattedStats = data.feedbackList.map((stat) => ({
        ...stat,
        date: new Date(stat.date).toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        }),
      }));
  
      setDailyStats(formattedStats);
      setTotalPages(Math.ceil(data.totalCount / 5));
    } catch (error) {
      console.error('Error fetching daily stats:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false); // 로딩 종료
    }
  };
  

  

  // 슬라이더 배경 업데이트
  const updateSliderBackground = () => {
    const slider = document.querySelector('.slider');
    if (slider) {
      const percentage = ((intervalTime / 100 - 1) / 2) * 100; // 1~3초 기준
      slider.style.background = `linear-gradient(to right, #4a90e2 ${percentage}%, #ddd ${percentage}%)`;
    }
  };

  useEffect(() => {
    updateSliderBackground();
  }, [intervalTime]);



  useEffect(() => {
    console.log('Fetching daily stats...');
    fetchDailyStats()
      .then(() => {
        console.log('Daily stats fetched successfully:', dailyStats);
      })
      .catch((err) => {
        console.error('Failed to fetch daily stats:', err);
      });
  }, [currentPage]);
  

  const getFeedbackClass = (feedback) => {
    switch (feedback) {
      case '시작 버튼을 눌러주세요':
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
          <label>검사 간격 (초): {intervalTime / 100}초</label>
          <input
            type="range"
            min="1"
            max="3"
            value={intervalTime / 100}
            onChange={(e) => setIntervalTime(e.target.value * 100)}
            className="slider"
          />
          <button onClick={startAnalysis} disabled={isRunning} className={`control-button start ${isRunning ? 'active' : ''}`}>
            시작
          </button>
          <button onClick={stopAnalysis} disabled={!isRunning} className={`control-button stop ${!isRunning ? 'disabled' : 'active'}`}>
            종료
          </button>
        </div>

        <div className="daily-stats">
        <h2>{name || '사용자 이름 없음'} 님의 일일 운동 기록</h2>
          {loading ? (
            <p>로딩 중...</p>
          ) : (
            <ul>
              {Array.isArray(dailyStats) && dailyStats.length > 0 ? (
                dailyStats.map((stat, index) => (
                  <li key={index}>
                    <span className="date">날짜: {stat.date}</span>
                    <span className="count">바른 자세 횟수: {stat.correctCount}</span>
                  </li>
                ))
              ) : (
                <p>데이터가 없습니다</p>
              )}
            </ul>
          )}
          <div className="pagination">
            <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))} disabled={currentPage === 0}>
              이전
            </button>
            <span>
              페이지 {currentPage + 1} / {totalPages}
            </span>
            <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))} disabled={currentPage === totalPages - 1}>
              다음
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default SquatFeedback;
