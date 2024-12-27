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
        '���̾�Ʈ�� ���ؼ��� ź��ȭ�� ���븦 ���̰� �ܹ����� ����� �����ϴ� ���� �߿��մϴ�. ���� ������, ��ܹ� �Ĵ��� �����ϸ�, ���ϰ� ä�Ҹ� ���� �����ؾ� �մϴ�. Į�θ� ���븦 ���ҽ�Ű�� ���ÿ� ����Ҹ� ���� �й��ؾ� �մϴ�.',
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

COMMIT;