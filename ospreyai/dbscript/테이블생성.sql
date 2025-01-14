-- Osprey AI

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
    nickname VARCHAR2(30),
    memberid VARCHAR2(100) NOT NULL,
    pw VARCHAR2(100),
    phone_number VARCHAR2(15),
    gender CHAR(1) NOT NULL,
    admin_yn CHAR(1) DEFAULT 'N' NOT NULL,
    enroll_date DATE DEFAULT SYSDATE,
    lastModified DATE DEFAULT SYSDATE,
    google VARCHAR2(100),
    naver VARCHAR2(100),
    kakao VARCHAR2(100),
    login_ok CHAR(1) DEFAULT 'Y' NOT NULL,
    face_id VARCHAR2(255),
    email VARCHAR2(255),
    PRIMARY KEY (uuid)
);

ALTER TABLE Member ADD CONSTRAINT uq_memberid UNIQUE (memberid);
ALTER TABLE Member ADD CONSTRAINT uq_google UNIQUE (google);
ALTER TABLE Member ADD CONSTRAINT uq_naver UNIQUE (naver);
ALTER TABLE Member ADD CONSTRAINT uq_kakao UNIQUE (kakao);

-- Member 테이블 코멘트 생성
COMMENT ON COLUMN Member.uuid IS '고유키';
COMMENT ON COLUMN Member.name IS '이름';
COMMENT ON COLUMN Member.nickname IS '닉네임';
COMMENT ON COLUMN Member.memberid IS '아이디';
COMMENT ON COLUMN Member.pw IS '비밀번호';
COMMENT ON COLUMN Member.phone_number IS '전화번호';
COMMENT ON COLUMN Member.gender IS '성별';
COMMENT ON COLUMN Member.admin_yn IS '관리자여부';
COMMENT ON COLUMN Member.enroll_date IS '가입날짜';
COMMENT ON COLUMN Member.lastModified IS '마지막수정날짜';
COMMENT ON COLUMN Member.google IS '구글로그인';
COMMENT ON COLUMN Member.naver IS '네이버로그인';
COMMENT ON COLUMN Member.kakao IS '카카오로그인';
COMMENT ON COLUMN Member.login_ok IS '로그인가능여부';
COMMENT ON COLUMN Member.face_id IS '페이스아이디';
COMMENT ON COLUMN Member.email IS '이메일';

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
    userid VARCHAR2(50) NOT NULL,
    token_value VARCHAR2(512) NOT NULL,
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_in NUMBER NOT NULL,
    expiration_date TIMESTAMP NOT NULL,
    member_agent VARCHAR2(255),
    status VARCHAR2(50),
    CONSTRAINT PK_RTOKENS PRIMARY KEY (id),
    CONSTRAINT FK_RTOKENS FOREIGN KEY (userid) REFERENCES MEMBER (memberid) ON DELETE CASCADE
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
    name VARCHAR2(30),
    PRIMARY KEY (squat_id),
    CONSTRAINT FK_MEMBER_SQUATFEEDBACK FOREIGN KEY (uuid) REFERENCES Member (uuid) ON DELETE CASCADE
);

-- Squatfeedback 테이블 코멘트 생성
COMMENT ON COLUMN Squatfeedback.squat_id IS '스쿼트번호';
COMMENT ON COLUMN Squatfeedback.uuid IS '고유키';
COMMENT ON COLUMN Squatfeedback.total_attempts IS '스쿼트총시도횟수';
COMMENT ON COLUMN Squatfeedback.correct_count IS '스쿼트바른자세횟수';
COMMENT ON COLUMN Squatfeedback.squat_date IS '스쿼트날짜';
COMMENT ON COLUMN Squatfeedback.name IS '이름';

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
    title VARCHAR2(200) NOT NULL,
    content CLOB NOT NULL,
    writer VARCHAR2(30) NOT NULL,
    nickname VARCHAR2(30),
    post_date DATE DEFAULT SYSDATE,
    post_update DATE DEFAULT SYSDATE,
    filename VARCHAR2(200),
    rename_file VARCHAR2(200),
    post_count NUMBER DEFAULT 0,
    PRIMARY KEY (post_id),
    CONSTRAINT FK_MEMBER_POSTS FOREIGN KEY (writer) REFERENCES Member (memberid) ON DELETE CASCADE
);

-- Posts 테이블 코멘트 생성
COMMENT ON COLUMN Posts.post_id IS '글번호';
COMMENT ON COLUMN Posts.title IS '제목';
COMMENT ON COLUMN Posts.content IS '내용';
COMMENT ON COLUMN Posts.writer IS '작성자';
COMMENT ON COLUMN Posts.nickname IS '별명';
COMMENT ON COLUMN Posts.post_date IS '생성일자';
COMMENT ON COLUMN Posts.post_update IS '수정일자';
COMMENT ON COLUMN Posts.filename IS '원본파일이름';
COMMENT ON COLUMN Posts.rename_file IS '수정파일이름';
COMMENT ON COLUMN Posts.post_count IS '조회수';

-- Reply 테이블 삭제
BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE Reply CASCADE CONSTRAINTS';
EXCEPTION
    WHEN OTHERS THEN
        IF SQLCODE != -942 THEN
            RAISE;
        END IF;
END;
/

-- Reply 테이블 생성
CREATE TABLE Reply(
   reply_id NUMBER CONSTRAINT pk_reply_id PRIMARY KEY,  
   rcontent CLOB NOT NULL,
   rwriter VARCHAR2(30) NOT NULL,
   rnickname VARCHAR2(30),
   rdate DATE DEFAULT SYSDATE,
   replyref NUMBER,
   CONSTRAINT FK_REPLYREF FOREIGN KEY (REPLYREF) REFERENCES Posts(post_id) ON DELETE CASCADE,
   CONSTRAINT FK_RWITER FOREIGN KEY (rwriter) REFERENCES Member (memberid) ON DELETE CASCADE
);

-- Reply 테이블 코멘트 생성
COMMENT ON COLUMN Reply.reply_id IS '댓글번호';
COMMENT ON COLUMN Reply.rcontent IS '댓글내용';
COMMENT ON COLUMN Reply.rwriter IS '댓글작성자';
COMMENT ON COLUMN Reply.rnickname IS '댓글닉네임';
COMMENT ON COLUMN Reply.rdate IS '작성일자';
COMMENT ON COLUMN Reply.replyref IS '참조글번호';

-- Notice 테이블 삭제
BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE Notice CASCADE CONSTRAINTS';
EXCEPTION
    WHEN OTHERS THEN
        IF SQLCODE != -942 THEN
            RAISE;
        END IF;
END;
/

-- Notice 테이블 생성
CREATE TABLE Notice (
    notice_no NUMBER NOT NULL,
    ntitle VARCHAR2(60) NOT NULL,
    ncontent CLOB NOT NULL,
    nwriter VARCHAR2(30) NOT NULL,
    n_nickname VARCHAR2(30) NOT NULL,
    ncreated_at DATE DEFAULT SYSDATE,
    nupdated_at DATE DEFAULT SYSDATE,
    ofilename VARCHAR2(200),
    rfilename VARCHAR2(200),
    ncount NUMBER DEFAULT 0,
    PRIMARY KEY (notice_no),
    CONSTRAINT fk_notice_writer FOREIGN KEY (nwriter) REFERENCES MEMBER(memberid) ON DELETE CASCADE
);

-- Notice 테이블 코멘트 생성
COMMENT ON COLUMN Notice.notice_no IS '글번호';
COMMENT ON COLUMN Notice.ntitle IS '글제목';
COMMENT ON COLUMN Notice.ncontent IS '내용';
COMMENT ON COLUMN Notice.nwriter IS '작성자';
COMMENT ON COLUMN Notice.n_nickname IS '닉네임';
COMMENT ON COLUMN Notice.ncreated_at IS '생성일자';
COMMENT ON COLUMN Notice.nupdated_at IS '수정일자';
COMMENT ON COLUMN Notice.ofilename IS '원본파일이름';
COMMENT ON COLUMN Notice.rfilename IS '수정파일이름';
COMMENT ON COLUMN Notice.ncount IS '조회수';

-- FAQ 테이블 삭제
BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE FAQ CASCADE CONSTRAINTS';
EXCEPTION
    WHEN OTHERS THEN
        IF SQLCODE != -942 THEN
            RAISE;
        END IF;
END;
/

-- FAQ 테이블 생성
CREATE TABLE FAQ (
    faq_id NUMBER PRIMARY KEY,
    faq_title VARCHAR2(1000) NOT NULL,
    faq_content VARCHAR2(2000) NOT NULL,
    faq_qa CHAR(1) NOT NULL,
    category VARCHAR2(100) NOT NULL,
    view_count NUMBER DEFAULT 0 NOT NULL,
    created_at DATE DEFAULT SYSDATE NOT NULL,
    qna_id NUMBER,
    faq_writer VARCHAR2(100) NOT NULL,
    CONSTRAINT fk_qna_id FOREIGN KEY (qna_id) REFERENCES FAQ(faq_id) ON DELETE CASCADE,
    CONSTRAINT CHK_faq_qa CHECK (faq_qa IN ('Q', 'A')),
    CONSTRAINT fk_faq_writer FOREIGN KEY (faq_writer) REFERENCES MEMBER(memberid) ON DELETE CASCADE
);

-- FAQ 테이블 코멘트 생성
COMMENT ON COLUMN FAQ.faq_id IS 'FAQ 글 번호';
COMMENT ON COLUMN FAQ.faq_title IS 'FAQ 글 제목';
COMMENT ON COLUMN FAQ.faq_content IS 'FAQ 글 내용';
COMMENT ON COLUMN FAQ.faq_qa IS 'FAQ 글구분';
COMMENT ON COLUMN FAQ.category IS 'FAQ 카테고리';
COMMENT ON COLUMN FAQ.view_count IS 'FAQ 조회수';
COMMENT ON COLUMN FAQ.created_at IS 'FAQ 등록일';
COMMENT ON COLUMN FAQ.qna_id IS 'QNA 글번호';
COMMENT ON COLUMN FAQ.faq_writer IS '작성자';

-- QUESTION 테이블 삭제
BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE question CASCADE CONSTRAINTS';
EXCEPTION
    WHEN OTHERS THEN
        IF SQLCODE != -942 THEN
            RAISE;
        END IF;
END;
/

-- QUESTION 테이블 생성
CREATE TABLE QUESTION (
    QNO NUMBER CONSTRAINT PK_QNO PRIMARY KEY,
    QTITLE VARCHAR2(200) NOT NULL,
    QCONTENT VARCHAR2(4000), 
    QDATE DATE DEFAULT SYSDATE,
    QWRITER VARCHAR2(50) NOT NULL,
    ANSWER_YN CHAR(1) DEFAULT 'N' NOT NULL,
    CONSTRAINT FK_QWRITER FOREIGN KEY (QWRITER) REFERENCES MEMBER(memberid) ON DELETE CASCADE
);

-- QUESTION 테이블 코멘트 생성
COMMENT ON COLUMN QUESTION.QNO IS '글번호';
COMMENT ON COLUMN QUESTION.QTITLE IS '글제목';
COMMENT ON COLUMN QUESTION.QCONTENT IS '글내용';
COMMENT ON COLUMN QUESTION.QDATE IS '작성일자';
COMMENT ON COLUMN QUESTION.QWRITER IS '작성자';
COMMENT ON COLUMN QUESTION.ANSWER_YN IS '답변여부';

-- ANSWER 테이블 삭제
BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE answer CASCADE CONSTRAINTS';
EXCEPTION
    WHEN OTHERS THEN
        IF SQLCODE != -942 THEN
            RAISE;
        END IF;
END;
/

-- ANSWER 테이블 생성
CREATE TABLE ANSWER (
    ANO NUMBER CONSTRAINT PK_ANO PRIMARY KEY,
    ATITLE VARCHAR2(200) NOT NULL,
    ACONTENT VARCHAR2(4000),
    ADATE DATE DEFAULT SYSDATE,
    AWRITER VARCHAR2(50) NOT NULL,
    ANSWERREF NUMBER,
    CONSTRAINT FK_AWRITER FOREIGN KEY (AWRITER) REFERENCES MEMBER(memberid) ON DELETE CASCADE,
    CONSTRAINT FK_ANSWERREF FOREIGN KEY (ANSWERREF) REFERENCES QUESTION(QNO) ON DELETE CASCADE
);

-- ANSWER 테이블 코멘트 생성
COMMENT ON COLUMN ANSWER.ANO IS '답변번호';
COMMENT ON COLUMN ANSWER.ATITLE IS '답변제목';
COMMENT ON COLUMN ANSWER.ACONTENT IS '답변내용';
COMMENT ON COLUMN ANSWER.ADATE IS '답변날짜';
COMMENT ON COLUMN ANSWER.AWRITER IS '답변작성자';
COMMENT ON COLUMN ANSWER.ANSWERREF IS '원글참조';

-- 시퀀스 생성
CREATE SEQUENCE squat_id_seq
START WITH 1
INCREMENT BY 1
NOCACHE;

COMMIT;
