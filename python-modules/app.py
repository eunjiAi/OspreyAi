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
    print("모든 라이브러리가 성공적으로 임포트되었습니다.")
    logging.debug("모든 라이브러리가 성공적으로 임포트되었습니다.")
except ImportError as e:
    logging.error(f"라이브러리 임포트 오류: {e}")
    print(f"라이브러리 임포트 오류: {e}")
    sys.exit()

# MediaPipe 초기화
try:
    mp_pose = mp.solutions.pose
    pose = mp_pose.Pose()
    print("MediaPipe가 초기화되었습니다.")
    logging.debug("MediaPipe가 초기화되었습니다.")
except Exception as e:
    logging.error(f"MediaPipe 초기화 오류: {e}")
    print(f"MediaPipe 초기화 오류: {e}")
    sys.exit()

# 데이터베이스 연결 설정
try:
    print("데이터베이스에 연결 중...")
    DATABASE_URI = 'oracle+cx_oracle://c##ospreyai:123456@localhost:1521/XE'
    engine = create_engine(DATABASE_URI)
    Session = sessionmaker(bind=engine)
    session = Session()
    print("데이터베이스에 성공적으로 연결되었습니다.")
    logging.debug("데이터베이스에 성공적으로 연결되었습니다.")
except Exception as e:
    logging.error(f"데이터베이스 연결 오류: {e}")
    print(f"데이터베이스 연결 오류: {e}")
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
        
        print("자세 분석이 완료되었습니다:", {"angle": angle, "knee_position": knee_position, "feedback": feedback})
        logging.debug(f"자세 분석 결과: angle={angle}, knee_position={knee_position}, feedback={feedback}")
        return {"angle": angle, "knee_position": knee_position, "feedback": feedback}
    except Exception as e:
        logging.error(f"자세 분석 오류: {e}")
        print(f"자세 분석 오류: {e}")
        return {"error": "자세 분석 실패"}

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
        print("일일 피드백이 데이터베이스에 업데이트되었습니다.")
        logging.debug("일일 피드백이 데이터베이스에 업데이트되었습니다.")
    except Exception as e:
        logging.error(f"데이터베이스 업데이트 오류: {e}")
        print(f"데이터베이스 업데이트 오류: {e}")

@app.route('/squat-analysis', methods=['POST'])
def squat_analysis():
    print("받은 요청: /squat-analysis")
    logging.debug("받은 요청: /squat-analysis")

    data = request.get_json()
    frame = data.get('frame')
    if frame:
        result = analyze_pose(frame)
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
        print(f"Flask 서버 시작 오류: {e}")
