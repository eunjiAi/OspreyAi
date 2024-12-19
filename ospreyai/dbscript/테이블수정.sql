-- Member ���̺��� ���� ������ ����
INSERT INTO Member (uuid, name, email, pw, phone_number, is_admin, face_id) 
VALUES ('uuid-001', 'John Doe', 'john.doe@example.com', 'password123', '1234567890', 0, NULL);

INSERT INTO Member (uuid, name, email, pw, phone_number, is_admin, face_id) 
VALUES ('uuid-002', 'Jane Smith', 'jane.smith@example.com', 'password456', '0987654321', 0, NULL);

INSERT INTO Member (uuid, name, email, pw, phone_number, is_admin, face_id) 
VALUES ('uuid-003', 'Admin User', 'admin@example.com', 'adminpass', '1122334455', 1, NULL);

-- Squatfeedback ���̺��� ���� ������ ����
INSERT INTO Squatfeedback (squat_id, uuid, total_attempts, correct_count, squat_date) 
VALUES (1, 'uuid-001', 10, 8, TO_TIMESTAMP('2024-12-18 10:30:00', 'YYYY-MM-DD HH24:MI:SS'));

INSERT INTO Squatfeedback (squat_id, uuid, total_attempts, correct_count, squat_date) 
VALUES (2, 'uuid-001', 15, 14, TO_TIMESTAMP('2024-12-19 14:45:00', 'YYYY-MM-DD HH24:MI:SS'));

INSERT INTO Squatfeedback (squat_id, uuid, total_attempts, correct_count, squat_date) 
VALUES (3, 'uuid-002', 20, 18, TO_TIMESTAMP('2024-12-18 09:20:00', 'YYYY-MM-DD HH24:MI:SS'));

INSERT INTO Squatfeedback (squat_id, uuid, total_attempts, correct_count, squat_date) 
VALUES (4, 'uuid-002', 25, 23, TO_TIMESTAMP('2024-12-19 16:00:00', 'YYYY-MM-DD HH24:MI:SS'));

INSERT INTO Squatfeedback (squat_id, uuid, total_attempts, correct_count, squat_date) 
VALUES (5, 'uuid-003', 30, 28, TO_TIMESTAMP('2024-12-18 11:10:00', 'YYYY-MM-DD HH24:MI:SS'));

INSERT INTO Squatfeedback (squat_id, uuid, total_attempts, correct_count, squat_date) 
VALUES (6, 'uuid-003', 12, 10, TO_TIMESTAMP('2024-12-19 13:00:00', 'YYYY-MM-DD HH24:MI:SS'));

