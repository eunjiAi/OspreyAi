-- test_user �߰�
INSERT INTO Member (uuid, name, email, pw, phone_number, is_admin, face_id)
VALUES ('test_user', '�׽�Ʈ �����', 'test@example.com', 'adminpass', '01012345678', 0, NULL);

-- �߰����� ���� �����͸� �����մϴ�.
INSERT INTO Member (uuid, name, email, pw, phone_number, is_admin, face_id)
VALUES ('b62a18d1-56f2-4b71-b123-456cd789abc', '��ö��', 'kimchulsoo@example.com', 'password123', '01098765432', 0, NULL);

INSERT INTO Member (uuid, name, email, pw, phone_number, is_admin, face_id)
VALUES ('1e1e9e5f-bde0-4231-92d1-973413b509dd', '�ڿ���', 'parkyounghee@example.com', 'password123', '01056789012', 0, NULL);

INSERT INTO Member (uuid, name, email, pw, phone_number, is_admin, face_id)
VALUES ('2f2f2f6f-f9a1-452b-bc9d-512e564e3344', '�̹μ�', 'leeminsu@example.com', 'password123', '01034567890', 0, NULL);
