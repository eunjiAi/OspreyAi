import os
import base64
import io
import json
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from PIL import Image
from sqlalchemy import create_engine, Column, String, Text
from sqlalchemy.orm import declarative_base, sessionmaker
from keras_facenet import FaceNet
from fastapi.middleware.cors import CORSMiddleware
import numpy as np 

# FastAPI 앱 생성
app = FastAPI()

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 모든 출처 허용
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 데이터베이스 연결 설정
DATABASE_URI = 'oracle+cx_oracle://c##fp3team:1234@ktj0514.synology.me:1521/XE'
engine = create_engine(DATABASE_URI, echo=True)
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

# FaceNet 모델 로드
embedder = FaceNet()
print("FaceNet 모델 로드 완료.")

# Member 테이블 정의
class Member(Base):
    __tablename__ = "MEMBER"
    __table_args__ = {"schema": "C##FP3TEAM"}
    uuid = Column("UUID", String, primary_key=True, nullable=False)
    face_vector = Column("FACE_VECTOR", Text, nullable=True)  # 얼굴 벡터 데이터 저장

# 요청 모델 정의
class FaceIdRequest(BaseModel):
    image: str  # Base64 이미지 데이터
    uuid: str   # 사용자 UUID

# 데이터베이스 테이블 생성
Base.metadata.create_all(bind=engine)

# 이미지 저장 디렉토리 설정
IMAGE_DIR = os.path.join(os.path.expanduser("~"), "Desktop", "face_images")
os.makedirs(IMAGE_DIR, exist_ok=True)

def preprocess_image(image: Image.Image) -> np.ndarray:
    """이미지를 FaceNet 모델에 맞게 전처리."""
    image = image.resize((160, 160))
    image_array = np.asarray(image) / 255.0  # 정규화
    return image_array

@app.post("/register-faceid")
async def register_faceid(request: FaceIdRequest):
    db = SessionLocal()
    try:
        print("1. Received UUID:", request.uuid)

        # 사용자 조회
        user = db.query(Member).filter_by(uuid=request.uuid.strip()).first()
        if not user:
            raise HTTPException(status_code=404, detail="사용자를 찾을 수 없습니다.")

        # Base64 이미지 디코딩
        try:
            print("2. Decoding Base64 image...")
            header, encoded = request.image.split(",", 1)
            image_binary = base64.b64decode(encoded)
            image = Image.open(io.BytesIO(image_binary)).convert("RGB")
        except Exception as e:
            print("Image decoding failed:", e)
            raise HTTPException(status_code=400, detail="Image decoding failed")

        # 얼굴 특징 추출
        try:
            print("3. Extracting face features...")
            preprocessed_image = preprocess_image(image)
            features = embedder.embeddings([preprocessed_image])[0]
            print("Extracted features:", features)
        except Exception as e:
            print("Feature extraction failed:", e)
            raise HTTPException(status_code=500, detail="Feature extraction failed")

        # 얼굴 벡터 저장
        user.face_vector = json.dumps(features.tolist())  # JSON 문자열로 저장
        db.commit()
        print("4. Face vector saved to database.")

        # 이미지 저장
        try:
            print("5. Saving image to desktop...")
            image_filename = f"{request.uuid.strip()}.jpg"
            image_path = os.path.join(IMAGE_DIR, image_filename)
            image.save(image_path, "JPEG")
            print("Image saved successfully:", image_path)
        except Exception as e:
            print("Image saving failed:", e)
            raise HTTPException(status_code=500, detail="Image saving failed")

        return {"message": "Face ID 등록 성공", "image_path": image_path, "face_vector": features.tolist()}
    except Exception as e:
        db.rollback()
        print("Face ID 등록 실패:", e)
        raise HTTPException(status_code=500, detail=f"Face ID 등록 실패: {str(e)}")
    finally:
        db.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5001)
