package org.myweb.first.notice.model.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.myweb.first.notice.jpa.entity.NoticeEntity;

import java.util.Date;

@Data  //@Getter, @Setter, @ToString, @Equals, @HashCode 오버라이딩 까지 자동 생성됨
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Notice {
	@NotBlank
	private int noticeNo;
	@NotBlank
	private String noticeTitle;
	@JsonFormat(pattern="yyyy-MM-dd")
	private String noticeDate;
	private String noticeWriter;
	private String noticeContent;
	private String originalFilePath;
	private String renameFilePath;
	private String importance;
	@JsonFormat(pattern="yyyy-MM-dd")
	private String impEndDate;
	private int readCount;

	public NoticeEntity toEntity() {
		NoticeEntity entity = new NoticeEntity();
		entity.setNoticeNo(this.noticeNo);
		entity.setNoticeTitle(this.noticeTitle);
		entity.setNoticeWriter(this.noticeWriter);
		entity.setNoticeContent(this.noticeContent);
		entity.setOriginalFilePath(this.originalFilePath);
		entity.setRenameFilePath(this.renameFilePath);
		entity.setImportance(this.importance);
		entity.setImpEndDate(this.impEndDate != null ? java.sql.Date.valueOf(this.impEndDate.toString()) : null);
		entity.setReadCount(this.readCount);

		// noticeDate는 null 체크 후 변환
		if (this.noticeDate != null) {
			entity.setNoticeDate(java.sql.Date.valueOf(this.noticeDate.toString()));
		}

		return entity;
	}

}

