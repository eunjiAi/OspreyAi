package org.myweb.ospreyai.notice.model.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.myweb.ospreyai.notice.jpa.entity.NoticeEntity;

import java.sql.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Notice {
    @NotBlank
    private int noticeNo;   //    NOTICE_NO	NUMBER
    private String nTitle;  //    NTITLE	VARCHAR2(60 BYTE)
    private String nContent;    //    NCONTENT	CLOB
    private String nWriter;     //    NWRITER	VARCHAR2(30 BYTE)
    private Date nCreatedAt;  //    NCREATED_AT	DATE
    private String ofileName; //    OFILENAME	VARCHAR2(200 BYTE)
    private String rfileName;   //    RFILENAME	VARCHAR2(200 BYTE)
    private int nCount; //  NCOUNT	NUMBER

    public NoticeEntity toEntity() {
        return NoticeEntity.builder()
                .noticeNo(noticeNo)
                .nTitle(nTitle)
                .nContent(nContent)
                .nWriter(nWriter)
                .nCreatedAt(nCreatedAt)
                .ofileName(ofileName)
                .rfileName(rfileName)
                .nCount(nCount)
                .build();
    }
}
