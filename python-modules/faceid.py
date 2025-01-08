'''
[face_recognition 라이브러리 사용: 딥러닝모델(Dlib)의 사전 학습된 얼굴 인코더랑 비교 알고리즘 활용함]
얼굴 감지 및 인코딩:
image = face_recognition.load_image_file(img_path)
encodings = face_recognition.face_encodings(image)

얼굴 비교:
results = face_recognition.compare_faces(known_faces, encoding, tolerance=tolerance)
'''
# USAGE
# pip install deepface

from flask import Flask, request, jsonify
from io import BytesIO
from PIL import Image
import base64
from datetime import datetime
from flask_cors import CORS  # CORS 모듈
import os
import cv2
import time
import face_recognition
from sqlalchemy import create_engine, Column, String, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from deepface import DeepFace


app = Flask(__name__)

# CORS 활성화, 특정 메서드랑 헤더 허용
CORS(app, methods=["GET", "POST", "OPTIONS"], supports_credentials=True)

USER_HOME_PATH = os.path.expanduser("~")
print(f"USER_HOME_PATH: {USER_HOME_PATH}")

# "OneDrive" -> "바탕 화면" 경로로 연결
desktop_path = os.path.join(USER_HOME_PATH, "OneDrive", "바탕 화면")
print(f"Desktop path: {desktop_path}")

# "FaceID_Images" 폴더 경로
SAVE_DIR = os.path.join(desktop_path, "FaceID_Images")

# "FaceID_Images" 폴더가 없다면 생성
if not os.path.exists(SAVE_DIR):
    os.makedirs(SAVE_DIR)
    print(f"Created folder: {SAVE_DIR}")
else:
    print(f"Folder already exists: {SAVE_DIR}")

# 이미지 저장 폴더 생성 확인
print(f"Saving images to: {SAVE_DIR}")

# 데이터베이스 설정
DATABASE_URI = 'oracle+cx_oracle://c##fp3team:1234@ktj0514.synology.me:1521/XE'
engine = create_engine(DATABASE_URI, echo=True)
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

# Member 테이블 정의
class Member(Base):
    __tablename__ = "MEMBER"
    __table_args__ = {"schema": "C##FP3TEAM"}
    
    uuid = Column("UUID", String, primary_key=True, nullable=False)
    member_id = Column("MEMBERID", String, nullable=False)
    face_id = Column("FACE_ID", String, nullable=True)
    pw = Column("PW", String, nullable=False)


# 데이터베이스 테이블 생성
Base.metadata.create_all(bind=engine)

@app.route('/register-faceid', methods=['POST'])
def register_faceid():
    print("요청 받음")

    try:
        data = request.json
        image_data = data.get('image')
        user_uuid = data.get('uuid')  # 로그인한 사용자 UUID
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')  # 타임스탬프 생성

        if not image_data or not user_uuid:
            print("이미지 데이터 또는 UUID가 누락되었습니다.")
            return jsonify({"message": "이미지 데이터 또는 UUID가 누락되었습니다."}), 400

        # 얼굴 인식 여부 확인
        if image_data == "face_not_detected":
            print("얼굴이 인식되지 않았습니다.")
            return jsonify({"message": "얼굴이 인식되지 않았습니다."}), 400

        # 이미지 데이터 디코딩
        image_data = image_data.split(",")[1]  # base64 이미지에서 'data:image/jpeg;base64,' 부분 제거
        img_bytes = base64.b64decode(image_data)

        # 이미지 저장 경로
        filename = f"{user_uuid}_{timestamp}.jpg"  # UUID와 타임스탬프 기반 파일명
        image_path = os.path.join(SAVE_DIR, filename)

        # 이미지 저장
        image = Image.open(BytesIO(img_bytes))
        image.save(image_path)

        # 데이터베이스에 저장
        with SessionLocal() as db:
            # 사용자 조회
            user = db.query(Member).filter_by(uuid=user_uuid.strip()).first()
            if not user:
                print(f"사용자를 찾을 수 없습니다. UUID: {user_uuid}")
                return jsonify({"message": "사용자를 찾을 수 없습니다."}), 404

            # 기존 face_id 이미지 삭제 및 DB 갱신
            if user.face_id:
                old_image_path = os.path.join(SAVE_DIR, user.face_id)
                if os.path.exists(old_image_path):
                    os.remove(old_image_path)  # 기존 이미지 파일 삭제

            user.face_id = filename  # face_id 컬럼에 새로운 이미지 파일명 저장
            db.commit()

            print(f"Image path saved to DB: {filename}")

        return jsonify({"message": f"이미지 저장 성공: {image_path}"}), 200

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"message": "이미지 등록 실패!"}), 500




@app.route('/delete-faceid', methods=['POST'])
def delete_faceid():
    try:
        data = request.json
        user_uuid = data.get('uuid')

        if not user_uuid:
            return jsonify({"message": "UUID가 누락되었습니다."}), 400

        # 데이터베이스에서 사용자 조회
        with SessionLocal() as db:
            user = db.query(Member).filter_by(uuid=user_uuid.strip()).first()
            if not user:
                return jsonify({"message": "사용자를 찾을 수 없습니다."}), 404

            # 기존 face_id 이미지 삭제
            if user.face_id:
                old_image_path = os.path.join(SAVE_DIR, user.face_id)
                if os.path.exists(old_image_path):
                    os.remove(old_image_path)  # 이미지 파일 삭제

                # DB에서 face_id 삭제
                user.face_id = None
                db.commit()

        return jsonify({"message": "이미지 삭제 완료!"}), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"message": "이미지 삭제 실패!"}), 500



def compare_faces(image_data, model_name="Facenet", threshold=0.4):   # DeepFace모델 및 파라미터 조정: 모델네임 변경가능(ArcFace, Facenet), 아크페이스보다 페이스넷이 더 빠름 / 
    # 기본값: 0.6 => 더 정교하게 비교하려고 0.4로 변경

    try:
        # base64로 전달된 이미지를 디코딩해서 임시 파일로 저장
        img_bytes = base64.b64decode(image_data.split(",")[1])
        input_image_path = os.path.join(SAVE_DIR, "temp_input_image.jpg")
        with open(input_image_path, "wb") as temp_file:
            temp_file.write(img_bytes)

        # 저장된 얼굴 이미지들과 비교
        for filename in os.listdir(SAVE_DIR):
            if filename.endswith(".jpg") and filename != "temp_input_image.jpg":
                stored_image_path = os.path.join(SAVE_DIR, filename)

                # DeepFace 사용=> 얼굴 비교
                try:
                    result = DeepFace.verify(
                        img1_path=input_image_path,
                        img2_path=stored_image_path,
                        model_name=model_name
                    )

                    # 결과 분석
                    distance = result["distance"]
                    verified = result["verified"]

                    print(f"Comparing with {filename}: Distance = {distance}, Verified = {verified}")

                    if verified and distance < threshold:
                        print(f"Matched with {filename}")
                        return filename  # 매칭된 이미지 파일 이름 반환

                except Exception as e:
                    print(f"DeepFace error comparing with {filename}: {e}")
                    continue

        print("No matching faces found.")
        return None

    except Exception as e:
        print(f"Error during face comparison with DeepFace: {e}")
        return None
    

@app.route('/compare-faceid', methods=['POST'])
def compare_faceid():
    try:
        data = request.json
        if not data or "image" not in data:
            return jsonify({"message": "이미지 데이터가 누락되었습니다."}), 400
        
        start_time = time.time()
        matched_filename = None

        while time.time() - start_time < 3:
            matched_filename = compare_faces(data["image"])  # 얼굴 비교 함수 호출
            if matched_filename:
                # 파일명에서 UUID 추출
                user_uuid = matched_filename.split('_')[0] if matched_filename else None

                if user_uuid:
                      # UUID에 해당하는 사용자 정보 조회
                    with SessionLocal() as db:
                        # 트랜잭션 없이 데이터 조회
                        user = db.query(Member).filter_by(uuid=user_uuid).first()
                        if not user:
                            return jsonify({"message": "사용자를 찾을 수 없습니다."}), 404

                        # ID와 비밀번호 출력
                        print(f"User ID: {user.member_id}, Password: {user.pw}")  # 로그로 출력

                        # React로 UUID와 memberId를 보내는 부분
                        return jsonify({
                            "uuid": user.uuid,
                            "memberId": user.member_id  # React로 memberId 전송
                        }), 200

            time.sleep(1)

        return jsonify({"message": "인증 실패: 얼굴을 찾을 수 없습니다."}), 400

    except Exception as e:
        print(f"Error in compare_faceid: {str(e)}")  
        return jsonify({"message": "서버 오류 발생: " + str(e)}), 500



    

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
