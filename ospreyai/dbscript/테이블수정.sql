-- test_user �߰�
INSERT INTO Member (uuid, name, nickname, email, pw, phone_number, gender, admin_yn, face_id, enroll_date, lastmodified, signtype, login_ok)
VALUES ('test_user', '�׽�Ʈ �����', 'test_user', 'test@example.com', 'adminpass', '01012345678', 'F', 'Y', NULL, SYSDATE, NULL, 'direct', 'Y');

-- �߰����� ���� ������
INSERT INTO Member (uuid, name, nickname, email, pw, phone_number, gender, admin_yn, face_id, enroll_date, lastmodified, signtype, login_ok)
VALUES ('uuid-1', 'Alice', 'Alice', 'alice@example.com', 'password123', '010-1234-5678', 'M', 'N', 'face-1', SYSDATE, NULL, 'direct', 'Y');

INSERT INTO Member (uuid, name, nickname, email, pw, phone_number, gender, admin_yn, face_id, enroll_date, lastmodified, signtype, login_ok)
VALUES ('uuid-2', 'Bob', 'Bob', 'bob@example.com', 'password123', '010-9876-5432', 'F', 'N', 'face-2', SYSDATE, SYSDATE, 'direct', 'Y');

INSERT INTO Member (uuid, name, nickname, email, pw, phone_number, gender, admin_yn, face_id, enroll_date, lastmodified, signtype, login_ok)
VALUES ('uuid-3', 'Charlie', 'Charlie', 'charlie@example.com', 'password123', '010-5678-1234', 'F', 'N', 'face-3', SYSDATE, NULL, 'direct', 'Y');

INSERT INTO Member (uuid, name, nickname, email, pw, phone_number, gender, admin_yn, face_id, enroll_date, lastmodified, signtype, login_ok)
VALUES ('uuid-4', 'Shayne', 'Shayne', 'smtt22@example.com', '$2a$10$qlpgw16FieOHTMVaMiQG6uwxsywy3SRLlhDbtE4ZQq8uSYql3SXBa', '010-0101-1234', 'M', 'Y', 'face-4', SYSDATE, NULL, 'direct', 'Y');


-- �������� ���� ������
INSERT INTO NOTICE (NOTICE_NO, NTITLE, NCONTENT, NWRITER, NCREATED_AT, OFILENAME, RFILENAME, NCOUNT)
VALUES (1, '�ų� �̺�Ʈ �ȳ�', '2024�� ���ظ� �����Ͽ� Ư�� �̺�Ʈ�� �����մϴ�.', '������', SYSDATE, 'event.jpg', 'event_resized.jpg', 15);

INSERT INTO NOTICE (NOTICE_NO, NTITLE, NCONTENT, NWRITER, NCREATED_AT, OFILENAME, RFILENAME, NCOUNT)
VALUES (2, '���� ���� ����', '���� ������ 2024�� 1�� 10�Ͽ� ����� �����Դϴ�.', '���', SYSDATE - 5, NULL, NULL, 25);

INSERT INTO NOTICE (NOTICE_NO, NTITLE, NCONTENT, NWRITER, NCREATED_AT, OFILENAME, RFILENAME, NCOUNT)
VALUES (3, '���ο� ��� ������Ʈ', '���Ӱ� �߰��� ����� �Ұ��մϴ�.', '������', SYSDATE - 10, 'update.jpg', 'update_resized.jpg', 50);

INSERT INTO NOTICE (NOTICE_NO, NTITLE, NCONTENT, NWRITER, NCREATED_AT, OFILENAME, RFILENAME, NCOUNT)
VALUES (4, '��� ���� ��ġ ����', '���� ������� �ذ��ϱ� ���� ��� ��ġ�� �����մϴ�.', '������', SYSDATE - 1, NULL, NULL, 100);
