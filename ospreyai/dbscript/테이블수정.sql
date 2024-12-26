-- test_user 추가
INSERT INTO Member (uuid, name, nickname, email, pw, phone_number, gender, admin_yn, face_id, enroll_date, lastmodified, signtype, login_ok)
VALUES ('test_user', '테스트 사용자', 'test_user', 'test@example.com', 'adminpass', '01012345678', 'F', 'Y', NULL, SYSDATE, NULL, 'direct', 'Y');

-- 추가적인 더미 데이터
INSERT INTO Member (uuid, name, nickname, email, pw, phone_number, gender, admin_yn, face_id, enroll_date, lastmodified, signtype, login_ok)
VALUES ('uuid-1', 'Alice', 'Alice', 'alice@example.com', 'password123', '010-1234-5678', 'M', 'N', 'face-1', SYSDATE, NULL, 'direct', 'Y');

INSERT INTO Member (uuid, name, nickname, email, pw, phone_number, gender, admin_yn, face_id, enroll_date, lastmodified, signtype, login_ok)
VALUES ('uuid-2', 'Bob', 'Bob', 'bob@example.com', 'password123', '010-9876-5432', 'F', 'N', 'face-2', SYSDATE, SYSDATE, 'direct', 'Y');

INSERT INTO Member (uuid, name, nickname, email, pw, phone_number, gender, admin_yn, face_id, enroll_date, lastmodified, signtype, login_ok)
VALUES ('uuid-3', 'Charlie', 'Charlie', 'charlie@example.com', 'password123', '010-5678-1234', 'F', 'N', 'face-3', SYSDATE, NULL, 'direct', 'Y');

INSERT INTO Member (uuid, name, nickname, email, pw, phone_number, gender, admin_yn, face_id, enroll_date, lastmodified, signtype, login_ok)
VALUES ('uuid-4', 'Shayne', 'Shayne', 'smtt22@example.com', '$2a$10$qlpgw16FieOHTMVaMiQG6uwxsywy3SRLlhDbtE4ZQq8uSYql3SXBa', '010-0101-1234', 'M', 'Y', 'face-4', SYSDATE, NULL, 'direct', 'Y');


-- 공지사항 더미 데이터
INSERT INTO NOTICE (NOTICE_NO, NTITLE, NCONTENT, NWRITER, NCREATED_AT, OFILENAME, RFILENAME, NCOUNT)
VALUES (1, '신년 이벤트 안내', '2024년 새해를 맞이하여 특별 이벤트를 진행합니다.', '관리자', SYSDATE, 'event.jpg', 'event_resized.jpg', 15);

INSERT INTO NOTICE (NOTICE_NO, NTITLE, NCONTENT, NWRITER, NCREATED_AT, OFILENAME, RFILENAME, NCOUNT)
VALUES (2, '서비스 점검 공지', '서비스 점검이 2024년 1월 10일에 진행될 예정입니다.', '운영팀', SYSDATE - 5, NULL, NULL, 25);

INSERT INTO NOTICE (NOTICE_NO, NTITLE, NCONTENT, NWRITER, NCREATED_AT, OFILENAME, RFILENAME, NCOUNT)
VALUES (3, '새로운 기능 업데이트', '새롭게 추가된 기능을 소개합니다.', '개발팀', SYSDATE - 10, 'update.jpg', 'update_resized.jpg', 50);

INSERT INTO NOTICE (NOTICE_NO, NTITLE, NCONTENT, NWRITER, NCREATED_AT, OFILENAME, RFILENAME, NCOUNT)
VALUES (4, '긴급 보안 패치 공지', '보안 취약점을 해결하기 위한 긴급 패치를 적용합니다.', '보안팀', SYSDATE - 1, NULL, NULL, 100);
