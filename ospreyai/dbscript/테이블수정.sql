-- test_user 추가
INSERT INTO Member (uuid, name, email, pw, phone_number, is_admin, face_id)
VALUES ('test_user', '테스트 사용자', 'test@example.com', 'adminpass', '01012345678', 0, NULL);

-- 추가적인 더미 데이터
INSERT INTO Member (uuid, name, email, pw, phone_number, join_date, is_admin, face_id)
VALUES ('uuid-1', 'Alice', 'alice@example.com', 'password123', '010-1234-5678', SYSDATE, 0, 'face-1');

INSERT INTO Member (uuid, name, email, pw, phone_number, join_date, is_admin, face_id)
VALUES ('uuid-2', 'Bob', 'bob@example.com', 'password123', '010-9876-5432', SYSDATE, 0, 'face-2');

INSERT INTO Member (uuid, name, email, pw, phone_number, join_date, is_admin, face_id)
VALUES ('uuid-3', 'Charlie', 'charlie@example.com', 'password123', '010-5678-1234', SYSDATE, 0, 'face-3');


