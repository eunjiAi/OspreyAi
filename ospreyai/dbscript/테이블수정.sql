
-- Member
INSERT INTO Member (uuid, name, email, pw, phone_number, is_admin)
VALUES ('123e4567-e89b-12d3-a456-426614174000', 'John Doe', 'john.doe@example.com', 'password123', '123-456-7890', 0);

INSERT INTO Member (uuid, name, email, pw, phone_number, is_admin)
VALUES ('987e6543-b21c-34d5-f678-123456789abc', 'Jane Smith', 'jane.smith@example.com', 'password456', '987-654-3210', 0);



-- SquatFeedback
INSERT INTO Squatfeedback (squat_id, uuid, total_attempts, correct_count, squat_date)
VALUES (1, '123e4567-e89b-12d3-a456-426614174000', 10, 8, CURRENT_TIMESTAMP);

INSERT INTO Squatfeedback (squat_id, uuid, total_attempts, correct_count, squat_date)
VALUES (2, '123e4567-e89b-12d3-a456-426614174000', 15, 12, CURRENT_TIMESTAMP);

INSERT INTO Squatfeedback (squat_id, uuid, total_attempts, correct_count, squat_date)
VALUES (3, '987e6543-b21c-34d5-f678-123456789abc', 20, 18, CURRENT_TIMESTAMP);


--테스트중
SELECT * FROM Squatfeedback;
