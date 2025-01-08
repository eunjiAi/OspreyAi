'''
[MediaPipe라이브러리의 Holistic cnn기반 딥러닝 모델 사용: 관절 감지]
MediaPipe Holistic 초기화:
mp_holistic = mp.solutions.holistic
holistic = mp_holistic.Holistic()

포즈 랜드마크 추출:
result = holistic.process(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
if not result.pose_landmarks or len(result.pose_landmarks.landmark) < 33:
    logging.debug("포즈 랜드마크가 없습니다.")
    return {"angle": None, "knee_position": None, "feedback": "포즈가 감지되지 않았습니다"}
'''

# USAGE
# - - - - - - - 250106
# conda install -c conda-forge dlib
# pip install Flask Flask-Cors sqlalchemy pillow numpy opencv-python mediapipe pytz cx_Oracle jwt
# pip install PyJWT
# pip install opencv-python face_recognition

# - - - - - - - 250107
# pip install cffi
# pip install bcrypt


from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import logging
import base64
import numpy as np
import cv2
import mediapipe as mp
from sqlalchemy import create_engine, Column, Integer, String, Date, Sequence, ForeignKey
from sqlalchemy.orm import sessionmaker, scoped_session, relationship
from sqlalchemy.ext.declarative import declarative_base
import datetime
from pytz import timezone
import jwt
from sqlalchemy import text


# 에러, 디버깅 정보 로그 파일에 저장
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

class Member(Base):
    __tablename__ = 'MEMBER'
    uuid = Column(String, primary_key=True)
    name = Column(String)
    nickname = Column(String)
    memberid = Column(String)
    pw = Column(String)
    phone_number = Column(String)
    gender = Column(String)
    admin_yn = Column(String)
    enroll_date = Column(Date)
    lastmodified = Column(Date)
    google = Column(String)
    naver = Column(String)
    kakao = Column(String)
    login_ok = Column(String)
    face_vector = Column(String)
    face_id = Column(String)
    email = Column(String)

class SquatFeedback(Base):
    __tablename__ = 'SQUATFEEDBACK'
    squat_id = Column(Integer, Sequence('squat_id_seq', start=1, increment=1), primary_key=True)
    uuid = Column(String, ForeignKey('MEMBER.uuid'), nullable=False)  # 외래키로 연결
    total_attempts = Column(Integer, nullable=False)
    correct_count = Column(Integer, nullable=False)
    squat_date = Column(Date, nullable=False)
    name = Column(String, nullable=False) 

    member = relationship("Member", backref="squat_feedback")  # Member 테이블과의 관계 정의

# 현재 자세 상태 추적 변수
current_posture = "stand"
completed_once = False

# JWT 토큰에서 UUID와 이름 추출
def extract_uuid_and_name_from_token(token):
    try:
        payload = jwt.decode(token, options={"verify_signature": False})
        print(f"Decoded JWT payload: {payload}")  # 전체 페이로드 출력 (디버깅용)

        uuid = payload.get("uuid") 
        if not uuid:
            uuid = payload.get("sub")  # `sub`에 이메일이 들어갈 경우

        name = payload.get("name")  # 이메일을 `name`으로 처리

        # 만약 uuid가 없으면 에러 처리
        if not uuid:
            raise ValueError("UUID를 찾을 수 없습니다.")

        print(f"추출된 UUID: {uuid}, 이름: {name}")
        return uuid, name
    except Exception as e:
        logging.error(f"JWT 디코딩 오류: {e}")
        return None, None

# 사용자 UUID를 MEMBER 테이블에 삽입함
def insert_uuid_into_member(uuid, name):
    session = Session()
    try:
        # MEMBER 테이블에 uuid와 name을 삽입
        if not session.query(Member).filter_by(uuid=uuid).first():  # 이미 존재하지 않으면 삽입
            new_member = Member(uuid=uuid, name=name)
            session.add(new_member)
            session.commit()  
            print(f"UUID '{uuid}'와 이름 '{name}'을 MEMBER 테이블에 성공적으로 삽입했습니다.")
    except Exception as e:
        session.rollback()
        print(f"UUID 삽입 실패: {e}")
    finally:
        session.close()

# 데이터베이스 연결 확인
def check_db_connection():
    try:
        # 세션을 통해 데이터베이스 연결 테스트
        session = Session()
        session.execute(text('SELECT 1 FROM dual'))  # Oracle dual 테이블 사용
        session.close()
        print("디비 연결 완료")
    except Exception as e:
        print(f"디비 연결 실패: {e}")
        logging.error(f"디코딩 중 오류 발생: {e}")
        sys.exit(1)

# JWT에서 UUID와 이름을 추출하고, DB(MEMBER 테이블)에 삽입함
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
            # 로그인된 사용자 UUID를 MEMBER 테이블에 삽입
            insert_uuid_into_member(uuid, name)  # uuid 변수 사용
            return jsonify({"uuid": uuid, "name": name}), 200
        else:
            return jsonify({"error": "JWT 토큰에서 UUID 또는 이름을 가져올 수 없습니다."}), 400
    except Exception as e:
        logging.error(f"JWT 디코딩 중 오류 발생: {e}")
        return jsonify({"error": "JWT 디코딩 중 오류 발생"}), 500


# Pose 분석 및 피드백 제공
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


# 상체 각도 계산
def calculate_upper_body_angle(landmarks):
    shoulder = landmarks[mp_holistic.PoseLandmark.LEFT_SHOULDER]
    hip = landmarks[mp_holistic.PoseLandmark.LEFT_HIP]
    knee = landmarks[mp_holistic.PoseLandmark.LEFT_KNEE]
    shoulder_hip = np.array([hip.x - shoulder.x, hip.y - shoulder.y])
    hip_knee = np.array([knee.x - hip.x, knee.y - hip.y])
    cosine_angle = np.dot(shoulder_hip, hip_knee) / (np.linalg.norm(shoulder_hip) * np.linalg.norm(hip_knee))
    angle = np.arccos(cosine_angle)
    return np.degrees(angle)


# 무릎 위치 계산
def calculate_knee_position(landmarks):
    knee = landmarks[mp_holistic.PoseLandmark.LEFT_KNEE]
    foot = landmarks[mp_holistic.PoseLandmark.LEFT_ANKLE]
    return knee.x - foot.x


# DB 저장 및 업데이트
def update_daily_feedback(uuid, feedback_correct, name):  
    session = Session()
    try:
        # 한국 시간으로 현재 날짜 가져오기
        kst = timezone('Asia/Seoul')
        today = datetime.datetime.now(kst).date()
        correct_increment = 1 if feedback_correct else 0

        print(f"UUID: {uuid}, 피드백 상태: {feedback_correct}, 날짜: {today}, 이름: {name}")  

        # UUID와 날짜로 데이터베이스에서 기존 레코드 조회
        entry = session.query(SquatFeedback).filter_by(uuid=uuid, squat_date=today).first()

        if entry:
            # 기존 레코드가 있을 경우
            print(f"기존 데이터 발견: {entry}")  
            entry.total_attempts += 1               # 시도 횟수 증가
            entry.correct_count += correct_increment  # 바른 자세 횟수 증가 (동작 완료일 때만 증가)
            print(f"업데이트 후 entry: {entry}")  
        else:
            # 기존 레코드가 없을 경우 새로운 데이터 생성
            print("기존 데이터 없음. 새로운 데이터 생성 중...")
            new_entry = SquatFeedback(
                uuid=uuid,
                total_attempts=1,  # 첫 번째 시도
                correct_count=0,   # 첫 번째 시도에서는 바른 자세 횟수 0
                squat_date=today,
                name=name  
            )
            session.add(new_entry)
            print(f"새로운 레코드 추가됨: {new_entry}") 

        # 디비 업데이트 시도 로그
        print("데이터베이스 업데이트 커밋 중...") 
        session.commit()
        print("데이터베이스 업데이트 성공") 
    except Exception as e:
        session.rollback()
        print(f"데이터베이스 업데이트 실패: {e}") 
    finally:
        session.close()


# 이미지 프레임 받고, 자세 분석 및 피드백 반환
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

            # 피드백 저장
            update_daily_feedback(uuid, feedback_correct, name)  # name을 넘겨줌
        else:
            print("JWT에서 UUID를 추출할 수 없습니다.")

        return jsonify(result)
    except Exception as e:
        print(f"분석 실패: {e}")
        return jsonify({"feedback": "분석 실패"}), 500

if __name__ == '__main__':
    check_db_connection()  # 데이터베이스 연결 확인
    app.run(port=5000, debug=True)
