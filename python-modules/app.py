from flask import Flask, request, jsonify
import sys
import logging

# 로그 설정
logging.basicConfig(filename='app_error.log', level=logging.DEBUG, 
                    format='%(asctime)s %(levelname)s %(message)s')

app = Flask(__name__)

# 외부 라이브러리와 초기화 단계에서 발생할 수 있는 오류 방지 코드
try:
    import mediapipe as mp
    import cv2
    import numpy as np
    import base64
    import datetime
    from sqlalchemy import create_engine
    from sqlalchemy.orm import sessionmaker
    print("All libraries imported successfully.")
except ImportError as e:
    logging.error(f"Library import error: {e}")
    print(f"Library import error: {e}")
    sys.exit()

# MediaPipe 초기화
try:
    mp_pose = mp.solutions.pose
    pose = mp_pose.Pose()
    print("MediaPipe initialized.")
except Exception as e:
    logging.error(f"MediaPipe initialization error: {e}")
    print(f"MediaPipe initialization error: {e}")
    sys.exit()

# 데이터베이스 연결 설정
try:
    print("Connecting to database...")
    DATABASE_URI = 'oracle+cx_oracle://c##ospreyai:123456@localhost:1521/XE'
    engine = create_engine(DATABASE_URI)
    Session = sessionmaker(bind=engine)
    session = Session()
    print("Database connected successfully.")
except Exception as e:
    logging.error(f"Database connection error: {e}")
    print(f"Database connection error: {e}")
    sys.exit()

# Pose 분석 함수
def analyze_pose(image):
    try:
        decoded_data = base64.b64decode(image.split(",")[1])
        np_data = np.frombuffer(decoded_data, np.uint8)
        img = cv2.imdecode(np_data, cv2.IMREAD_COLOR)

        result = pose.process(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
        feedback = ""
        angle = None
        knee_position = None

        if result.pose_landmarks:
            landmarks = result.pose_landmarks.landmark
            angle = calculate_upper_body_angle(landmarks)
            knee_position = calculate_knee_position(landmarks)

            if angle > 45:
                feedback = "상체를 더 숙이세요"
            elif knee_position < 0.3:
                feedback = "무릎을 앞으로 내세요"
            else:
                feedback = "자세가 좋습니다"
            
            update_daily_feedback(feedback)
        
        return {"angle": angle, "knee_position": knee_position, "feedback": feedback}
    except Exception as e:
        logging.error(f"Pose analysis error: {e}")
        return {"error": "Pose analysis failed"}

# 각도 계산 (예시)
def calculate_upper_body_angle(landmarks):
    return 45  # 예시 값

# 무릎 위치 계산 (예시)
def calculate_knee_position(landmarks):
    return 0.5  # 예시 값

# 일일 피드백 업데이트
def update_daily_feedback(feedback):
    try:
        today = datetime.date.today()
        correct_duration = 1 if feedback == "자세가 좋습니다" else 0

        entry = session.query(SquatFeedback).filter_by(date=today).first()
        if entry:
            entry.duration += 1
            entry.correct_posture_duration += correct_duration
        else:
            new_entry = SquatFeedback(date=today, duration=1, correct_posture_duration=correct_duration)
            session.add(new_entry)
        session.commit()
    except Exception as e:
        logging.error(f"Database update error: {e}")

@app.route('/squat-analysis', methods=['POST'])
def squat_analysis():
    data = request.get_json()
    frame = data.get('frame')
    result = analyze_pose(frame)
    return jsonify(result)

# Flask 서버 시작
if __name__ == '__main__':
    print("Starting Flask server...")
    try:
        app.run(port=5000, debug=True)
    except Exception as e:
        logging.error(f"Flask server start error: {e}")
        print(f"Flask server start error: {e}")
