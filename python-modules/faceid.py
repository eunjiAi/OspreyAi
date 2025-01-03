import os
from flask import Flask, request, jsonify
from io import BytesIO
from PIL import Image
import base64

app = Flask(__name__)

# 바탕화면 경로
USER_DESKTOP_PATH = r"C:\Users\ict01-20\OneDrive\바탕 화면"
SAVE_DIR = os.path.join(USER_DESKTOP_PATH, "FaceID_Images")

# 이미지 저장을 위한 디렉토리 생성
if not os.path.exists(SAVE_DIR):
    os.makedirs(SAVE_DIR)

@app.route('/register-faceid', methods=['POST'])
def register_faceid():
    try:
        data = request.json
        image_data = data.get('image')
        filename = data.get('filename')

        if not image_data or not filename:
            return jsonify({"message": "이미지 데이터 또는 파일명이 누락되었습니다."}), 400

        # 이미지 데이터 디코딩
        image_data = image_data.split(",")[1]  # base64 이미지에서 'data:image/jpeg;base64,' 부분을 제거
        img_bytes = base64.b64decode(image_data)

        # 이미지 저장 경로
        image_path = os.path.join(SAVE_DIR, filename)

        # 이미지 저장
        image = Image.open(BytesIO(img_bytes))
        image.save(image_path)

        return jsonify({"message": f"이미지 저장 성공: {image_path}"}), 200

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"message": "이미지 등록 실패!"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
