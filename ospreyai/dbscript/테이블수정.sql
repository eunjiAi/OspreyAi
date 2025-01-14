-- test_user 추가
INSERT INTO Member (uuid, name, nickname, memberid, pw, phone_number, gender, admin_yn, face_id, enroll_date, lastModified, google, naver, kakao, login_ok)
VALUES ('test_user', '테스트 사용자', 'test_user', 'test', '$2a$10$qlpgw16FieOHTMVaMiQG6uwxsywy3SRLlhDbtE4ZQq8uSYql3SXBa', '01012345678', 'F', 'Y', NULL, SYSDATE, NULL, NULL, NULL, NULL, 'Y');

-- 추가적인 더미 데이터
INSERT INTO Member (uuid, name, nickname, memberid, pw, phone_number, gender, admin_yn, face_id, enroll_date, lastModified, google, naver, kakao, login_ok)
VALUES ('uuid-1', 'Alice', 'Alice', 'alice', '$2a$10$qlpgw16FieOHTMVaMiQG6uwxsywy3SRLlhDbtE4ZQq8uSYql3SXBa', '010-1234-5678', 'M', 'N', 'face-1', SYSDATE, NULL, NULL, NULL, NULL, 'Y');

INSERT INTO Member (uuid, name, nickname, memberid, pw, phone_number, gender, admin_yn, face_id, enroll_date, lastModified, google, naver, kakao, login_ok)
VALUES ('uuid-2', 'Bob', 'Bob', 'bob', '$2a$10$qlpgw16FieOHTMVaMiQG6uwxsywy3SRLlhDbtE4ZQq8uSYql3SXBa', '010-9876-5432', 'F', 'N', 'face-2', SYSDATE, NULL, NULL, NULL, NULL, 'Y');

INSERT INTO Member (uuid, name, nickname, memberid, pw, phone_number, gender, admin_yn, face_id, enroll_date, lastModified, google, naver, kakao, login_ok)
VALUES ('uuid-3', 'Charlie', 'Charlie', 'charlie', '$2a$10$qlpgw16FieOHTMVaMiQG6uwxsywy3SRLlhDbtE4ZQq8uSYql3SXBa', '010-5678-1234', 'F', 'N', 'face-3', SYSDATE, NULL, NULL, NULL, NULL, 'Y');

INSERT INTO Member (uuid, name, nickname, memberid, pw, phone_number, gender, admin_yn, face_id, enroll_date, lastModified, google, naver, kakao, login_ok)
VALUES ('uuid-4', 'Shayne', 'Shayne', 'smtt22', '$2a$10$qlpgw16FieOHTMVaMiQG6uwxsywy3SRLlhDbtE4ZQq8uSYql3SXBa', '010-0101-1234', 'M', 'Y', 'face-4', SYSDATE, NULL, NULL, NULL, NULL, 'Y');

INSERT INTO MEMBER (
    UUID, NAME, NICKNAME, MEMBERID, PW, PHONE_NUMBER, GENDER, ADMIN_YN, ENROLL_DATE, LASTMODIFIED, GOOGLE, NAVER, KAKAO, LOGIN_OK, FACE_VECTOR, FACE_ID, EMAIL
) VALUES
('55b6c5e7-1234-5678-9012-abcdef123456', '홍길동', '길동', 'user001', '$2a$10$qlpgw16FieOHTMVaMiQG6uwxsywy3SRLlhDbtE4ZQq8uSYql3SXBa', '010-1234-5678', 'M', 'N', TO_DATE('25/01/01', 'YY/MM/DD'), TO_DATE('25/01/01', 'YY/MM/DD'), 'gil_dong@gmail.com', 'gil_dong@naver.com', 'gil_dong@kakao.com', 'Y', NULL, NULL, 'gil_dong@gmail.com');
INSERT INTO MEMBER (
    UUID, NAME, NICKNAME, MEMBERID, PW, PHONE_NUMBER, GENDER, ADMIN_YN, ENROLL_DATE, LASTMODIFIED, GOOGLE, NAVER, KAKAO, LOGIN_OK, FACE_VECTOR, FACE_ID, EMAIL
) VALUES
('77d6c5e7-2234-5678-9012-abcdef223457', '김철수', '철수', 'user002', '$2a$10$qlpgw16FieOHTMVaMiQG6uwxsywy3SRLlhDbtE4ZQq8uSYql3SXBa', '010-2345-6789', 'M', 'N', TO_DATE('25/01/02', 'YY/MM/DD'), TO_DATE('25/01/02', 'YY/MM/DD'), 'chul_su@gmail.com', 'chul_su@naver.com', 'chul_su@kakao.com', 'Y', NULL, NULL, 'chul_su@gmail.com');
INSERT INTO MEMBER (
    UUID, NAME, NICKNAME, MEMBERID, PW, PHONE_NUMBER, GENDER, ADMIN_YN, ENROLL_DATE, LASTMODIFIED, GOOGLE, NAVER, KAKAO, LOGIN_OK, FACE_VECTOR, FACE_ID, EMAIL
) VALUES
('99f7c5e7-3334-5678-9012-abcdef323458', '박영희', '영희', 'user003', '$2a$10$qlpgw16FieOHTMVaMiQG6uwxsywy3SRLlhDbtE4ZQq8uSYql3SXBa', '010-3456-7890', 'F', 'N', TO_DATE('25/01/03', 'YY/MM/DD'), TO_DATE('25/01/03', 'YY/MM/DD'), 'young_hee@gmail.com', 'young_hee@naver.com', 'young_hee@kakao.com', 'Y', NULL, NULL, 'young_hee@gmail.com');
INSERT INTO MEMBER (
    UUID, NAME, NICKNAME, MEMBERID, PW, PHONE_NUMBER, GENDER, ADMIN_YN, ENROLL_DATE, LASTMODIFIED, GOOGLE, NAVER, KAKAO, LOGIN_OK, FACE_VECTOR, FACE_ID, EMAIL
) VALUES
('44e8c5e7-4434-5678-9012-abcdef423459', '최민호', '민호', 'user004', '$2a$10$qlpgw16FieOHTMVaMiQG6uwxsywy3SRLlhDbtE4ZQq8uSYql3SXBa', '010-4567-8901', 'M', 'N', TO_DATE('25/01/04', 'YY/MM/DD'), TO_DATE('25/01/04', 'YY/MM/DD'), 'minho@gmail.com', 'minho@naver.com', 'minho@kakao.com', 'Y', NULL, NULL, 'minho@gmail.com');
INSERT INTO MEMBER (
    UUID, NAME, NICKNAME, MEMBERID, PW, PHONE_NUMBER, GENDER, ADMIN_YN, ENROLL_DATE, LASTMODIFIED, GOOGLE, NAVER, KAKAO, LOGIN_OK, FACE_VECTOR, FACE_ID, EMAIL
) VALUES
('11b6c5e7-5534-5678-9012-abcdef523450', '윤지우', '지우', 'user005', '$2a$10$qlpgw16FieOHTMVaMiQG6uwxsywy3SRLlhDbtE4ZQq8uSYql3SXBa', '010-5678-9012', 'F', 'N', TO_DATE('25/01/05', 'YY/MM/DD'), TO_DATE('25/01/05', 'YY/MM/DD'), 'jiwoo@gmail.com', 'jiwoo@naver.com', 'jiwoo@kakao.com', 'Y', NULL, NULL, 'jiwoo@gmail.com');
INSERT INTO MEMBER (
    UUID, NAME, NICKNAME, MEMBERID, PW, PHONE_NUMBER, GENDER, ADMIN_YN, ENROLL_DATE, LASTMODIFIED, GOOGLE, NAVER, KAKAO, LOGIN_OK, FACE_VECTOR, FACE_ID, EMAIL
) VALUES
('65c6c5e7-6634-5678-9012-abcdef623451', '이도현', '도현', 'user006', '$2a$10$qlpgw16FieOHTMVaMiQG6uwxsywy3SRLlhDbtE4ZQq8uSYql3SXBa', '010-6789-0123', 'M', 'N', TO_DATE('25/01/06', 'YY/MM/DD'), TO_DATE('25/01/06', 'YY/MM/DD'), 'dohyun@gmail.com', 'dohyun@naver.com', 'dohyun@kakao.com', 'Y', NULL, NULL, 'dohyun@gmail.com');
INSERT INTO MEMBER (
    UUID, NAME, NICKNAME, MEMBERID, PW, PHONE_NUMBER, GENDER, ADMIN_YN, ENROLL_DATE, LASTMODIFIED, GOOGLE, NAVER, KAKAO, LOGIN_OK, FACE_VECTOR, FACE_ID, EMAIL
) VALUES
('78d7c5e7-7734-5678-9012-abcdef723452', '한지민', '지민', 'user007', '$2a$10$qlpgw16FieOHTMVaMiQG6uwxsywy3SRLlhDbtE4ZQq8uSYql3SXBa', '010-7890-1234', 'F', 'N', TO_DATE('25/01/07', 'YY/MM/DD'), TO_DATE('25/01/07', 'YY/MM/DD'), 'jimin@gmail.com', 'jimin@naver.com', 'jimin@kakao.com', 'Y', NULL, NULL, 'jimin@gmail.com');
INSERT INTO MEMBER (
    UUID, NAME, NICKNAME, MEMBERID, PW, PHONE_NUMBER, GENDER, ADMIN_YN, ENROLL_DATE, LASTMODIFIED, GOOGLE, NAVER, KAKAO, LOGIN_OK, FACE_VECTOR, FACE_ID, EMAIL
) VALUES
('90f8c5e7-8834-5678-9012-abcdef823453', '김유진', '유진', 'user008', '$2a$10$qlpgw16FieOHTMVaMiQG6uwxsywy3SRLlhDbtE4ZQq8uSYql3SXBa', '010-8901-2345', 'F', 'N', TO_DATE('25/01/08', 'YY/MM/DD'), TO_DATE('25/01/08', 'YY/MM/DD'), 'yujin@gmail.com', 'yujin@naver.com', 'yujin@kakao.com', 'Y', NULL, NULL, 'yujin@gmail.com');
INSERT INTO MEMBER (
    UUID, NAME, NICKNAME, MEMBERID, PW, PHONE_NUMBER, GENDER, ADMIN_YN, ENROLL_DATE, LASTMODIFIED, GOOGLE, NAVER, KAKAO, LOGIN_OK, FACE_VECTOR, FACE_ID, EMAIL
) VALUES
('23e9c5e7-9934-5678-9012-abcdef923454', '최태민', '태민', 'user009', '$2a$10$qlpgw16FieOHTMVaMiQG6uwxsywy3SRLlhDbtE4ZQq8uSYql3SXBa', '010-9012-3456', 'M', 'N', TO_DATE('25/01/09', 'YY/MM/DD'), TO_DATE('25/01/09', 'YY/MM/DD'), 'taemin@gmail.com', 'taemin@naver.com', 'taemin@kakao.com', 'Y', NULL, NULL, 'taemin@gmail.com');



-- 포스트 더미 데이터
INSERT ALL
    INTO Posts (post_id, title, content, writer, nickname, post_date, post_update, filename, rename_file, post_count) 
    VALUES (1, '스쿼트 챌린지 100회 성공!', '오늘 드디어 스쿼트 100회를 달성했습니다! 사진은 첨부하지 않았지만 다음엔 영상 올릴게요.', 'alice', '앨리스', SYSDATE, SYSDATE, NULL, NULL, 50)
    INTO Posts (post_id, title, content, writer, nickname, post_date, post_update, filename, rename_file, post_count) 
    VALUES (2, '스쿼트 자세 이렇게 교정하세요', '저도 한동안 무릎 통증이 있었는데, 이렇게 교정하니 괜찮아졌어요.', 'alice', '앨리스', SYSDATE, SYSDATE, 'correct_posture.jpg', 'correct_posture_20231229.jpg', 120)
    INTO Posts (post_id, title, content, writer, nickname, post_date, post_update, filename, rename_file, post_count) 
    VALUES (3, '스쿼트 무게 150kg 도전 성공!', '헬스장 사람들이 응원해줘서 더 힘이 났습니다! 동영상으로 증명합니다.', 'alice', '앨리스', SYSDATE, SYSDATE, '150kg_squat.mp4', 'iron_sam_squat.mp4', 220)
    INTO Posts (post_id, title, content, writer, nickname, post_date, post_update, filename, rename_file, post_count) 
    VALUES (4, '스쿼트 중량 기록 공유', '오늘의 기록: 80kg로 12회, 4세트 완료. 꾸준히 하니 실력이 늘어요!', 'alice', '앨리스', SYSDATE, SYSDATE, NULL, NULL, 85)
    INTO Posts (post_id, title, content, writer, nickname, post_date, post_update, filename, rename_file, post_count) 
    VALUES (5, '스쿼트 실패담...', '스쿼트 하다가 중심을 잃고 넘어졌습니다. 괜찮긴 한데 부끄럽네요.', 'alice', '앨리스', SYSDATE, SYSDATE, NULL, NULL, 30)
    INTO Posts (post_id, title, content, writer, nickname, post_date, post_update, filename, rename_file, post_count) 
    VALUES (6, '스쿼트 강추!', '스쿼트를 매일 하니까 하체가 정말 단단해졌어요. 사진 참고하세요.', 'alice', '앨리스', SYSDATE, SYSDATE, 'leg_progress.jpg', 'leg_master_progress.jpg', 180)
    INTO Posts (post_id, title, content, writer, nickname, post_date, post_update, filename, rename_file, post_count) 
    VALUES (7, '운동 루틴 질문이요', '스쿼트를 시작한 지 한 달째인데, 어떻게 중량을 늘려야 할지 궁금합니다.', 'alice', '앨리스', SYSDATE, SYSDATE, NULL, NULL, 40)
    INTO Posts (post_id, title, content, writer, nickname, post_date, post_update, filename, rename_file, post_count) 
    VALUES (8, '스쿼트와 플랭크 병행 효과!', '플랭크와 스쿼트를 함께 하면 몸의 밸런스가 좋아지는 것 같아요.', 'alice', '앨리스', SYSDATE, SYSDATE, NULL, NULL, 70)
    INTO Posts (post_id, title, content, writer, nickname, post_date, post_update, filename, rename_file, post_count) 
    VALUES (9, '스쿼트 30일 챌린지 완료', '드디어 30일 동안 하루도 빠지지 않고 스쿼트를 했습니다. 몸이 달라졌어요!', 'alice', '앨리스', SYSDATE, SYSDATE, '30day_squat.jpg', 'challenge_result.jpg', 200)
    INTO Posts (post_id, title, content, writer, nickname, post_date, post_update, filename, rename_file, post_count) 
    VALUES (10, '헬스장 스쿼트 머신 추천', '저희 헬스장에 새로 들어온 스쿼트 머신이 너무 좋습니다. 사진 올려요.', 'alice', '앨리스', SYSDATE, SYSDATE, 'squat_machine.jpg', 'new_machine.jpg', 150)
SELECT 1 FROM DUAL;


-- 공지사항 더미 데이터
INSERT INTO NOTICE (NOTICE_NO, NTITLE, NCONTENT, NWRITER, N_NICKNAME, NCREATED_AT, NUPDATED_AT, OFILENAME, RFILENAME, NCOUNT)
VALUES (1, '서버 점검 안내', '다음 주 월요일 오전 2시에 서버 점검이 예정되어 있습니다.', 'smtt22', 'Shayne', SYSDATE - 20, SYSDATE - 15, NULL, NULL, 50);

INSERT INTO NOTICE (NOTICE_NO, NTITLE, NCONTENT, NWRITER, N_NICKNAME, NCREATED_AT, NUPDATED_AT, OFILENAME, RFILENAME, NCOUNT)
VALUES (2, '새로운 서비스 출시', '저희 웹사이트에 새로운 서비스가 추가되었습니다. 많은 이용 바랍니다.', 'smtt22', 'Shayne', SYSDATE - 18, SYSDATE - 10, NULL, NULL, 34);

INSERT INTO NOTICE (NOTICE_NO, NTITLE, NCONTENT, NWRITER, N_NICKNAME, NCREATED_AT, NUPDATED_AT, OFILENAME, RFILENAME, NCOUNT)
VALUES (3, '이벤트 당첨자 발표', '지난 주 진행된 이벤트의 당첨자를 공지합니다.', 'smtt22', 'Shayne', SYSDATE - 16, SYSDATE - 14, 'winners_list.pdf', 'winners_2024.pdf', 100);

INSERT INTO NOTICE (NOTICE_NO, NTITLE, NCONTENT, NWRITER, N_NICKNAME, NCREATED_AT, NUPDATED_AT, OFILENAME, RFILENAME, NCOUNT)
VALUES (4, '보안 업데이트 공지', '중요 보안 업데이트가 적용되었습니다. 자세한 내용은 공지를 참고하세요.', 'smtt22', 'Shayne', SYSDATE - 15, SYSDATE - 12, NULL, NULL, 75);

INSERT INTO NOTICE (NOTICE_NO, NTITLE, NCONTENT, NWRITER, N_NICKNAME, NCREATED_AT, NUPDATED_AT, OFILENAME, RFILENAME, NCOUNT)
VALUES (5, '임시 휴무 안내', '금일 오후 3시부터 시스템 점검으로 인해 임시 휴무합니다.', 'smtt22', 'Shayne', SYSDATE - 14, SYSDATE - 13, 'schedule.pdf', 'schedule_renamed.pdf', 60);

INSERT INTO NOTICE (NOTICE_NO, NTITLE, NCONTENT, NWRITER, N_NICKNAME, NCREATED_AT, NUPDATED_AT, OFILENAME, RFILENAME, NCOUNT)
VALUES (6, 'FAQ 페이지 업데이트', '자주 묻는 질문 페이지가 업데이트되었습니다. 새로운 정보를 확인하세요.', 'smtt22', 'Shayne', SYSDATE - 13, SYSDATE - 12, NULL, NULL, 48);

INSERT INTO NOTICE (NOTICE_NO, NTITLE, NCONTENT, NWRITER, N_NICKNAME, NCREATED_AT, NUPDATED_AT, OFILENAME, RFILENAME, NCOUNT)
VALUES (7, '회원가입 감사 이벤트', '신규 회원 가입자 대상 감사 이벤트를 진행합니다.', 'smtt22', 'Shayne', SYSDATE - 12, SYSDATE - 10, 'event_details.pdf', 'event_info.pdf', 88);

INSERT INTO NOTICE (NOTICE_NO, NTITLE, NCONTENT, NWRITER, N_NICKNAME, NCREATED_AT, NUPDATED_AT, OFILENAME, RFILENAME, NCOUNT)
VALUES (8, '서비스 이용약관 변경', '서비스 이용약관이 2024년 1월 1일부터 변경됩니다.', 'smtt22', 'Shayne', SYSDATE - 11, SYSDATE - 9, 'terms_old.pdf', 'terms_new.pdf', 22);

INSERT INTO NOTICE (NOTICE_NO, NTITLE, NCONTENT, NWRITER, N_NICKNAME, NCREATED_AT, NUPDATED_AT, OFILENAME, RFILENAME, NCOUNT)
VALUES (9, '시스템 복구 완료', '시스템 장애 복구 작업이 완료되었습니다. 불편을 드려 죄송합니다.', 'smtt22', 'Shayne', SYSDATE - 10, SYSDATE - 8, NULL, NULL, 70);

INSERT INTO NOTICE (NOTICE_NO, NTITLE, NCONTENT, NWRITER, N_NICKNAME, NCREATED_AT, NUPDATED_AT, OFILENAME, RFILENAME, NCOUNT)
VALUES (10, '신규 게시판 오픈', '고객 소통을 위한 새로운 게시판이 오픈되었습니다.', 'smtt22', 'Shayne', SYSDATE - 9, SYSDATE - 7, NULL, NULL, 40);

INSERT INTO NOTICE (NOTICE_NO, NTITLE, NCONTENT, NWRITER, N_NICKNAME, NCREATED_AT, NUPDATED_AT, OFILENAME, RFILENAME, NCOUNT)
VALUES (11, '정기 업데이트 일정', '정기 업데이트는 매월 첫째 주 화요일에 진행됩니다.', 'smtt22', 'Shayne', SYSDATE - 8, SYSDATE - 6, NULL, NULL, 18);

INSERT INTO NOTICE (NOTICE_NO, NTITLE, NCONTENT, NWRITER, N_NICKNAME, NCREATED_AT, NUPDATED_AT, OFILENAME, RFILENAME, NCOUNT)
VALUES (12, '2024년 공휴일 안내', '2024년 공휴일 및 휴무 일정을 안내드립니다.', 'smtt22', 'Shayne', SYSDATE - 7, SYSDATE - 5, 'holidays.pdf', 'holidays_2024.pdf', 85);

INSERT INTO NOTICE (NOTICE_NO, NTITLE, NCONTENT, NWRITER, N_NICKNAME, NCREATED_AT, NUPDATED_AT, OFILENAME, RFILENAME, NCOUNT)
VALUES (13, '시스템 안정화 작업', '시스템 안정화를 위한 작업이 진행될 예정입니다.', 'smtt22', 'Shayne', SYSDATE - 6, SYSDATE - 4, NULL, NULL, 55);

INSERT INTO NOTICE (NOTICE_NO, NTITLE, NCONTENT, NWRITER, N_NICKNAME, NCREATED_AT, NUPDATED_AT, OFILENAME, RFILENAME, NCOUNT)
VALUES (14, '고객 만족도 조사', '고객 만족도 조사가 진행 중입니다. 많은 참여 부탁드립니다.', 'smtt22', 'Shayne', SYSDATE - 5, SYSDATE - 3, 'survey.pdf', 'survey_results.pdf', 90);

INSERT INTO NOTICE (NOTICE_NO, NTITLE, NCONTENT, NWRITER, N_NICKNAME, NCREATED_AT, NUPDATED_AT, OFILENAME, RFILENAME, NCOUNT)
VALUES (15, '회원 등급 제도 도입', '새로운 회원 등급 제도가 도입되었습니다.', 'smtt22', 'Shayne', SYSDATE - 4, SYSDATE - 2, NULL, NULL, 65);

INSERT INTO NOTICE (NOTICE_NO, NTITLE, NCONTENT, NWRITER, N_NICKNAME, NCREATED_AT, NUPDATED_AT, OFILENAME, RFILENAME, NCOUNT)
VALUES (16, '이벤트 참여 안내', '이벤트 참여 방법과 혜택에 대한 안내입니다.', 'smtt22', 'Shayne', SYSDATE - 3, SYSDATE - 1, 'event_details.pdf', 'event_rewards.pdf', 45);

INSERT INTO NOTICE (NOTICE_NO, NTITLE, NCONTENT, NWRITER, N_NICKNAME, NCREATED_AT, NUPDATED_AT, OFILENAME, RFILENAME, NCOUNT)
VALUES (17, '긴급 서버 점검', '긴급 서버 점검이 진행 중입니다. 서비스 이용에 참고 바랍니다.', 'smtt22', 'Shayne', SYSDATE - 2, SYSDATE, NULL, NULL, 95);

INSERT INTO NOTICE (NOTICE_NO, NTITLE, NCONTENT, NWRITER, N_NICKNAME, NCREATED_AT, NUPDATED_AT, OFILENAME, RFILENAME, NCOUNT)
VALUES (18, '문의 사항 답변 지연', '현재 문의 사항 답변이 지연되고 있습니다. 양해 부탁드립니다.', 'smtt22', 'Shayne', SYSDATE - 1, SYSDATE, NULL, NULL, 60);

INSERT INTO NOTICE (NOTICE_NO, NTITLE, NCONTENT, NWRITER, N_NICKNAME, NCREATED_AT, NUPDATED_AT, OFILENAME, RFILENAME, NCOUNT)
VALUES (19, '서비스 개선 공지', '서비스 개선을 위한 피드백을 받고 있습니다.', 'smtt22', 'Shayne', SYSDATE - 3, SYSDATE - 1, NULL, NULL, 20);

INSERT INTO NOTICE (NOTICE_NO, NTITLE, NCONTENT, NWRITER, N_NICKNAME, NCREATED_AT, NUPDATED_AT, OFILENAME, RFILENAME, NCOUNT)
VALUES (20, '신규 기능 베타 테스트', '새로운 기능의 베타 테스트를 시작합니다. 많은 참여 바랍니다.', 'smtt22', 'Shayne', SYSDATE - 4, SYSDATE - 2, 'beta_test.pdf', 'beta_guide.pdf', 80);




-- FAQ 더미 데이터
insert into faq
values (1, '배 지방을 어떻게 빼나요?', '운동을 열심히 하고 있는데 배에 있는 지방이 잘 빠지지 않아요. 어떻게 해야 하나요?',
'Q', 0, to_date('2024-03-12'), 1, 'smtt22');

insert into faq
values (3, '근육을 키우기 위한 가장 좋은 운동은 무엇인가요?', '근육을 키우고 싶은데 어떤 운동이 효과적인가요?',
'Q', 0, to_date('2024-04-11'), 3, 'smtt22');

insert into faq
values (5, '운동은 얼마나 자주 해야 하나요?', '운동을 시작하려고 하는데, 주 몇 회 운동을 해야 하나요?',
'Q', 0, to_date('2024-04-11'), 5, 'smtt22');

insert into faq
values (7, '다이어트를 위한 최적의 식단은 무엇인가요?', 
        '다이어트를 위해서는 탄수화물 섭취를 줄이고 단백질을 충분히 섭취하는 것이 중요합니다. 또한 저지방, 고단백 식단을 유지하며, 과일과 채소를 많이 섭취해야 합니다. 칼로리 섭취를 감소시키는 동시에 영양소를 고르게 분배해야 합니다.',
        'Q', 0, to_date('2024-06-01'), 7, 'smtt22');

insert into faq
values (8, '유산소 운동과 근력 운동을 병행해야 하나요?', 
        '유산소 운동과 근력 운동을 병행하는 것이 좋습니다. 유산소 운동은 심혈관 건강에 좋고, 근력 운동은 근육을 발달시키는 데 도움을 줍니다. 둘을 병행하면 체지방 감소와 근육량 증가에 모두 효과적입니다.',
        'Q', 0, to_date('2024-06-01'), 8, 'smtt22');

insert into faq
values (9, '스트레칭을 언제 해야 하나요?', 
        '운동 전 후에 스트레칭을 하는 것이 중요합니다. 운동 전에는 가벼운 스트레칭으로 근육을 풀어주고, 운동 후에는 근육 이완을 위해 스트레칭을 해주어야 합니다. 이를 통해 부상 예방과 유연성 향상에 도움이 됩니다.',
        'Q', 0, to_date('2024-06-01'), 9, 'smtt22');
        
insert into faq
values (13, '자세를 교정하려면 어떻게 해야 하나요?', 
        '평소 앉아있는 시간이 많고, 컴퓨터를 자주 사용해서 어깨가 굽고, 허리가 아파요. 자세를 개선하려면 어떻게 해야 하나요?',
        'Q', 0, to_date('2024-06-15', 'YYYY-MM-DD'), 13, 'smtt22');

insert into faq
values (14, '어깨 통증을 완화하려면 어떤 운동을 해야 하나요?', 
        '어깨가 자주 아프고 운동할 때 통증이 발생합니다. 어깨 통증을 완화하려면 어떤 운동을 해야 하나요?',
        'Q', 0, to_date('2024-06-20', 'YYYY-MM-DD'), 14, 'smtt22');

insert into faq
values (15, '하체 근육을 키우려면 어떤 운동을 해야 하나요?', 
        '하체 근육을 키우기 위한 운동을 알고 싶습니다. 어떤 운동을 하면 좋을까요?',
        'Q', 0, to_date('2024-06-22', 'YYYY-MM-DD'), 15, 'smtt22');

insert into faq
values (16, '허리 통증 예방을 위한 운동은 무엇인가요?', 
        '허리 통증이 자주 발생하는데, 예방을 위한 운동이나 스트레칭은 무엇이 있을까요?',
        'Q', 0, to_date('2024-06-25', 'YYYY-MM-DD'), 16, 'smtt22');

insert into faq
values (17, '상체를 키우기 위한 운동 추천', 
        '상체를 키우고 싶은데 어떤 운동이 좋을까요? 특히 어깨와 팔 근육을 키우는 방법을 알고 싶습니다.',
        'Q', 0, to_date('2024-06-28', 'YYYY-MM-DD'), 17, 'smtt22');
        
insert into faq
values (23, '무릎 통증을 완화하는 운동', 
        '무릎 통증을 완화하려면 어떤 운동을 해야 하나요? 스쿼트와 같은 하체 운동을 할 때 무릎에 부담이 가는데, 이를 완화할 수 있는 운동이 있을까요?',
        'Q', 0, to_date('2024-07-01', 'YYYY-MM-DD'), 23, 'smtt22');

insert into faq
values (24, '피트니스 목표 설정 방법', 
        '피트니스 목표를 설정하려면 어떻게 해야 하나요? 운동을 시작했는데 목표를 어떻게 설정하고 계획을 세워야 할지 모르겠습니다.',
        'Q', 0, to_date('2024-07-05', 'YYYY-MM-DD'), 24, 'smtt22');

insert into faq
values (25, '체중 감량을 위한 운동 루틴', 
        '체중을 감량하기 위한 운동 루틴은 어떤 것이 좋을까요? 유산소 운동과 근력 운동을 어떻게 조합해야 할지 알고 싶습니다.',
        'Q', 0, to_date('2024-07-08', 'YYYY-MM-DD'), 25, 'smtt22');

-- 답글등록
insert into faq
values (2, '배 지방을 효과적으로 빼는 방법', '배 지방을 빼려면 칼로리 섭취를 줄이고 유산소 운동을 꾸준히 해야 합니다. 달리기, 자전거 타기, HIIT 운동 등이 효과적입니다. 또한 근력 운동을 병행하여 근육을 키우는 것도 지방 연소에 도움을 줍니다. 건강한 식단을 유지하고 칼로리 부족 상태를 만들어야 합니다.',
'A', 0, to_date('2024-03-12'), 1, 'smtt22');

insert into faq
values (4, '근육을 키우는 최고의 운동들', '근육을 키우기 위해서는 스쿼트, 데드리프트, 벤치프레스, 풀업, 오버헤드 프레스와 같은 복합 운동이 효과적입니다. 여러 근육을 동시에 자극하는 복합 운동에 집중하세요. 근력이 늘어날수록 점진적으로 무게를 증가시켜야 근육 성장을 자극할 수 있습니다.',
'A', 0, to_date('2024-05-15'), 3, 'smtt22');

insert into faq
values (6, '운동 빈도에 대한 최적의 가이드', '초보자의 경우, 일주일에 3-4일 정도 운동하는 것이 이상적입니다. 유산소 운동과 근력 운동을 번갈아가며 하는 것이 좋습니다. 경험이 쌓이면 주 5-6일로 늘릴 수 있지만, 과도한 운동을 피하고 근육 회복을 위한 휴식도 중요합니다.',
'A', 0, to_date('2024-05-15'), 5, 'smtt22');

insert into faq
values (10, '다이어트를 위한 최적의 식단은 무엇인가요?', 
        '다이어트를 위한 식단은 칼로리 섭취를 줄이되, 단백질 섭취를 충분히 유지해야 합니다. 또한, 식이섬유가 풍부한 채소와 과일을 포함시키고, 가공된 탄수화물보다는 복합 탄수화물을 선택하는 것이 좋습니다.',
        'A', 0, to_date('2024-06-01'), 7, 'smtt22');

insert into faq
values (11, '유산소 운동과 근력 운동을 병행해야 하나요?', 
        '유산소 운동과 근력 운동을 병행하면 서로 보완적인 효과를 발휘합니다. 유산소 운동으로 체지방을 감소시키고, 근력 운동으로 근육을 키우면 체형 개선에 매우 효과적입니다.',
        'A', 0, to_date('2024-06-01'), 8, 'smtt22');

insert into faq
values (12, '스트레칭을 언제 해야 하나요?', 
        '스트레칭은 운동 전후 모두 중요합니다. 운동 전에는 부상 예방을 위해 동적 스트레칭을 하고, 운동 후에는 근육의 이완과 회복을 위해 정적 스트레칭을 해주는 것이 좋습니다.',
        'A', 0, to_date('2024-06-01'), 9, 'smtt22');
        
insert into faq
values (18, '자세 교정 운동', 
        '자세 교정을 위해서는 하루에 몇 분씩이라도 스트레칭을 하는 것이 중요합니다. 특히, 가슴을 열어주는 스트레칭과 등 근육을 강화하는 운동을 병행하세요. 또한, 바른 앉는 자세와 서 있는 자세를 지속적으로 유지하는 것이 중요합니다.',
        'A', 0, to_date('2024-06-15', 'YYYY-MM-DD'), 13, 'smtt22');

insert into faq
values (19, '어깨 통증 완화를 위한 운동', 
        '어깨 통증을 완화하기 위해서는 어깨 회전근개를 강화하는 운동이 필요합니다. 예를 들어, 덤벨을 이용한 어깨 외회전 운동과 밴드를 이용한 어깨 운동을 꾸준히 해주세요. 또한, 어깨를 자주 풀어주고, 지나치게 무리한 운동은 피하는 것이 중요합니다.',
        'A', 0, to_date('2024-06-20', 'YYYY-MM-DD'), 14, 'smtt22');

insert into faq
values (20, '하체 근육을 키우는 운동', 
        '하체 근육을 키우기 위해서는 스쿼트, 런지, 데드리프트와 같은 복합 운동을 꾸준히 해야 합니다. 또한, 하체 운동 후 충분한 휴식과 식이 조절이 중요합니다. 하체 근육은 다른 부위보다 더 큰 근육군이므로 체중을 점진적으로 증가시키는 것이 효과적입니다.',
        'A', 0, to_date('2024-06-22', 'YYYY-MM-DD'), 15, 'smtt22');

insert into faq
values (21, '허리 통증 예방을 위한 운동', 
        '허리 통증 예방을 위해서는 코어 근육을 강화하는 운동이 중요합니다. 플랭크, 브릿지, 힙 쓰러스트와 같은 운동이 효과적이며, 요가나 필라테스도 허리 건강에 도움이 됩니다. 바른 자세를 유지하고 무리하지 않게 운동을 해야 합니다.',
        'A', 0, to_date('2024-06-25', 'YYYY-MM-DD'), 16, 'smtt22');

insert into faq
values (22, '상체 근육을 키우는 운동', 
        '상체 근육을 키우기 위해서는 벤치프레스, 푸시업, 풀업, 어깨 프레스 등의 복합 운동이 필요합니다. 팔꿈치와 어깨를 안전하게 보호하면서 운동하고, 점진적으로 무게를 증가시켜 주세요. 꾸준한 운동과 충분한 휴식이 필수입니다.',
        'A', 0, to_date('2024-06-28', 'YYYY-MM-DD'), 17, 'smtt22');
        
insert into faq
values (26, '무릎 통증을 완화하는 운동', 
        '무릎 통증을 완화하려면 무릎을 굽히는 운동을 자제하고, 하체 근육을 강화하는 운동을 하는 것이 좋습니다. 레그 프레스, 다리 들어올리기 운동 등이 도움이 됩니다. 또한, 무릎을 스트레칭하고 유연성을 높여주는 운동도 필요합니다.',
        'A', 0, to_date('2024-07-01', 'YYYY-MM-DD'), 23, 'smtt22');

insert into faq
values (27, '피트니스 목표 설정 방법', 
        '피트니스 목표를 설정하려면 현실적이고 측정 가능한 목표를 설정하세요. 예를 들어, "3개월 내에 5kg 감량" 또는 "주 3회 운동"처럼 구체적인 목표를 설정하고, 목표에 맞는 운동 계획을 수립하세요.',
        'A', 0, to_date('2024-07-05', 'YYYY-MM-DD'), 24, 'smtt22');

insert into faq
values (28, '체중 감량을 위한 운동 루틴', 
        '체중 감량을 위해서는 유산소 운동을 30분 이상 꾸준히 하고, 근력 운동을 병행하는 것이 좋습니다. HIIT 운동이나 조깅, 자전거 타기 등의 유산소 운동과 함께 스쿼트, 푸시업, 덤벨 운동을 추가하는 것이 효과적입니다.',
        'A', 0, to_date('2024-07-08', 'YYYY-MM-DD'), 25, 'smtt22');


INSERT INTO squatfeedback
VALUES (1, 'uuid-2', 10, 8, TO_DATE('2024-12-23', 'YYYY-MM-DD'), 'eunji');
INSERT INTO squatfeedback
VALUES (2, 'uuid-2', 10, 8, TO_DATE('2024-12-24', 'YYYY-MM-DD'), 'eunji');
INSERT INTO squatfeedback
VALUES (3, 'uuid-2', 10, 8, TO_DATE('2024-12-25', 'YYYY-MM-DD'), 'eunji');


COMMIT;