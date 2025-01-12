package org.myweb.ospreyai.notice.jpa.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.myweb.ospreyai.notice.model.dto.Notice;

import java.sql.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "NOTICE")
@Entity
public class NoticeEntity {
    @Id
    @Column(name = "NOTICE_NO", nullable = false)
    private int noticeNo;    //    NOTICE_NO	NUMBER
    @Column(name = "NTITLE", nullable = false)
    private String nTitle;    //    NTITLE	VARCHAR2(60 BYTE)
    @Column(name ="NCONTENT", nullable = false)
    private String nContent;    //    NCONTENT	CLOB
    @Column(name = "NWRITER", nullable = false)
    private String nWriter; //    NWRITER	VARCHAR2(30 BYTE)
    @Column(name = "N_NICKNAME", nullable = false)
    private String nNickname;   //  N_NICKNAME	VARCHAR2(30 BYTE)
    @Column(name = "NCREATED_AT")
    private Date nCreatedAt;    //    NCREATED_AT	DATE
    @Column(name = "NUPDATED_AT")
    private Date nUpdatedAt;    //    NUPDATED_AT	DATE
    @Column(name = "OFILENAME")
    private String ofileName;   //    OFILENAME	VARCHAR2(200 BYTE)
    @Column(name = "RFILENAME")
    private String rfileName;   //    RFILENAME	VARCHAR2(200 BYTE)
    @Column(name = "NCOUNT")
    private int nCount; //    NCOUNT	NUMBER


    @PrePersist
    public void prePersist() {
        nCreatedAt = new Date(System.currentTimeMillis());
    }

    public Notice toDto() {
        return Notice.builder()
                .noticeNo(noticeNo)
                .nTitle(nTitle)
                .nContent(nContent)
                .nWriter(nWriter)
                .nNickname(nNickname)
                .nCreatedAt(nCreatedAt)
                .nUpdatedAt(nUpdatedAt)
                .ofileName(ofileName != null && !ofileName.isEmpty() ? ofileName : "")
                .rfileName(rfileName != null && !rfileName.isEmpty() ? rfileName : "")
                .nCount(nCount)
                .build();
    }
}