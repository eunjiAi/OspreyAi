package org.myweb.ospreyai.posts.jpa.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.myweb.ospreyai.posts.model.dto.Reply;

import java.sql.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "REPLY") // 매핑할 테이블 이름 지정
@Entity
public class ReplyEntity {

    @Id // 기본 키 설정
    @Column(name = "REPLY_ID", nullable = false)
    private int replyId; // reply_id NUMBER

    @Lob // CLOB 타입 매핑
    @Column(name = "RCONTENT", nullable = false)
    private String rcontent; // rcontent CLOB

    @Column(name = "RWRITER", nullable = false, length = 30)
    private String rwriter; // rwriter VARCHAR2(30)

    @Column(name = "RNICKNAME", length = 30)
    private String rnickname; // rnickname VARCHAR2(30)

    @Column(name = "RDATE", columnDefinition = "DATE DEFAULT SYSDATE")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date rdate; // rdate DATE

    @Column(name = "REPLYREF")
    private int replyRef; // replyref NUMBER (외래 키)

    // ReplyEntity -> Reply DTO 변환 메서드
    public Reply toDto() {
        return Reply.builder()
                .replyId(replyId)
                .rcontent(rcontent)
                .rwriter(rwriter)
                .rnickname(rnickname)
                .rdate(rdate)
                .replyRef(replyRef)
                .build();
    }

    @PrePersist
    public void prePersist() {
        if (rdate == null) {
            rdate = new Date(System.currentTimeMillis());
        }
    }
}