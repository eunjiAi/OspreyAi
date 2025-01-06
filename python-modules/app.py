# USAGE
# pip install Flask Flask-Cors SQLAlchemy cx_Oracle PyJWT pytz numpy opencv-python mediapipe

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
import jwt  
from sqlalchemy import text

# 로그 설정
logging.basicConfig(filename='app_error.log', level=logging.DEBUG, 
                    format='%(asctime)s %(levelname)s %(message)s')

app = Flask(__name__)
CORS(app)

# MediaPipe Holistic 초기화
mp_holistic = mp.solutions.holistic
holistic = mp_holistic.Holistic()

# 데이터베이스 연결 설정
DATABASE_URI = 'oracle+cx_oracle://c##fp3team:1234@ktj0514.synology.me:1521/XE'
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

# JWT 토큰에서 UUID와 이름 추출
def extract_uuid_and_name_from_token(token):
    try:
        payload = jwt.decode(token, options={"verify_signature": False})
        uuid = payload.get("sub")  # UUID
        name = payload.get("name")  # 사용자 이름
        print(f"Decoded JWT payload: {payload}")  # 디버깅용으로 전체 페이로드 출력
        return uuid, name
    except Exception as e:
        logging.error(f"JWT 디코딩 오류: {e}")
        return None, None

# 데이터베이스 연결 확인
def check_db_connection():
    try:
        # 세션을 통해 데이터베이스 연결 테스트
        session = Session()
        session.execute(text('SELECT 1 FROM dual'))  # Oracle에서 dual 테이블을 사용
        session.close()
        print("디비 연결 완료")
    except Exception as e:
        print(f"디비 연결 실패: {e}")
        logging.error(f"디비 연결 실패: {e}")
        sys.exit(1)


@app.route('/log-user', methods=['GET'])
def log_current_user():
    try:
        # Authorization 헤더에서 JWT 토큰 읽기
        auth_header = request.headers.get('Authorization', '')
        if not auth_header:
            return jsonify({"error": "Authorization 헤더가 없습니다."}), 400
        
        token = auth_header.split(' ')[1]

        # 토큰 디코딩
        uuid, name = extract_uuid_and_name_from_token(token)

        if uuid and name:
            print(f"현재 로그인된 사용자 UUID: {uuid}, 이름: {name}")
            return jsonify({"uuid": uuid, "name": name}), 200
        else:
            return jsonify({"error": "JWT 토큰에서 UUID 또는 이름을 가져올 수 없습니다."}), 400
    except Exception as e:
        logging.error(f"JWT 디코딩 중 오류 발생: {e}")
        return jsonify({"error": "JWT 디코딩 중 오류 발생"}), 500

# Pose 분석 
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

        if not result.pose_landmarks or len(result.pose_landmarks.landmark) < 33:
            logging.debug("포즈 랜드마크가 없습니다.")
            return {"angle": None, "knee_position": None, "feedback": "포즈가 감지되지 않았습니다"}

        landmarks = result.pose_landmarks.landmark
        angle = calculate_upper_body_angle(landmarks)
        knee_position = calculate_knee_position(landmarks)

        feedback = "분석 실패"
        if angle and knee_position:
            if angle < 60 and knee_position > -0.1:
                if current_posture == "squat" and not completed_once:
                    feedback = "동작 완료"
                    current_posture = "stand"
                    completed_once = True
                else:
                    feedback = "상체를 더 숙이세요"
            elif angle >= 60 and knee_position >= -0.1:
                if current_posture == "stand":
                    feedback = "바른 자세입니다"
                    current_posture = "squat"
                    completed_once = False
                else:
                    feedback = "바른 자세입니다"

        logging.info(f"Analyzed Pose -> Angle: {angle}, Knee Position: {knee_position}, Feedback: {feedback}")
        return {"angle": angle, "knee_position": knee_position, "feedback": feedback}
    except Exception as e:
        logging.error(f"자세 분석 오류: {e}")
        return {"angle": None, "knee_position": None, "feedback": "분석 실패"}


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


def update_daily_feedback(uuid, feedback_correct):
    session = Session()
    try:
        # 한국 시간으로 현재 날짜 가져오기
        kst = timezone('Asia/Seoul')
        today = datetime.datetime.now(kst).date()
        correct_increment = 1 if feedback_correct else 0

        logging.info(f"UUID: {uuid}, 피드백 상태: {feedback_correct}, 날짜: {today}")

        # UUID와 날짜로 데이터베이스에서 기존 레코드 조회
        entry = session.query(SquatFeedback).filter_by(uuid=uuid, squat_date=today).first()

        if entry:
            logging.info(f"기존 데이터 발견: {entry}")
            entry.total_attempts += 1                       # 총 시도 횟수 증가
            entry.correct_count += correct_increment        # 바른 자세 횟수 증가
            logging.info(f"업데이트 후 entry: {entry}")
        else:
            logging.info("기존 데이터 없음. 새로운 데이터 생성 중...")
            # 첫 번째 시도일 때, correct_count를 0으로 설정하여 레코드 추가
            new_entry = SquatFeedback(
                uuid=uuid,
                total_attempts=1,  # 첫 번째 시도
                correct_count=0,   # 첫 번째 시도에서는 바른 자세 카운트 0
                squat_date=today,
                name="Unknown"  # 사용자의 이름도 저장하거나 필요시 추가
            )
            session.add(new_entry)

        logging.info("데이터베이스 업데이트 커밋 중...")
        session.commit()
        logging.info("데이터베이스 업데이트 성공")
    except Exception as e:
        session.rollback()
        logging.error(f"데이터베이스 업데이트 실패: {e}")
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
        # 자세 분석 수행
        result = analyze_pose(frame)
        print("분석 결과:", result)

        # JWT에서 UUID와 이름 추출
        token = request.headers.get('Authorization', '').split(' ')[1]
        uuid, name = extract_uuid_and_name_from_token(token)

        if uuid:
            print(f"UUID: {uuid}, Name: {name}, 피드백 결과: {result.get('feedback')}")
            feedback_correct = result.get('feedback') == "동작 완료"
            logging.info(f"UUID: {uuid}, Name: {name}, 동작 완료 여부: {feedback_correct}")
            update_daily_feedback(uuid, feedback_correct)
        else:
            print("JWT에서 UUID를 추출할 수 없습니다.")

        return jsonify(result)
    except Exception as e:
        print(f"분석 실패: {e}")
        return jsonify({"feedback": "분석 실패"}), 500

if __name__ == '__main__':
    check_db_connection()  # 데이터베이스 연결 확인
    app.run(port=5000, debug=True)
