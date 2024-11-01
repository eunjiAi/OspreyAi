from flask import Flask, request, jsonify
import mediapipe as mp
import cv2
import numpy as np
import base64
import datetime
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

app = Flask(__name__)

# MediaPipe 포즈 모델 초기화
mp_pose = mp.solutions.pose
pose = mp_pose.Pose()

# Oracle DB 연결 설정
DATABASE_URI = 'oracle+cx_oracle://c##ospreyai:123456@localhost:1521/XE'
engine = create_engine(DATABASE_URI)
Session = sessionmaker(bind=engine)
session = Session()

def analyze_pose(image):
    # 이미지 디코딩 및 분석
    decoded_data = base64.b64decode(image.split(",")[1])
    np_data = np.frombuffer(decoded_data, np.uint8)
    img = cv2.imdecode(np_data, cv2.IMREAD_COLOR)

    # MediaPipe 포즈 추출
    result = pose.process(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
    feedback = ""
    angle = None
    knee_position = None

    # 예시 알고리즘: 상체 각도와 무릎 위치 분석
    if result.pose_landmarks:
        landmarks = result.pose_landmarks.landmark
        # 상체 각도와 무릎 위치에 따른 피드백 제공
        # 임의의 알고리즘 예시: 상체 각도가 특정 값을 넘으면 피드백 변경
        angle = calculate_upper_body_angle(landmarks)  # 상체 각도 계산
        knee_position = calculate_knee_position(landmarks)  # 무릎 위치 계산

        if angle > 45:
            feedback = "상체를 더 숙이세요"
        elif knee_position < 0.3:
            feedback = "무릎을 앞으로 내세요"
        else:
            feedback = "자세가 좋습니다"
        
        # 하루 동안의 바른 자세 시간 기록
        update_daily_feedback(feedback)

    return {"angle": angle, "knee_position": knee_position, "feedback": feedback}

def calculate_upper_body_angle(landmarks):
    # 상체 각도 계산 로직
    return 45  # 예시 값

def calculate_knee_position(landmarks):
    # 무릎 위치 계산 로직
    return 0.5  # 예시 값

def update_daily_feedback(feedback):
    # 오늘 날짜 가져오기
    today = datetime.date.today()
    correct_duration = 1 if feedback == "자세가 좋습니다" else 0

    # DB에서 해당 날짜의 기록이 있는지 확인하고 없으면 새로 생성
    entry = session.query(SquatFeedback).filter_by(date=today).first()
    if entry:
        entry.duration += 1
        entry.correct_posture_duration += correct_duration
    else:
        new_entry = SquatFeedback(date=today, duration=1, correct_posture_duration=correct_duration)
        session.add(new_entry)
    session.commit()

@app.route('/squat-analysis', methods=['POST'])
def squat_analysis():
    data = request.get_json()
    frame = data.get('frame')
    result = analyze_pose(frame)

    return jsonify(result)

if __name__ == '__main__':
    app.run(port=5000)
