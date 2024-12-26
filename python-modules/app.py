from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import logging
import base64
import numpy as np
import cv2
import mediapipe as mp
from sqlalchemy import create_engine, Column, Integer, String, Date, Sequence
from sqlalchemy.orm import sessionmaker, scoped_session
from sqlalchemy.ext.declarative import declarative_base
import datetime
from pytz import timezone
import jwt  # PyJWT 라이브러리 : pip install PyJWT

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
session_factory = sessionmaker(bind=engine)
Session = scoped_session(session_factory)

# 모델 정의
Base = declarative_base()

class SquatFeedback(Base):
    __tablename__ = 'SQUATFEEDBACK'
    squat_id = Column(Integer, Sequence('squat_id_seq', start=1, increment=1), primary_key=True)
    uuid = Column(String, nullable=False)
    total_attempts = Column(Integer, nullable=False)
    correct_count = Column(Integer, nullable=False)
    squat_date = Column(Date, nullable=False)

# 현재 자세 상태 추적 변수
current_posture = "stand"
completed_once = False

# JWT 토큰에서 UUID 추출
def extract_uuid_from_token(token):
    try:
        payload = jwt.decode(token, options={"verify_signature": False})
        return payload.get("sub")  # `sub` 필드에 UUID 저장되어 있다고 가정
    except Exception as e:
        logging.error(f"JWT 디코딩 오류: {e}")
        return None

# Pose 분석 함수
def analyze_pose(image):
    global current_posture, completed_once
    try:
        decoded_data = base64.b64decode(image.split(",")[1])
        np_data = np.frombuffer(decoded_data, np.uint8)
        img = cv2.imdecode(np_data, cv2.IMREAD_COLOR)
        
        if img is None:
            logging.debug("디코딩된 이미지가 None입니다.")
            return {"angle": None, "knee_position": None, "feedback": "이미지 디코딩 오류"}

        result = holistic.process(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
        feedback = ""
        angle = None
        knee_position = None

        if result.pose_landmarks:
            landmarks = result.pose_landmarks.landmark
            angle = calculate_upper_body_angle(landmarks)
            knee_position = calculate_knee_position(landmarks)

            if angle < 60:
                if current_posture == "squat" and not completed_once:
                    feedback = "동작 완료"
                    current_posture = "stand"
                    completed_once = True
                else:
                    feedback = "상체를 더 숙이세요"
            elif knee_position < -0.1:
                if current_posture == "squat" and not completed_once:
                    feedback = "동작 완료"
                    current_posture = "stand"
                    completed_once = True
                else:
                    feedback = "무릎을 앞으로 내세요"
            else:
                if current_posture == "stand":
                    feedback = "바른 자세입니다"
                    current_posture = "squat"
                    completed_once = False
                else:
                    feedback = "바른 자세입니다"
        else:
            feedback = "포즈가 감지되지 않았습니다"

        return {"angle": angle, "knee_position": knee_position, "feedback": feedback}
    except Exception as e:
        logging.error(f"자세 분석 오류: {e}")
        return {"error": "자세 분석 실패"}

def calculate_upper_body_angle(landmarks):
    shoulder = landmarks[mp_holistic.PoseLandmark.LEFT_SHOULDER]
    hip = landmarks[mp_holistic.PoseLandmark.LEFT_HIP]
    knee = landmarks[mp_holistic.PoseLandmark.LEFT_KNEE]
    shoulder_hip = np.array([hip.x - shoulder.x, hip.y - shoulder.y])
    hip_knee = np.array([knee.x - hip.x, knee.y - hip.y])
    cosine_angle = np.dot(shoulder_hip, hip_knee) / (np.linalg.norm(shoulder_hip) * np.linalg.norm(hip_knee))
    angle = np.arccos(cosine_angle)
    return np.degrees(angle)

def calculate_knee_position(landmarks):
    knee = landmarks[mp_holistic.PoseLandmark.LEFT_KNEE]
    foot = landmarks[mp_holistic.PoseLandmark.LEFT_ANKLE]
    return knee.x - foot.x

def update_daily_feedback(uuid, feedback):
    session = Session()
    try:
        kst = timezone('Asia/Seoul')
        today = datetime.datetime.now(kst).date()
        correct_increment = 1 if feedback else 0

        entry = session.query(SquatFeedback).filter_by(uuid=uuid, squat_date=today).first()

        if entry:
            entry.total_attempts += 1
            entry.correct_count += correct_increment
        else:
            new_entry = SquatFeedback(
                uuid=uuid,
                total_attempts=1,
                correct_count=correct_increment,
                squat_date=today
            )
            session.add(new_entry)

        session.commit()
    except Exception as e:
        session.rollback()
        logging.error(f"데이터베이스 업데이트 오류: {e}")
    finally:
        session.close()

@app.route('/squat-analysis', methods=['POST'])
def squat_analysis():
    print("요청 메소드:", request.method)
    data = request.get_json()

    if not data or 'frame' not in data:
        print("프레임 데이터가 없습니다.")
        return jsonify({"feedback": "포즈가 감지되지 않았습니다"}), 400

    frame = data['frame']
    print("수신한 프레임 데이터 길이:", len(frame))

    try:
        result = analyze_pose(frame)
        print("분석 결과:", result)
        return jsonify(result)
    except Exception as e:
        print(f"분석 실패: {e}")
        return jsonify({"feedback": "분석 실패"}), 500


if __name__ == '__main__':
    app.run(port=5000, debug=True)
