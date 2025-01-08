package org.myweb.ospreyai.member.model.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.myweb.ospreyai.member.jpa.entity.MemberEntity;

import java.sql.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Member {
	@NotBlank
	private String uuid;	//	UUID	VARCHAR2(36 BYTE)
	private String name;	//	NAME	VARCHAR2(20 BYTE)
	private String nickname;	//	NICKNAME	VARCHAR2(30 BYTE)
	private String memberId;	//	EMAIL	VARCHAR2(100 BYTE)
	private String pw;		//	PW	VARCHAR2(100 BYTE)
	private String phoneNumber;	//	PHONE_NUMBER	VARCHAR2(15 BYTE)
	private String gender;	//	GENDER	CHAR(1 BYTE)
	private String adminYn;	//	ADMIN_YN	CHAR(1 BYTE)
	private String faceId;	//	FACE_ID	VARCHAR2(255 BYTE)
	private String faceVector;	//	FACE_VECTOR	CLOB
	@JsonFormat(pattern="yyyy-MM-dd")
	private Date enrollDate;	//	ENROLL_DATE	DATE
	@JsonFormat(pattern="yyyy-MM-dd")
	private Date lastModified;	//	LASTMODIFIED	DATE
	private String google;		//	GOOGLE	VARCHAR2(100 BYTE)
	private String naver;		//	NAVER	VARCHAR2(100 BYTE)
	private String kakao;		//	KAKAO	VARCHAR2(100 BYTE)
	private String loginOk;		//	LOGIN_OK	CHAR(1 BYTE)
	private String email;		//	EMAIL	VARCHAR2(255 CHAR)


	public MemberEntity toEntity() {
		return MemberEntity.builder()
				.uuid(uuid)
				.name(name)
				.nickname(nickname)
				.memberId(memberId)
				.pw(pw)
				.phoneNumber(phoneNumber)
				.gender(gender)
				.adminYn(adminYn)
				.faceId(faceId)
				.faceVector(faceVector)
				.enrollDate(enrollDate)
				.lastModified(lastModified)
				.google(google)
				.naver(naver)
				.kakao(kakao)
				.loginOk(loginOk)
				.email(email)
				.build();
	}
}
