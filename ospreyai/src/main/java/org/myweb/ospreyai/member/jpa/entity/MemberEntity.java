package org.myweb.ospreyai.member.jpa.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.myweb.ospreyai.member.model.dto.Member;

import java.sql.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "MEMBER")
@Entity
public class MemberEntity {
    @Id
    @Column(name = "UUID", nullable = false)
    private String uuid;	//	UUID	VARCHAR2(36 BYTE)
    @Column(name = "NAME")
    private String name;	//	NAME	VARCHAR2(20 BYTE)
    @Column(name = "NICKNAME")
    private String nickname;	//  NICKNAME	VARCHAR2(30 BYTE)
    @Column(name = "EMAIL", nullable = false, unique = true)
    private String email;	//	EMAIL	VARCHAR2(100 BYTE)
    @Column(name = "PW")
    private String pw;		//	PW	VARCHAR2(100 BYTE)
    @Column(name = "PHONE_NUMBER")
    private String phoneNumber;	//	PHONE_NUMBER	VARCHAR2(15 BYTE)
    @Column(name = "GENDER")
    private String gender;	//	GENDER	CHAR(1 BYTE)
    @Column(name = "ADMIN_YN", nullable = false, columnDefinition = "N")
    private String adminYn;	//	ADMIN_YN	CHAR(1 BYTE)
    @Column(name = "FACE_ID")
    private String faceId;	//	FACE_ID	VARCHAR2(255 BYTE)
    @Column(name = "ENROLL_DATE")
    private Date enrollDate;	//	ENROLL_DATE	DATE
    @Column(name = "LASTMODIFIED")
    private Date lastModified;	//	LASTMODIFIED	DATE
    @Column(name = "SIGNTYPE", nullable = false, columnDefinition = "direct")
    private String signType;	//	SIGNTYPE	VARCHAR2(10 BYTE)
    @Column(name = "LOGIN_OK", nullable = false, columnDefinition = "Y")
    private String loginOk;		//	LOGIN_OK	CHAR(1 BYTE)

    @PrePersist
    public void prePersist(){
        enrollDate = new Date(System.currentTimeMillis());
        lastModified = new Date(System.currentTimeMillis());
    }

    public Member toDto(){
        return Member.builder()
                .uuid(uuid)
                .name(name)
                .nickname(nickname)
                .email(email)
                .pw(pw)
                .phoneNumber(phoneNumber)
                .gender(gender)
                .adminYn(adminYn)
                .faceId(faceId)
                .enrollDate(enrollDate)
                .lastModified(lastModified)
                .signType(signType)
                .loginOk(loginOk)
                .build();
    }
}
