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
    email VARCHAR2(100) NOT NULL,
    pw VARCHAR2(100),
    phone_number VARCHAR2(15),
    gender CHAR(1) NOT NULL,
    admin_yn CHAR(1) DEFAULT 'N' NOT NULL,
    face_id VARCHAR2(255),
    enroll_date DATE DEFAULT SYSDATE,
    lastModified DATE DEFAULT SYSDATE,
    google VARCHAR2(100),
    naver VARCHAR2(100),
    kakao VARCHAR2(100),
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
COMMENT ON COLUMN Member.google IS '구글로그인';
COMMENT ON COLUMN Member.naver IS '네이버로그인';
COMMENT ON COLUMN Member.kakao IS '카카오로그인';
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
    CONSTRAINT FK_MEMBER_POSTS FOREIGN KEY (writer) REFERENCES Member (email)
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
    PRIMARY KEY (notice_no)
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
    faq_id NUMBER PRIMARY KEY,                    -- 글번호 (PK)
    faq_title VARCHAR2(1000) NOT NULL,              -- 글제목
    faq_content VARCHAR2(2000) NOT NULL,                     -- 글내용
    category CHAR(1) NOT NULL,               -- 글구분 (FAQ의 카테고리)
    view_count NUMBER DEFAULT 0 NOT NULL,                   -- 조회수
    created_at DATE DEFAULT SYSDATE NOT NULL, -- 등록날짜
    qna_id NUMBER,                                 -- Q&A 글번호 (FK)
    faq_writer VARCHAR2(100) NOT NULL,
    CONSTRAINT fk_qna_id FOREIGN KEY (qna_id) REFERENCES FAQ(faq_id) ON DELETE SET NULL -- QNA와 외래키 관계
    ,CONSTRAINT CHK_category check (category in ('Q', 'A'))
    ,CONSTRAINT fk_faq_writer FOREIGN KEY (faq_writer) REFERENCES MEMBER(email) ON DELETE SET NULL
);

-- FAQ 테이블 코멘트 생성
COMMENT ON COLUMN FAQ.faq_id IS 'FAQ 글 번호';
COMMENT ON COLUMN FAQ.faq_title IS 'FAQ 글 제목';
COMMENT ON COLUMN FAQ.faq_content IS 'FAQ 글 내용';
COMMENT ON COLUMN FAQ.category IS 'FAQ 카테고리';
COMMENT ON COLUMN FAQ.view_count IS 'FAQ 조회수';
COMMENT ON COLUMN FAQ.created_at IS 'FAQ 등록일';
COMMENT ON COLUMN FAQ.qna_id IS 'QNA 글번호';
COMMENT ON COLUMN FAQ.faq_writer IS '작성자';




-- 시퀀스 생성
CREATE SEQUENCE squat_id_seq
START WITH 1
INCREMENT BY 1
NOCACHE;

COMMIT;
