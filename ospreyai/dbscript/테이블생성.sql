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
    name VARCHAR2(20) NOT NULL,
    nickname VARCHAR2(30),
    memberid VARCHAR2(100) NOT NULL,
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
    UNIQUE (memberid)
);

-- Member ���̺� �ڸ�Ʈ ����
COMMENT ON COLUMN Member.uuid IS '����Ű';
COMMENT ON COLUMN Member.name IS '�̸�';
COMMENT ON COLUMN Member.nickname IS '�г���';
COMMENT ON COLUMN Member.memberid IS '���̵�';
COMMENT ON COLUMN Member.pw IS '��й�ȣ';
COMMENT ON COLUMN Member.phone_number IS '��ȭ��ȣ';
COMMENT ON COLUMN Member.gender IS '����';
COMMENT ON COLUMN Member.admin_yn IS '�����ڿ���';
COMMENT ON COLUMN Member.face_id IS '���̽����̵�';
COMMENT ON COLUMN Member.enroll_date IS '���Գ�¥';
COMMENT ON COLUMN Member.lastModified IS '������������¥';
COMMENT ON COLUMN Member.google IS '���۷α���';
COMMENT ON COLUMN Member.naver IS '���̹��α���';
COMMENT ON COLUMN Member.kakao IS 'īī���α���';
COMMENT ON COLUMN Member.login_ok IS '�α��ΰ��ɿ���';




-- Refresh_Tokens ���̺� ����
BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE Refresh_Tokens CASCADE CONSTRAINTS';
EXCEPTION
    WHEN OTHERS THEN
        IF SQLCODE != -942 THEN
            RAISE;
        END IF;
END;
/

-- Refresh_Tokens ���̺� ����
CREATE TABLE Refresh_Tokens (
    id RAW(36) DEFAULT SYS_GUID() NOT NULL,
    userid VARCHAR2(50)    NOT NULL,
    token_value VARCHAR2(512)   NOT NULL,
    issued_at TIMESTAMP   DEFAULT CURRENT_TIMESTAMP,
    expires_in NUMBER  NOT NULL,
    expiration_date TIMESTAMP   NOT NULL,
    member_agent VARCHAR2(255),
    status VARCHAR2(50),
    CONSTRAINT PK_RTOKENS PRIMARY KEY (id),
    CONSTRAINT FK_RTOKENS FOREIGN KEY (userid) REFERENCES MEMBER (memberid) ON DELETE CASCADE
);

-- Refresh_Tokens ���̺� �ڸ�Ʈ ����
COMMENT ON COLUMN Refresh_Tokens.id IS '��ū�ĺ�ID';
COMMENT ON COLUMN Refresh_Tokens.userid IS '��ū����ھ��̵�';
COMMENT ON COLUMN Refresh_Tokens.token_value IS '��ū��';
COMMENT ON COLUMN Refresh_Tokens.issued_at IS '��ū������¥�ð�';
COMMENT ON COLUMN Refresh_Tokens.expires_in IS '��ū����и���';
COMMENT ON COLUMN Refresh_Tokens.expiration_date IS '��ū���ᳯ¥�ð�';
COMMENT ON COLUMN Refresh_Tokens.member_agent IS '��ū�߱޿�����Ʈ';
COMMENT ON COLUMN Refresh_Tokens.status IS '��ū����';




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
    name VARCHAR2(30),
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
    CONSTRAINT FK_MEMBER_POSTS FOREIGN KEY (writer) REFERENCES Member (memberid)
);

-- Posts ���̺� �ڸ�Ʈ ����
COMMENT ON COLUMN Posts.post_id IS '�۹�ȣ';
COMMENT ON COLUMN Posts.title IS '����';
COMMENT ON COLUMN Posts.content IS '����';
COMMENT ON COLUMN Posts.writer IS '�ۼ���';
COMMENT ON COLUMN Posts.nickname IS '����';
COMMENT ON COLUMN Posts.post_date IS '��������';
COMMENT ON COLUMN Posts.post_update IS '��������';
COMMENT ON COLUMN Posts.filename IS '���������̸�';
COMMENT ON COLUMN Posts.rename_file IS '���������̸�';
COMMENT ON COLUMN Posts.post_count IS '��ȸ��';

CREATE TABLE Reply

-- Notice ���̺� ����
BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE Notice CASCADE CONSTRAINTS';
EXCEPTION
    WHEN OTHERS THEN
        IF SQLCODE != -942 THEN
            RAISE;
        END IF;
END;
/

-- Notice ���̺� ����
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

-- Notice ���̺� �ڸ�Ʈ ����
COMMENT ON COLUMN Notice.notice_no IS '�۹�ȣ';
COMMENT ON COLUMN Notice.ntitle IS '������';
COMMENT ON COLUMN Notice.ncontent IS '����';
COMMENT ON COLUMN Notice.nwriter IS '�ۼ���';
COMMENT ON COLUMN Notice.n_nickname IS '�г���';
COMMENT ON COLUMN Notice.ncreated_at IS '��������';
COMMENT ON COLUMN Notice.nupdated_at IS '��������';
COMMENT ON COLUMN Notice.ofilename IS '���������̸�';
COMMENT ON COLUMN Notice.rfilename IS '���������̸�';
COMMENT ON COLUMN Notice.ncount IS '��ȸ��';




-- FAQ ���̺� ����
BEGIN
    EXECUTE IMMEDIATE 'DROP TABLE FAQ CASCADE CONSTRAINTS';
EXCEPTION
    WHEN OTHERS THEN
        IF SQLCODE != -942 THEN
            RAISE;
        END IF;
END;
/

-- FAQ ���̺� ����
CREATE TABLE FAQ (
    faq_id NUMBER PRIMARY KEY,                    -- �۹�ȣ (PK)
    faq_title VARCHAR2(1000) NOT NULL,              -- ������
    faq_content VARCHAR2(2000) NOT NULL,                     -- �۳���
    faq_qa CHAR(1) NOT NULL,               -- �۱��� (FAQ�� ī�װ�)
    category VARCHAR2(100) NOT NULL,             -- FAQ����
    view_count NUMBER DEFAULT 0 NOT NULL,                   -- ��ȸ��
    created_at DATE DEFAULT SYSDATE NOT NULL, -- ��ϳ�¥
    qna_id NUMBER,                                 -- Q&A �۹�ȣ (FK)
    faq_writer VARCHAR2(100) NOT NULL,
    CONSTRAINT fk_qna_id FOREIGN KEY (qna_id) REFERENCES FAQ(faq_id) ON DELETE SET NULL -- QNA�� �ܷ�Ű ����
    ,CONSTRAINT CHK_faq_qa check (faq_qa in ('Q', 'A'))
    ,CONSTRAINT fk_faq_writer FOREIGN KEY (faq_writer) REFERENCES MEMBER(memberid) ON DELETE SET NULL
);

-- �÷��� ���� ���� �߰�
COMMENT ON COLUMN FAQ.faq_id IS 'FAQ �� ��ȣ';
COMMENT ON COLUMN FAQ.faq_title IS 'FAQ �� ����';
COMMENT ON COLUMN FAQ.faq_content IS 'FAQ �� ����';
COMMENT ON COLUMN FAQ.faq_qa IS 'FAQ �۱���';
COMMENT ON COLUMN FAQ.category IS 'FAQ ī�װ�';
COMMENT ON COLUMN FAQ.view_count IS 'FAQ ��ȸ��';
COMMENT ON COLUMN FAQ.created_at IS 'FAQ �����';
COMMENT ON COLUMN FAQ.qna_id IS 'QNA �۹�ȣ';
COMMENT ON COLUMN FAQ.faq_writer IS '�ۼ���';




-- ������ ����
CREATE SEQUENCE squat_id_seq
START WITH 1
INCREMENT BY 1
NOCACHE;

COMMIT;
