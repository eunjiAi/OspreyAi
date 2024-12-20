-- test_user 추가
INSERT INTO Member (uuid, name, email, pw, phone_number, is_admin, face_id)
VALUES ('test_user', '테스트 사용자', 'test@example.com', 'adminpass', '01012345678', 0, NULL);

-- 추가적인 더미 데이터를 삽입합니다.
INSERT INTO Member (uuid, name, email, pw, phone_number, is_admin, face_id)
VALUES ('b62a18d1-56f2-4b71-b123-456cd789abc', '김철수', 'kimchulsoo@example.com', 'password123', '01098765432', 0, NULL);

INSERT INTO Member (uuid, name, email, pw, phone_number, is_admin, face_id)
VALUES ('1e1e9e5f-bde0-4231-92d1-973413b509dd', '박영희', 'parkyounghee@example.com', 'password123', '01056789012', 0, NULL);

INSERT INTO Member (uuid, name, email, pw, phone_number, is_admin, face_id)
VALUES ('2f2f2f6f-f9a1-452b-bc9d-512e564e3344', '이민수', 'leeminsu@example.com', 'password123', '01034567890', 0, NULL);


-----------------------------------------------------
-- test_user에 대한 스쿼트 피드백 추가
INSERT INTO Squatfeedback (squat_id, uuid, total_attempts, correct_count, squat_date)
VALUES (squat_id_seq.NEXTVAL, 'test_user', 5, 3, TO_DATE('2024-12-19', 'YYYY-MM-DD'));

-- 추가적인 유저들의 스쿼트 피드백 추가
INSERT INTO Squatfeedback (squat_id, uuid, total_attempts, correct_count, squat_date)
VALUES (squat_id_seq.NEXTVAL, 'b62a18d1-56f2-4b71-b123-456cd789abc', 10, 7, TO_DATE('2024-12-18', 'YYYY-MM-DD'));

INSERT INTO Squatfeedback (squat_id, uuid, total_attempts, correct_count, squat_date)
VALUES (squat_id_seq.NEXTVAL, '1e1e9e5f-bde0-4231-92d1-973413b509dd', 15, 10, TO_DATE('2024-12-19', 'YYYY-MM-DD'));

INSERT INTO Squatfeedback (squat_id, uuid, total_attempts, correct_count, squat_date)
VALUES (squat_id_seq.NEXTVAL, '2f2f2f6f-f9a1-452b-bc9d-512e564e3344', 7, 5, TO_DATE('2024-12-19', 'YYYY-MM-DD'));
