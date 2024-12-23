-- test_user 추가
INSERT INTO Member (uuid, name, email, pw, phone_number, gender, admin_yn, face_id, enroll_date, lastmodified, signtype, login_ok)
VALUES ('test_user', '테스트 사용자', 'test@example.com', 'adminpass', '01012345678', 'F', 'Y', NULL, SYSDATE, NULL, 'direct', 'Y');

-- 추가적인 더미 데이터
INSERT INTO Member (uuid, name, email, pw, phone_number, gender, admin_yn, face_id, enroll_date, lastmodified, signtype, login_ok)
VALUES ('uuid-1', 'Alice', 'alice@example.com', 'password123', '010-1234-5678', 'M', 'N', 'face-1', SYSDATE, NULL, 'direct', 'Y');

INSERT INTO Member (uuid, name, email, pw, phone_number, gender, admin_yn, face_id, enroll_date, lastmodified, signtype, login_ok)
VALUES ('uuid-2', 'Bob', 'bob@example.com', 'password123', '010-9876-5432', 'F', 'N', 'face-2', SYSDATE, SYSDATE, 'direct', 'Y');

INSERT INTO Member (uuid, name, email, pw, phone_number, gender, admin_yn, face_id, enroll_date, lastmodified, signtype, login_ok)
VALUES ('uuid-3', 'Charlie', 'charlie@example.com', 'password123', '010-5678-1234', 'F', 'N', 'face-3', SYSDATE, NULL, 'direct', 'Y');

INSERT INTO Member (uuid, name, email, pw, phone_number, gender, admin_yn, face_id, enroll_date, lastmodified, signtype, login_ok)
VALUES ('uuid-4', 'Shayne', 'smtt22@example.com', '1234', '010-0101-1234', 'M', 'Y', 'face-4', SYSDATE, NULL, 'direct', 'Y');
