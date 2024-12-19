from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import logging
import base64
import numpy as np
import cv2
import mediapipe as mp
from sqlalchemy import create_engine, Column, Integer, String, Date, Sequence
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
import datetime
import uuid as uuid_lib

# 로그 설정
logging.basicConfig(filename='app_error.log', level=logging.DEBUG, 
                    format='%(asctime)s %(levelname)s %(message)s')

app = Flask(__name__)
CORS(app)

# MediaPipe Holistic 초기화
mp_holistic = mp.solutions.holistic
holistic = mp_holistic.Holistic()

# 데이터베이스 연결 설정
DATABASE_URI = 'oracle+cx_oracle://c##ospreyai:123456@localhost:1521/XE'
engine = create_engine(DATABASE_URI)
Session = sessionmaker(bind=engine)
session = Session()

# 모델 정의
Base = declarative_base()

# 모델 정의
class SquatFeedback(Base):
    __tablename__ = 'SQUATFEEDBACK'
    squat_id = Column(Integer, Sequence('squat_id_seq', start=1, increment=1), primary_key=True)  # SQUAT_ID는 시퀀스로 자동 생성
    uuid = Column(String, nullable=False)  # UUID로 사용자 식별
    total_attempts = Column(Integer, nullable=False)
    correct_count = Column(Integer, nullable=False)
    squat_date = Column(Date, nullable=False)

# 현재 자세 상태 추적 변수
current_posture = "stand"  # 기본값은 stand로 설정
completed_once = False  # "동작 완료" 메시지가 한 번 출력됐는지 여부

# Pose 분석 함수
def analyze_pose(image):
    global current_posture, completed_once
    try:
        # Base64 디코딩
        print("이미지 데이터 디코딩 중...")
        decoded_data = base64.b64decode(image.split(",")[1])
        np_data = np.frombuffer(decoded_data, np.uint8)
        img = cv2.imdecode(np_data, cv2.IMREAD_COLOR)
        
        if img is None:
            print("디코딩된 이미지가 None입니다.")
            logging.debug("디코딩된 이미지가 None입니다.")
            return {"angle": None, "knee_position": None, "feedback": "이미지 디코딩 오류"}

        # MediaPipe Holistic을 통한 포즈 추출
        print("MediaPipe를 통한 자세 분석 중...")
        result = holistic.process(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
        feedback = ""
        angle = None
        knee_position = None

        # 포즈 분석 결과 처리
        if result.pose_landmarks:
            print("포즈 랜드마크가 감지되었습니다.")
            logging.debug("포즈 랜드마크가 감지되었습니다.")
            landmarks = result.pose_landmarks.landmark
            angle = calculate_upper_body_angle(landmarks)
            knee_position = calculate_knee_position(landmarks)

            # 스쿼트 동작과 원상태(stand) 확인
            if angle < 60:  # 상체가 충분히 숙여지지 않으면 피드백 줌 
                if current_posture == "squat" and not completed_once:
                    feedback = "동작 완료"
                    update_daily_feedback("test_user", feedback=True)  # 바른 자세 카운트 증가
                    current_posture = "stand"  # 원상태로 전환
                    completed_once = True  # 완료 상태 기록
                else:
                    feedback = "상체를 더 숙이세요"
                    update_daily_feedback("test_user", feedback=False)  # 잘못된 자세
                
            elif knee_position < -0.1:  # 무릎이 발목보다 충분히 앞으로 나왔는지 확인
                if current_posture == "squat" and not completed_once:
                    feedback = "동작 완료"
                    update_daily_feedback("test_user", feedback=True)  # 바른 자세 카운트 증가
                    current_posture = "stand"  # 원상태로 전환
                    completed_once = True  # 완료 상태 기록
                else:
                    feedback = "무릎을 앞으로 내세요"
                    update_daily_feedback("test_user", feedback=False)  # 잘못된 자세
                
            else:
                if current_posture == "stand":
                    feedback = "바른 자세입니다"
                    current_posture = "squat"  # 스쿼트 상태로 전환
                    completed_once = False  # 바른 자세가 되면 완료 상태 초기화
                else:
                    feedback = "바른 자세입니다"  # 스쿼트 상태 유지 중일 때

        else:
            print("포즈 랜드마크가 감지되지 않았습니다.")
            logging.debug("포즈 랜드마크가 감지되지 않았습니다.")
            feedback = "포즈가 감지되지 않았습니다"
            update_daily_feedback("test_user", feedback=False)  # 누락 방지: 실패 시에도 데이터 기록

        # 최종 결과 로그
        print("자세 분석이 완료되었습니다:", {"angle": angle, "knee_position": knee_position, "feedback": feedback})
        logging.debug(f"자세 분석 결과: angle={angle}, knee_position={knee_position}, feedback={feedback}")
        return {"angle": angle, "knee_position": knee_position, "feedback": feedback}
    except Exception as e:
        logging.error(f"자세 분석 오류: {e}")
        print(f"자세 분석 오류: {e}")
        return {"error": "자세 분석 실패"}

# 각도 계산 : 어깨, 엉덩이, 무릎 좌표를 사용해 상체 기울기 각도 계산함
def calculate_upper_body_angle(landmarks):
    shoulder = landmarks[mp_holistic.PoseLandmark.LEFT_SHOULDER]
    hip = landmarks[mp_holistic.PoseLandmark.LEFT_HIP]
    knee = landmarks[mp_holistic.PoseLandmark.LEFT_KNEE]
    
    # 벡터 계산
    shoulder_hip = np.array([hip.x - shoulder.x, hip.y - shoulder.y])
    hip_knee = np.array([knee.x - hip.x, knee.y - hip.y])

    # 각도 계산
    cosine_angle = np.dot(shoulder_hip, hip_knee) / (np.linalg.norm(shoulder_hip) * np.linalg.norm(hip_knee))
    angle = np.arccos(cosine_angle)
    return np.degrees(angle)

# 무릎과 발목 사이의 상대적 위치 계산함
def calculate_knee_position(landmarks):
    knee = landmarks[mp_holistic.PoseLandmark.LEFT_KNEE]
    foot = landmarks[mp_holistic.PoseLandmark.LEFT_ANKLE]
    return knee.x - foot.x

# 일일 피드백 업데이트 (카운트 방식)
import uuid as uuid_lib

import datetime

# 일일 피드백 업데이트 (카운트 방식)
def update_daily_feedback(uuid, feedback):
    try:
        # 오늘 날짜를 가져오되, 시간을 00:00:00으로 고정하여 날짜만 비교하도록 처리
        today = datetime.date.today()  # 오늘 날짜만 (시간은 제외)
        
        # 만약 시간이 00:00:00일 경우 날짜를 강제로 맞춰주기 위해 설정할 수 있습니다.
        today = datetime.datetime.combine(today, datetime.time.min).date()

        correct_increment = 1 if feedback else 0

        # Check if uuid already exists for today's date, otherwise insert a new entry
        entry = session.query(SquatFeedback).filter_by(uuid=uuid, squat_date=today).first()
        
        if entry:
            # 기존 데이터가 있으면 업데이트
            entry.total_attempts += 1
            entry.correct_count += correct_increment
        else:
            # 새로운 데이터를 삽입
            new_entry = SquatFeedback(
                uuid=uuid,  # 생성된 고유 uuid 사용
                total_attempts=1,
                correct_count=correct_increment,
                squat_date=today  # 날짜만 저장
            )
            session.add(new_entry)
        
        session.commit()
        print("일일 피드백이 데이터베이스에 업데이트되었습니다.")
        logging.debug("일일 피드백이 데이터베이스에 업데이트되었습니다.")
    except Exception as e:
        session.rollback()  # 오류 발생 시 세션 롤백
        logging.error(f"데이터베이스 업데이트 오류: {e}")
        print(f"데이터베이스 업데이트 오류: {e}")



@app.route('/squat-analysis', methods=['POST'])
def squat_analysis():
    print(f"받은 요청 메소드: {request.method}")
    logging.debug(f"받은 요청 메소드: {request.method}")

    data = request.get_json()
    frame = data.get('frame')
    
    # Now using test_user UUID directly
    uuid = 'test_user'  # Fixed UUID for the user, since it's already in MEMBER table

    if not uuid:
        return jsonify({"error": "UUID가 누락되었습니다."}), 400

    if frame:
        result = analyze_pose(frame)
        update_daily_feedback(uuid, result.get('feedback') == "동작 완료")  # Update the feedback in DB
        print("분석 결과 반환:", result)
        logging.debug(f"분석 결과 반환: {result}")
        return jsonify(result)
    else:
        print("프레임 데이터가 수신되지 않았습니다.")
        logging.debug("프레임 데이터가 수신되지 않았습니다.")
        return jsonify({"error": "프레임 데이터가 수신되지 않았습니다."}), 400


# Flask 서버 시작
if __name__ == '__main__':
    print("Flask 서버를 시작합니다...")
    logging.debug("Flask 서버를 시작합니다...")
    try:
        app.run(port=5000, debug=True)
    except Exception as e:
        logging.error(f"Flask 서버 시작 오류: {e}")
