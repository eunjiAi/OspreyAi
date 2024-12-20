-- Member ���̺� ����
BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE Member CASCADE CONSTRAINTS';
EXCEPTION
    WHEN OTHERS THEN
        IF SQLCODE != -942 THEN
            RAISE;
        END IF;
END;
/

-- Member ���̺� ����
CREATE TABLE Member (
    uuid VARCHAR2(36) NOT NULL,
    name VARCHAR2(100) NOT NULL,
    email VARCHAR2(100) NOT NULL,
    pw VARCHAR2(255) NOT NULL,
    phone_number VARCHAR2(15) NOT NULL,
    join_date DATE DEFAULT SYSDATE,  
    is_admin NUMBER(1) DEFAULT 0,
    face_id VARCHAR2(255),
    PRIMARY KEY (uuid)
);

-- Squatfeedback ���̺� ����
BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE Squatfeedback CASCADE CONSTRAINTS';
EXCEPTION
    WHEN OTHERS THEN
        IF SQLCODE != -942 THEN
            RAISE;
        END IF;
END;
/

-- Squatfeedback ���̺� ����
CREATE TABLE Squatfeedback (
    squat_id NUMBER NOT NULL,
    uuid VARCHAR2(36) NOT NULL,
    total_attempts NUMBER NOT NULL,
    correct_count NUMBER NOT NULL,
    squat_date DATE DEFAULT SYSDATE,  
    PRIMARY KEY (squat_id),
    CONSTRAINT FK_MEMBER_SQUATFEEDBACK FOREIGN KEY (uuid) REFERENCES Member (uuid)
);

-- Posts ���̺� ����
BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE Posts CASCADE CONSTRAINTS';
EXCEPTION
    WHEN OTHERS THEN
        IF SQLCODE != -942 THEN
            RAISE;
        END IF;
END;
/

-- Posts ���̺� ����
CREATE TABLE Posts (
    post_id NUMBER NOT NULL,
    uuid VARCHAR2(36) NOT NULL,
    title VARCHAR2(200) NOT NULL,
    content CLOB NOT NULL,
    report_status NUMBER(1) NOT NULL,
    is_public NUMBER(1) NOT NULL,
    post_date DATE DEFAULT SYSDATE,  
    PRIMARY KEY (post_id),
    CONSTRAINT FK_MEMBER_POSTS FOREIGN KEY (uuid) REFERENCES Member (uuid)
);

-- ������ ����
CREATE SEQUENCE squat_id_seq
START WITH 1
INCREMENT BY 1;

commit;
