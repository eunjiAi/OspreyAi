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
	private String email;	//	EMAIL	VARCHAR2(100 BYTE)
	private String pw;		//	PW	VARCHAR2(100 BYTE)
	private String phoneNumber;	//	PHONE_NUMBER	VARCHAR2(15 BYTE)
	private String gender;	//	GENDER	CHAR(1 BYTE)
	private String adminYn;	//	ADMIN_YN	CHAR(1 BYTE)
	private String faceId;	//	FACE_ID	VARCHAR2(255 BYTE)
	@JsonFormat(pattern="yyyy-MM-dd")
	private Date enrollDate;	//	ENROLL_DATE	DATE
	@JsonFormat(pattern="yyyy-MM-dd")
	private Date lastModified;	//	LASTMODIFIED	DATE
	private String signType;	//	SIGNTYPE	VARCHAR2(10 BYTE)
	private String loginOk;		//	LOGIN_OK	CHAR(1 BYTE)


	public MemberEntity toEntity() {
		return MemberEntity.builder()
				.uuid(uuid)
				.name(name)
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
