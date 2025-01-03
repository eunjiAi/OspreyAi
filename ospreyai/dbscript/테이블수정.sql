-- test_user �߰�
INSERT INTO Member (uuid, name, nickname, email, pw, phone_number, gender, admin_yn, face_id, enroll_date, lastModified, google, naver, kakao, login_ok)
VALUES ('test_user', '�׽�Ʈ �����', 'test_user', 'test@example.com', '$2a$10$qlpgw16FieOHTMVaMiQG6uwxsywy3SRLlhDbtE4ZQq8uSYql3SXBa', '01012345678', 'F', 'Y', NULL, SYSDATE, NULL, NULL, NULL, NULL, 'Y');

-- �߰����� ���� ������
INSERT INTO Member (uuid, name, nickname, email, pw, phone_number, gender, admin_yn, face_id, enroll_date, lastModified, google, naver, kakao, login_ok)
VALUES ('uuid-1', 'Alice', 'Alice', 'alice@example.com', '$2a$10$qlpgw16FieOHTMVaMiQG6uwxsywy3SRLlhDbtE4ZQq8uSYql3SXBa', '010-1234-5678', 'M', 'N', 'face-1', SYSDATE, NULL, NULL, NULL, NULL, 'Y');

INSERT INTO Member (uuid, name, nickname, email, pw, phone_number, gender, admin_yn, face_id, enroll_date, lastModified, google, naver, kakao, login_ok)
VALUES ('uuid-2', 'Bob', 'Bob', 'bob@example.com', '$2a$10$qlpgw16FieOHTMVaMiQG6uwxsywy3SRLlhDbtE4ZQq8uSYql3SXBa', '010-9876-5432', 'F', 'N', 'face-2', SYSDATE, NULL, NULL, NULL, NULL, 'Y');

INSERT INTO Member (uuid, name, nickname, email, pw, phone_number, gender, admin_yn, face_id, enroll_date, lastModified, google, naver, kakao, login_ok)
VALUES ('uuid-3', 'Charlie', 'Charlie', 'charlie@example.com', '$2a$10$qlpgw16FieOHTMVaMiQG6uwxsywy3SRLlhDbtE4ZQq8uSYql3SXBa', '010-5678-1234', 'F', 'N', 'face-3', SYSDATE, NULL, NULL, NULL, NULL, 'Y');

INSERT INTO Member (uuid, name, nickname, email, pw, phone_number, gender, admin_yn, face_id, enroll_date, lastModified, google, naver, kakao, login_ok)
VALUES ('uuid-4', 'Shayne', 'Shayne', 'smtt22@example.com', '$2a$10$qlpgw16FieOHTMVaMiQG6uwxsywy3SRLlhDbtE4ZQq8uSYql3SXBa', '010-0101-1234', 'M', 'Y', 'face-4', SYSDATE, NULL, NULL, NULL, NULL, 'Y');


-- ����Ʈ ���� ������
INSERT ALL
    INTO Posts (post_id, title, content, writer, nickname, post_date, post_update, filename, rename_file, post_count) 
    VALUES (1, '����Ʈ ç���� 100ȸ ����!', '���� ���� ����Ʈ 100ȸ�� �޼��߽��ϴ�! ������ ÷������ �ʾ����� ������ ���� �ø��Կ�.', 'alice@example.com', '�ٸ���', SYSDATE, SYSDATE, NULL, NULL, 50)
    INTO Posts (post_id, title, content, writer, nickname, post_date, post_update, filename, rename_file, post_count) 
    VALUES (2, '����Ʈ �ڼ� �̷��� �����ϼ���', '���� �ѵ��� ���� ������ �־��µ�, �̷��� �����ϴ� �����������.', 'alice@example.com', '�ٸ���', SYSDATE, SYSDATE, 'correct_posture.jpg', 'correct_posture_20231229.jpg', 120)
    INTO Posts (post_id, title, content, writer, nickname, post_date, post_update, filename, rename_file, post_count) 
    VALUES (3, '����Ʈ ���� 150kg ���� ����!', '�ｺ�� ������� �������༭ �� ���� �����ϴ�! ���������� �����մϴ�.', 'alice@example.com', '�ٸ���', SYSDATE, SYSDATE, '150kg_squat.mp4', 'iron_sam_squat.mp4', 220)
    INTO Posts (post_id, title, content, writer, nickname, post_date, post_update, filename, rename_file, post_count) 
    VALUES (4, '����Ʈ �߷� ��� ����', '������ ���: 80kg�� 12ȸ, 4��Ʈ �Ϸ�. ������ �ϴ� �Ƿ��� �þ��!', 'alice@example.com', '�ٸ���', SYSDATE, SYSDATE, NULL, NULL, 85)
    INTO Posts (post_id, title, content, writer, nickname, post_date, post_update, filename, rename_file, post_count) 
    VALUES (5, '����Ʈ ���д�...', '����Ʈ �ϴٰ� �߽��� �Ұ� �Ѿ������ϴ�. ������ �ѵ� �β����׿�.', 'alice@example.com', '�ٸ���', SYSDATE, SYSDATE, NULL, NULL, 30)
    INTO Posts (post_id, title, content, writer, nickname, post_date, post_update, filename, rename_file, post_count) 
    VALUES (6, '����Ʈ ����!', '����Ʈ�� ���� �ϴϱ� ��ü�� ���� �ܴ��������. ���� �����ϼ���.', 'alice@example.com', '�ٸ���', SYSDATE, SYSDATE, 'leg_progress.jpg', 'leg_master_progress.jpg', 180)
    INTO Posts (post_id, title, content, writer, nickname, post_date, post_update, filename, rename_file, post_count) 
    VALUES (7, '� ��ƾ �����̿�', '����Ʈ�� ������ �� �� ��°�ε�, ��� �߷��� �÷��� ���� �ñ��մϴ�.', 'alice@example.com', '�ٸ���', SYSDATE, SYSDATE, NULL, NULL, 40)
    INTO Posts (post_id, title, content, writer, nickname, post_date, post_update, filename, rename_file, post_count) 
    VALUES (8, '����Ʈ�� �÷�ũ ���� ȿ��!', '�÷�ũ�� ����Ʈ�� �Բ� �ϸ� ���� �뷱���� �������� �� ���ƿ�.', 'alice@example.com', '�ٸ���', SYSDATE, SYSDATE, NULL, NULL, 70)
    INTO Posts (post_id, title, content, writer, nickname, post_date, post_update, filename, rename_file, post_count) 
    VALUES (9, '����Ʈ 30�� ç���� �Ϸ�', '���� 30�� ���� �Ϸ絵 ������ �ʰ� ����Ʈ�� �߽��ϴ�. ���� �޶������!', 'alice@example.com', '�ٸ���', SYSDATE, SYSDATE, '30day_squat.jpg', 'challenge_result.jpg', 200)
    INTO Posts (post_id, title, content, writer, nickname, post_date, post_update, filename, rename_file, post_count) 
    VALUES (10, '�ｺ�� ����Ʈ �ӽ� ��õ', '���� �ｺ�忡 ���� ���� ����Ʈ �ӽ��� �ʹ� �����ϴ�. ���� �÷���.', 'alice@example.com', '�ٸ���', SYSDATE, SYSDATE, 'squat_machine.jpg', 'new_machine.jpg', 150)
SELECT 1 FROM DUAL;


-- �������� ���� ������
INSERT INTO NOTICE (NOTICE_NO, NTITLE, NCONTENT, NWRITER, N_NICKNAME, NCREATED_AT, NUPDATED_AT, OFILENAME, RFILENAME, NCOUNT)
VALUES (1, '���� ���� �ȳ�', '���� �� ������ ���� 2�ÿ� ���� ������ �����Ǿ� �ֽ��ϴ�.', 'smtt22@example.com', 'Shayne', SYSDATE - 20, SYSDATE - 15, NULL, NULL, 50);

INSERT INTO NOTICE (NOTICE_NO, NTITLE, NCONTENT, NWRITER, N_NICKNAME, NCREATED_AT, NUPDATED_AT, OFILENAME, RFILENAME, NCOUNT)
VALUES (2, '���ο� ���� ���', '���� ������Ʈ�� ���ο� ���񽺰� �߰��Ǿ����ϴ�. ���� �̿� �ٶ��ϴ�.', 'smtt22@example.com', 'Shayne', SYSDATE - 18, SYSDATE - 10, NULL, NULL, 34);

INSERT INTO NOTICE (NOTICE_NO, NTITLE, NCONTENT, NWRITER, N_NICKNAME, NCREATED_AT, NUPDATED_AT, OFILENAME, RFILENAME, NCOUNT)
VALUES (3, '�̺�Ʈ ��÷�� ��ǥ', '���� �� ����� �̺�Ʈ�� ��÷�ڸ� �����մϴ�.', 'smtt22@example.com', 'Shayne', SYSDATE - 16, SYSDATE - 14, 'winners_list.pdf', 'winners_2024.pdf', 100);

INSERT INTO NOTICE (NOTICE_NO, NTITLE, NCONTENT, NWRITER, N_NICKNAME, NCREATED_AT, NUPDATED_AT, OFILENAME, RFILENAME, NCOUNT)
VALUES (4, '���� ������Ʈ ����', '�߿� ���� ������Ʈ�� ����Ǿ����ϴ�. �ڼ��� ������ ������ �����ϼ���.', 'smtt22@example.com', 'Shayne', SYSDATE - 15, SYSDATE - 12, NULL, NULL, 75);

INSERT INTO NOTICE (NOTICE_NO, NTITLE, NCONTENT, NWRITER, N_NICKNAME, NCREATED_AT, NUPDATED_AT, OFILENAME, RFILENAME, NCOUNT)
VALUES (5, '�ӽ� �޹� �ȳ�', '���� ���� 3�ú��� �ý��� �������� ���� �ӽ� �޹��մϴ�.', 'smtt22@example.com', 'Shayne', SYSDATE - 14, SYSDATE - 13, 'schedule.pdf', 'schedule_renamed.pdf', 60);

INSERT INTO NOTICE (NOTICE_NO, NTITLE, NCONTENT, NWRITER, N_NICKNAME, NCREATED_AT, NUPDATED_AT, OFILENAME, RFILENAME, NCOUNT)
VALUES (6, 'FAQ ������ ������Ʈ', '���� ���� ���� �������� ������Ʈ�Ǿ����ϴ�. ���ο� ������ Ȯ���ϼ���.', 'smtt22@example.com', 'Shayne', SYSDATE - 13, SYSDATE - 12, NULL, NULL, 48);

INSERT INTO NOTICE (NOTICE_NO, NTITLE, NCONTENT, NWRITER, N_NICKNAME, NCREATED_AT, NUPDATED_AT, OFILENAME, RFILENAME, NCOUNT)
VALUES (7, 'ȸ������ ���� �̺�Ʈ', '�ű� ȸ�� ������ ��� ���� �̺�Ʈ�� �����մϴ�.', 'smtt22@example.com', 'Shayne', SYSDATE - 12, SYSDATE - 10, 'event_details.pdf', 'event_info.pdf', 88);

INSERT INTO NOTICE (NOTICE_NO, NTITLE, NCONTENT, NWRITER, N_NICKNAME, NCREATED_AT, NUPDATED_AT, OFILENAME, RFILENAME, NCOUNT)
VALUES (8, '���� �̿��� ����', '���� �̿����� 2024�� 1�� 1�Ϻ��� ����˴ϴ�.', 'smtt22@example.com', 'Shayne', SYSDATE - 11, SYSDATE - 9, 'terms_old.pdf', 'terms_new.pdf', 22);

INSERT INTO NOTICE (NOTICE_NO, NTITLE, NCONTENT, NWRITER, N_NICKNAME, NCREATED_AT, NUPDATED_AT, OFILENAME, RFILENAME, NCOUNT)
VALUES (9, '�ý��� ���� �Ϸ�', '�ý��� ��� ���� �۾��� �Ϸ�Ǿ����ϴ�. ������ ��� �˼��մϴ�.', 'smtt22@example.com', 'Shayne', SYSDATE - 10, SYSDATE - 8, NULL, NULL, 70);

INSERT INTO NOTICE (NOTICE_NO, NTITLE, NCONTENT, NWRITER, N_NICKNAME, NCREATED_AT, NUPDATED_AT, OFILENAME, RFILENAME, NCOUNT)
VALUES (10, '�ű� �Խ��� ����', '���� ������ ���� ���ο� �Խ����� ���µǾ����ϴ�.', 'smtt22@example.com', 'Shayne', SYSDATE - 9, SYSDATE - 7, NULL, NULL, 40);

INSERT INTO NOTICE (NOTICE_NO, NTITLE, NCONTENT, NWRITER, N_NICKNAME, NCREATED_AT, NUPDATED_AT, OFILENAME, RFILENAME, NCOUNT)
VALUES (11, '���� ������Ʈ ����', '���� ������Ʈ�� �ſ� ù° �� ȭ���Ͽ� ����˴ϴ�.', 'smtt22@example.com', 'Shayne', SYSDATE - 8, SYSDATE - 6, NULL, NULL, 18);

INSERT INTO NOTICE (NOTICE_NO, NTITLE, NCONTENT, NWRITER, N_NICKNAME, NCREATED_AT, NUPDATED_AT, OFILENAME, RFILENAME, NCOUNT)
VALUES (12, '2024�� ������ �ȳ�', '2024�� ������ �� �޹� ������ �ȳ��帳�ϴ�.', 'smtt22@example.com', 'Shayne', SYSDATE - 7, SYSDATE - 5, 'holidays.pdf', 'holidays_2024.pdf', 85);

INSERT INTO NOTICE (NOTICE_NO, NTITLE, NCONTENT, NWRITER, N_NICKNAME, NCREATED_AT, NUPDATED_AT, OFILENAME, RFILENAME, NCOUNT)
VALUES (13, '�ý��� ����ȭ �۾�', '�ý��� ����ȭ�� ���� �۾��� ����� �����Դϴ�.', 'smtt22@example.com', 'Shayne', SYSDATE - 6, SYSDATE - 4, NULL, NULL, 55);

INSERT INTO NOTICE (NOTICE_NO, NTITLE, NCONTENT, NWRITER, N_NICKNAME, NCREATED_AT, NUPDATED_AT, OFILENAME, RFILENAME, NCOUNT)
VALUES (14, '���� ������ ����', '���� ������ ���簡 ���� ���Դϴ�. ���� ���� ��Ź�帳�ϴ�.', 'smtt22@example.com', 'Shayne', SYSDATE - 5, SYSDATE - 3, 'survey.pdf', 'survey_results.pdf', 90);

INSERT INTO NOTICE (NOTICE_NO, NTITLE, NCONTENT, NWRITER, N_NICKNAME, NCREATED_AT, NUPDATED_AT, OFILENAME, RFILENAME, NCOUNT)
VALUES (15, 'ȸ�� ��� ���� ����', '���ο� ȸ�� ��� ������ ���ԵǾ����ϴ�.', 'smtt22@example.com', 'Shayne', SYSDATE - 4, SYSDATE - 2, NULL, NULL, 65);

INSERT INTO NOTICE (NOTICE_NO, NTITLE, NCONTENT, NWRITER, N_NICKNAME, NCREATED_AT, NUPDATED_AT, OFILENAME, RFILENAME, NCOUNT)
VALUES (16, '�̺�Ʈ ���� �ȳ�', '�̺�Ʈ ���� ����� ���ÿ� ���� �ȳ��Դϴ�.', 'smtt22@example.com', 'Shayne', SYSDATE - 3, SYSDATE - 1, 'event_details.pdf', 'event_rewards.pdf', 45);

INSERT INTO NOTICE (NOTICE_NO, NTITLE, NCONTENT, NWRITER, N_NICKNAME, NCREATED_AT, NUPDATED_AT, OFILENAME, RFILENAME, NCOUNT)
VALUES (17, '��� ���� ����', '��� ���� ������ ���� ���Դϴ�. ���� �̿뿡 ���� �ٶ��ϴ�.', 'smtt22@example.com', 'Shayne', SYSDATE - 2, SYSDATE, NULL, NULL, 95);

INSERT INTO NOTICE (NOTICE_NO, NTITLE, NCONTENT, NWRITER, N_NICKNAME, NCREATED_AT, NUPDATED_AT, OFILENAME, RFILENAME, NCOUNT)
VALUES (18, '���� ���� �亯 ����', '���� ���� ���� �亯�� �����ǰ� �ֽ��ϴ�. ���� ��Ź�帳�ϴ�.', 'smtt22@example.com', 'Shayne', SYSDATE - 1, SYSDATE, NULL, NULL, 60);

INSERT INTO NOTICE (NOTICE_NO, NTITLE, NCONTENT, NWRITER, N_NICKNAME, NCREATED_AT, NUPDATED_AT, OFILENAME, RFILENAME, NCOUNT)
VALUES (19, '���� ���� ����', '���� ������ ���� �ǵ���� �ް� �ֽ��ϴ�.', 'smtt22@example.com', 'Shayne', SYSDATE - 3, SYSDATE - 1, NULL, NULL, 20);

INSERT INTO NOTICE (NOTICE_NO, NTITLE, NCONTENT, NWRITER, N_NICKNAME, NCREATED_AT, NUPDATED_AT, OFILENAME, RFILENAME, NCOUNT)
VALUES (20, '�ű� ��� ��Ÿ �׽�Ʈ', '���ο� ����� ��Ÿ �׽�Ʈ�� �����մϴ�. ���� ���� �ٶ��ϴ�.', 'smtt22@example.com', 'Shayne', SYSDATE - 4, SYSDATE - 2, 'beta_test.pdf', 'beta_guide.pdf', 80);




-- FAQ ���� ������
insert into faq
values (1, '�� ������ ��� ������?', '��� ������ �ϰ� �ִµ� �迡 �ִ� ������ �� ������ �ʾƿ�. ��� �ؾ� �ϳ���?',
'Q', 0, to_date('2024-03-12'), 1, 'smtt22@example.com');

insert into faq
values (3, '������ Ű��� ���� ���� ���� ��� �����ΰ���?', '������ Ű��� ������ � ��� ȿ�����ΰ���?',
'Q', 0, to_date('2024-04-11'), 3, 'smtt22@example.com');

insert into faq
values (5, '��� �󸶳� ���� �ؾ� �ϳ���?', '��� �����Ϸ��� �ϴµ�, �� �� ȸ ��� �ؾ� �ϳ���?',
'Q', 0, to_date('2024-04-11'), 5, 'smtt22@example.com');

insert into faq
values (7, '���̾�Ʈ�� ���� ������ �Ĵ��� �����ΰ���?', 
        '���̾�Ʈ�� ���ؼ��� ź��ȭ�� ���븦 ���̰� �ܹ����� ����� �����ϴ� ���� �߿��մϴ�. ���� ������, ���ܹ� �Ĵ��� �����ϸ�, ���ϰ� ä�Ҹ� ���� �����ؾ� �մϴ�. Į�θ� ���븦 ���ҽ�Ű�� ���ÿ� ����Ҹ� ������ �й��ؾ� �մϴ�.',
        'Q', 0, to_date('2024-06-01'), 7, 'smtt22@example.com');

insert into faq
values (8, '����� ��� �ٷ� ��� �����ؾ� �ϳ���?', 
        '����� ��� �ٷ� ��� �����ϴ� ���� �����ϴ�. ����� ��� ������ �ǰ��� ����, �ٷ� ��� ������ �ߴ޽�Ű�� �� ������ �ݴϴ�. ���� �����ϸ� ü���� ���ҿ� ������ ������ ��� ȿ�����Դϴ�.',
        'Q', 0, to_date('2024-06-01'), 8, 'smtt22@example.com');

insert into faq
values (9, '��Ʈ��Ī�� ���� �ؾ� �ϳ���?', 
        '� �� �Ŀ� ��Ʈ��Ī�� �ϴ� ���� �߿��մϴ�. � ������ ������ ��Ʈ��Ī���� ������ Ǯ���ְ�, � �Ŀ��� ���� �̿��� ���� ��Ʈ��Ī�� ���־�� �մϴ�. �̸� ���� �λ� ����� ������ ��� ������ �˴ϴ�.',
        'Q', 0, to_date('2024-06-01'), 9, 'smtt22@example.com');
        
insert into faq
values (13, '�ڼ��� �����Ϸ��� ��� �ؾ� �ϳ���?', 
        '��� �ɾ��ִ� �ð��� ����, ��ǻ�͸� ���� ����ؼ� ����� ����, �㸮�� ���Ŀ�. �ڼ��� �����Ϸ��� ��� �ؾ� �ϳ���?',
        'Q', 0, to_date('2024-06-15', 'YYYY-MM-DD'), 13, 'smtt22@example.com');

insert into faq
values (14, '��� ������ ��ȭ�Ϸ��� � ��� �ؾ� �ϳ���?', 
        '����� ���� ������ ��� �� ������ �߻��մϴ�. ��� ������ ��ȭ�Ϸ��� � ��� �ؾ� �ϳ���?',
        'Q', 0, to_date('2024-06-20', 'YYYY-MM-DD'), 14, 'smtt22@example.com');

insert into faq
values (15, '��ü ������ Ű����� � ��� �ؾ� �ϳ���?', 
        '��ü ������ Ű��� ���� ��� �˰� �ͽ��ϴ�. � ��� �ϸ� �������?',
        'Q', 0, to_date('2024-06-22', 'YYYY-MM-DD'), 15, 'smtt22@example.com');

insert into faq
values (16, '�㸮 ���� ������ ���� ��� �����ΰ���?', 
        '�㸮 ������ ���� �߻��ϴµ�, ������ ���� ��̳� ��Ʈ��Ī�� ������ �������?',
        'Q', 0, to_date('2024-06-25', 'YYYY-MM-DD'), 16, 'smtt22@example.com');

insert into faq
values (17, '��ü�� Ű��� ���� � ��õ', 
        '��ü�� Ű��� ������ � ��� �������? Ư�� ����� �� ������ Ű��� ����� �˰� �ͽ��ϴ�.',
        'Q', 0, to_date('2024-06-28', 'YYYY-MM-DD'), 17, 'smtt22@example.com');
        
insert into faq
values (23, '���� ������ ��ȭ�ϴ� �', 
        '���� ������ ��ȭ�Ϸ��� � ��� �ؾ� �ϳ���? ����Ʈ�� ���� ��ü ��� �� �� ������ �δ��� ���µ�, �̸� ��ȭ�� �� �ִ� ��� �������?',
        'Q', 0, to_date('2024-07-01', 'YYYY-MM-DD'), 23, 'smtt22@example.com');

insert into faq
values (24, '��Ʈ�Ͻ� ��ǥ ���� ���', 
        '��Ʈ�Ͻ� ��ǥ�� �����Ϸ��� ��� �ؾ� �ϳ���? ��� �����ߴµ� ��ǥ�� ��� �����ϰ� ��ȹ�� ������ ���� �𸣰ڽ��ϴ�.',
        'Q', 0, to_date('2024-07-05', 'YYYY-MM-DD'), 24, 'smtt22@example.com');

insert into faq
values (25, 'ü�� ������ ���� � ��ƾ', 
        'ü���� �����ϱ� ���� � ��ƾ�� � ���� �������? ����� ��� �ٷ� ��� ��� �����ؾ� ���� �˰� �ͽ��ϴ�.',
        'Q', 0, to_date('2024-07-08', 'YYYY-MM-DD'), 25, 'smtt22@example.com');

-- ��۵��
insert into faq
values (2, '�� ������ ȿ�������� ���� ���', '�� ������ ������ Į�θ� ���븦 ���̰� ����� ��� ������ �ؾ� �մϴ�. �޸���, ������ Ÿ��, HIIT � ���� ȿ�����Դϴ�. ���� �ٷ� ��� �����Ͽ� ������ Ű��� �͵� ���� ���ҿ� ������ �ݴϴ�. �ǰ��� �Ĵ��� �����ϰ� Į�θ� ���� ���¸� ������ �մϴ�.',
'A', 0, to_date('2024-03-12'), 1, 'smtt22@example.com');

insert into faq
values (4, '������ Ű��� �ְ��� ���', '������ Ű��� ���ؼ��� ����Ʈ, ���帮��Ʈ, ��ġ������, Ǯ��, ������� �������� ���� ���� ��� ȿ�����Դϴ�. ���� ������ ���ÿ� �ڱ��ϴ� ���� ��� �����ϼ���. �ٷ��� �þ���� ���������� ���Ը� �������Ѿ� ���� ������ �ڱ��� �� �ֽ��ϴ�.',
'A', 0, to_date('2024-05-15'), 3, 'smtt22@example.com');

insert into faq
values (6, '� �󵵿� ���� ������ ���̵�', '�ʺ����� ���, �����Ͽ� 3-4�� ���� ��ϴ� ���� �̻����Դϴ�. ����� ��� �ٷ� ��� �����ư��� �ϴ� ���� �����ϴ�. ������ ���̸� �� 5-6�Ϸ� �ø� �� ������, ������ ��� ���ϰ� ���� ȸ���� ���� �޽ĵ� �߿��մϴ�.',
'A', 0, to_date('2024-05-15'), 5, 'smtt22@example.com');

insert into faq
values (10, '���̾�Ʈ�� ���� ������ �Ĵ��� �����ΰ���?', 
        '���̾�Ʈ�� ���� �Ĵ��� Į�θ� ���븦 ���̵�, �ܹ��� ���븦 ����� �����ؾ� �մϴ�. ����, ���̼����� ǳ���� ä�ҿ� ������ ���Խ�Ű��, ������ ź��ȭ�����ٴ� ���� ź��ȭ���� �����ϴ� ���� �����ϴ�.',
        'A', 0, to_date('2024-06-01'), 7, 'smtt22@example.com');

insert into faq
values (11, '����� ��� �ٷ� ��� �����ؾ� �ϳ���?', 
        '����� ��� �ٷ� ��� �����ϸ� ���� �������� ȿ���� �����մϴ�. ����� ����� ü������ ���ҽ�Ű��, �ٷ� ����� ������ Ű��� ü�� ������ �ſ� ȿ�����Դϴ�.',
        'A', 0, to_date('2024-06-01'), 8, 'smtt22@example.com');

insert into faq
values (12, '��Ʈ��Ī�� ���� �ؾ� �ϳ���?', 
        '��Ʈ��Ī�� � ���� ��� �߿��մϴ�. � ������ �λ� ������ ���� ���� ��Ʈ��Ī�� �ϰ�, � �Ŀ��� ������ �̿ϰ� ȸ���� ���� ���� ��Ʈ��Ī�� ���ִ� ���� �����ϴ�.',
        'A', 0, to_date('2024-06-01'), 9, 'smtt22@example.com');
        
insert into faq
values (18, '�ڼ� ���� �', 
        '�ڼ� ������ ���ؼ��� �Ϸ翡 �� �о��̶� ��Ʈ��Ī�� �ϴ� ���� �߿��մϴ�. Ư��, ������ �����ִ� ��Ʈ��Ī�� �� ������ ��ȭ�ϴ� ��� �����ϼ���. ����, �ٸ� �ɴ� �ڼ��� �� �ִ� �ڼ��� ���������� �����ϴ� ���� �߿��մϴ�.',
        'A', 0, to_date('2024-06-15', 'YYYY-MM-DD'), 13, 'smtt22@example.com');

insert into faq
values (19, '��� ���� ��ȭ�� ���� �', 
        '��� ������ ��ȭ�ϱ� ���ؼ��� ��� ȸ���ٰ��� ��ȭ�ϴ� ��� �ʿ��մϴ�. ���� ���, ������ �̿��� ��� ��ȸ�� ��� ��带 �̿��� ��� ��� ������ ���ּ���. ����, ����� ���� Ǯ���ְ�, ����ġ�� ������ ��� ���ϴ� ���� �߿��մϴ�.',
        'A', 0, to_date('2024-06-20', 'YYYY-MM-DD'), 14, 'smtt22@example.com');

insert into faq
values (20, '��ü ������ Ű��� �', 
        '��ü ������ Ű��� ���ؼ��� ����Ʈ, ����, ���帮��Ʈ�� ���� ���� ��� ������ �ؾ� �մϴ�. ����, ��ü � �� ����� �޽İ� ���� ������ �߿��մϴ�. ��ü ������ �ٸ� �������� �� ū �������̹Ƿ� ü���� ���������� ������Ű�� ���� ȿ�����Դϴ�.',
        'A', 0, to_date('2024-06-22', 'YYYY-MM-DD'), 15, 'smtt22@example.com');

insert into faq
values (21, '�㸮 ���� ������ ���� �', 
        '�㸮 ���� ������ ���ؼ��� �ھ� ������ ��ȭ�ϴ� ��� �߿��մϴ�. �÷�ũ, �긴��, �� ������Ʈ�� ���� ��� ȿ�����̸�, �䰡�� �ʶ��׽��� �㸮 �ǰ��� ������ �˴ϴ�. �ٸ� �ڼ��� �����ϰ� �������� �ʰ� ��� �ؾ� �մϴ�.',
        'A', 0, to_date('2024-06-25', 'YYYY-MM-DD'), 16, 'smtt22@example.com');

insert into faq
values (22, '��ü ������ Ű��� �', 
        '��ü ������ Ű��� ���ؼ��� ��ġ������, Ǫ�þ�, Ǯ��, ��� ������ ���� ���� ��� �ʿ��մϴ�. �Ȳ�ġ�� ����� �����ϰ� ��ȣ�ϸ鼭 ��ϰ�, ���������� ���Ը� �������� �ּ���. ������ ��� ����� �޽��� �ʼ��Դϴ�.',
        'A', 0, to_date('2024-06-28', 'YYYY-MM-DD'), 17, 'smtt22@example.com');
        
insert into faq
values (26, '���� ������ ��ȭ�ϴ� �', 
        '���� ������ ��ȭ�Ϸ��� ������ ������ ��� �����ϰ�, ��ü ������ ��ȭ�ϴ� ��� �ϴ� ���� �����ϴ�. ���� ������, �ٸ� ���ø��� � ���� ������ �˴ϴ�. ����, ������ ��Ʈ��Ī�ϰ� �������� �����ִ� ��� �ʿ��մϴ�.',
        'A', 0, to_date('2024-07-01', 'YYYY-MM-DD'), 23, 'smtt22@example.com');

insert into faq
values (27, '��Ʈ�Ͻ� ��ǥ ���� ���', 
        '��Ʈ�Ͻ� ��ǥ�� �����Ϸ��� �������̰� ���� ������ ��ǥ�� �����ϼ���. ���� ���, "3���� ���� 5kg ����" �Ǵ� "�� 3ȸ �"ó�� ��ü���� ��ǥ�� �����ϰ�, ��ǥ�� �´� � ��ȹ�� �����ϼ���.',
        'A', 0, to_date('2024-07-05', 'YYYY-MM-DD'), 24, 'smtt22@example.com');

insert into faq
values (28, 'ü�� ������ ���� � ��ƾ', 
        'ü�� ������ ���ؼ��� ����� ��� 30�� �̻� ������ �ϰ�, �ٷ� ��� �����ϴ� ���� �����ϴ�. HIIT ��̳� ����, ������ Ÿ�� ���� ����� ��� �Բ� ����Ʈ, Ǫ�þ�, ���� ��� �߰��ϴ� ���� ȿ�����Դϴ�.',
        'A', 0, to_date('2024-07-08', 'YYYY-MM-DD'), 25, 'smtt22@example.com');


INSERT INTO squatfeedback
VALUES (1, 'uuid-2', 10, 8, TO_DATE('2024-12-23', 'YYYY-MM-DD'), 'eunji');
INSERT INTO squatfeedback
VALUES (2, 'uuid-2', 10, 8, TO_DATE('2024-12-24', 'YYYY-MM-DD'), 'eunji');
INSERT INTO squatfeedback
VALUES (3, 'uuid-2', 10, 8, TO_DATE('2024-12-25', 'YYYY-MM-DD'), 'eunji');


COMMIT;



-- 250103
ALTER TABLE C##FP3TEAM.MEMBER ADD FACE_VECTOR CLOB;
