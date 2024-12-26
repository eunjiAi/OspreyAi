-- Member 테이블 삭제
BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE Member CASCADE CONSTRAINTS';
EXCEPTION
    WHEN OTHERS THEN
        IF SQLCODE != -942 THEN
            RAISE;
        END IF;
END;
/

-- Member 테이블 생성
CREATE TABLE Member (
    uuid VARCHAR2(36) NOT NULL,
    name VARCHAR2(20) NOT NULL,
    nickname VARCHAR2(30) NOT NULL,
    email VARCHAR2(100) NOT NULL,
    pw VARCHAR2(100),
    phone_number VARCHAR2(15),
    gender CHAR(1) NOT NULL,
    admin_yn CHAR(1) DEFAULT 'N' NOT NULL,
    face_id VARCHAR2(255),
    enroll_date DATE DEFAULT SYSDATE,
    lastModified DATE DEFAULT SYSDATE,
    signtype VARCHAR2(10) DEFAULT 'direct' NOT NULL,
    login_ok CHAR(1) DEFAULT 'Y' NOT NULL,
    PRIMARY KEY (uuid),
    UNIQUE (email)
);

-- Member 테이블 코멘트 생성
COMMENT ON COLUMN Member.uuid IS '고유키';
COMMENT ON COLUMN Member.name IS '이름';
COMMENT ON COLUMN Member.nickname IS '닉네임';
COMMENT ON COLUMN Member.email IS '이메일';
COMMENT ON COLUMN Member.pw IS '비밀번호';
COMMENT ON COLUMN Member.phone_number IS '전화번호';
COMMENT ON COLUMN Member.gender IS '성별';
COMMENT ON COLUMN Member.admin_yn IS '관리자여부';
COMMENT ON COLUMN Member.face_id IS '페이스아이디';
COMMENT ON COLUMN Member.enroll_date IS '가입날짜';
COMMENT ON COLUMN Member.lastModified IS '마지막수정날짜';
COMMENT ON COLUMN Member.signtype IS '가입방식';
COMMENT ON COLUMN Member.login_ok IS '로그인가능여부';


-- Refresh_Tokens 테이블 삭제
BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE Refresh_Tokens CASCADE CONSTRAINTS';
EXCEPTION
    WHEN OTHERS THEN
        IF SQLCODE != -942 THEN
            RAISE;
        END IF;
END;
/

-- Refresh_Tokens 테이블 생성
CREATE TABLE Refresh_Tokens (
    id RAW(36) DEFAULT SYS_GUID() NOT NULL,
    userid VARCHAR2(50)    NOT NULL,
    token_value VARCHAR2(255)   NOT NULL,
    issued_at TIMESTAMP   DEFAULT CURRENT_TIMESTAMP,
    expires_in NUMBER  NOT NULL,
    expiration_date TIMESTAMP   NOT NULL,
    member_agent VARCHAR2(255),
    status VARCHAR2(50),
    CONSTRAINT PK_RTOKENS PRIMARY KEY (id),
    CONSTRAINT FK_RTOKENS FOREIGN KEY (userid) REFERENCES MEMBER (uuid) ON DELETE CASCADE
);

-- Refresh_Tokens 테이블 코멘트 생성
COMMENT ON COLUMN Refresh_Tokens.id IS '토큰식별ID';
COMMENT ON COLUMN Refresh_Tokens.userid IS '토큰사용자아이디';
COMMENT ON COLUMN Refresh_Tokens.token_value IS '토큰값';
COMMENT ON COLUMN Refresh_Tokens.issued_at IS '토큰생성날짜시간';
COMMENT ON COLUMN Refresh_Tokens.expires_in IS '토큰만료밀리초';
COMMENT ON COLUMN Refresh_Tokens.expiration_date IS '토큰만료날짜시간';
COMMENT ON COLUMN Refresh_Tokens.member_agent IS '토큰발급에이전트';
COMMENT ON COLUMN Refresh_Tokens.status IS '토큰상태';




-- Squatfeedback 테이블 삭제
BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE Squatfeedback CASCADE CONSTRAINTS';
EXCEPTION
    WHEN OTHERS THEN
        IF SQLCODE != -942 THEN
            RAISE;
        END IF;
END;
/

-- Squatfeedback 테이블 생성
CREATE TABLE Squatfeedback (
    squat_id NUMBER NOT NULL,
    uuid VARCHAR2(36) NOT NULL,
    total_attempts NUMBER NOT NULL,
    correct_count NUMBER NOT NULL,
    squat_date DATE DEFAULT SYSDATE,  
    PRIMARY KEY (squat_id),
    CONSTRAINT FK_MEMBER_SQUATFEEDBACK FOREIGN KEY (uuid) REFERENCES Member (uuid)
);

-- Posts 테이블 삭제
BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE Posts CASCADE CONSTRAINTS';
EXCEPTION
    WHEN OTHERS THEN
        IF SQLCODE != -942 THEN
            RAISE;
        END IF;
END;
/

-- Posts 테이블 생성
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

-- 시퀀스 생성
CREATE SEQUENCE squat_id_seq
START WITH 1
INCREMENT BY 1;

COMMIT;
