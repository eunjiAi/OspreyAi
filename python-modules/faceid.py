from flask import Flask, request, jsonify
from io import BytesIO
from PIL import Image
import base64
from datetime import datetime
from flask_cors import CORS  # CORS 모듈
import os
from sqlalchemy import create_engine, Column, String, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

app = Flask(__name__)

# CORS를 활성화합니다.
CORS(app)

# 바탕화면 경로
USER_DESKTOP_PATH = r"C:\Users\ict01-20\OneDrive\바탕 화면"
SAVE_DIR = os.path.join(USER_DESKTOP_PATH, "FaceID_Images")

# 이미지 저장을 위한 디렉토리 생성
if not os.path.exists(SAVE_DIR):
    os.makedirs(SAVE_DIR)

# 데이터베이스 설정
DATABASE_URI = 'oracle+cx_oracle://c##fp3team:1234@ktj0514.synology.me:1521/XE'
engine = create_engine(DATABASE_URI, echo=True)
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

# Member 테이블 정의 (예시)
class Member(Base):
    __tablename__ = "MEMBER"
    __table_args__ = {"schema": "C##FP3TEAM"}
    uuid = Column("UUID", String, primary_key=True, nullable=False)
    face_id = Column("FACE_ID", String, nullable=True)  # face_id 컬럼 추가

# 데이터베이스 테이블 생성
Base.metadata.create_all(bind=engine)

@app.route('/register-faceid', methods=['POST'])
def register_faceid():
    print("요청을 받았습니다.")  # 요청이 들어오는지 확인하는 로그

    try:
        data = request.json
        image_data = data.get('image')
        user_uuid = data.get('uuid')  # 로그인한 사용자 UUID
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')  # 타임스탬프 생성

        if not image_data or not user_uuid:
            return jsonify({"message": "이미지 데이터 또는 UUID가 누락되었습니다."}), 400

        # 얼굴 인식 여부 확인
        if image_data == "face_not_detected":
            return jsonify({"message": "얼굴이 인식되지 않았습니다."}), 400

        # 이미지 데이터 디코딩
        image_data = image_data.split(",")[1]  # base64 이미지에서 'data:image/jpeg;base64,' 부분을 제거
        img_bytes = base64.b64decode(image_data)

        # 이미지 저장 경로
        filename = f"{user_uuid}_{timestamp}.jpg"  # UUID와 타임스탬프 기반 파일명
        image_path = os.path.join(SAVE_DIR, filename)

        # 이미지 저장
        image = Image.open(BytesIO(img_bytes))
        image.save(image_path)

        # 데이터베이스에 저장
        db = SessionLocal()
        try:
            # 사용자 조회
            user = db.query(Member).filter_by(uuid=user_uuid.strip()).first()
            if not user:
                return jsonify({"message": "사용자를 찾을 수 없습니다."}), 404

            # 기존 face_id 이미지 삭제 및 DB 갱신
            if user.face_id:
                old_image_path = os.path.join(SAVE_DIR, user.face_id)
                if os.path.exists(old_image_path):
                    os.remove(old_image_path)  # 기존 이미지 파일 삭제

            user.face_id = filename  # face_id 컬럼에 새로운 이미지 파일명 저장
            db.commit()

            print(f"Image path saved to DB: {filename}")
        except Exception as e:
            db.rollback()
            print(f"DB 저장 실패: {e}")
            return jsonify({"message": "이미지 파일명 저장 실패!"}), 500
        finally:
            db.close()

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
        db = SessionLocal()
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
    finally:
        db.close()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
