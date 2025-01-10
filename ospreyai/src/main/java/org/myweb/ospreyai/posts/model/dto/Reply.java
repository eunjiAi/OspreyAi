package org.myweb.ospreyai.posts.model.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.myweb.ospreyai.posts.jpa.entity.ReplyEntity;

import java.sql.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Reply {

    private int replyId; // reply_id NUMBER
    private String rcontent; // rcontent CLOB
    private String rwriter; // rwriter VARCHAR2(30)
    private String rnickname; // rnickname VARCHAR2(30)

//    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date rdate; // rdate DATE

    private int replyRef; // replyref NUMBER

    // Reply DTO -> ReplyEntity 변환 메서드
    public ReplyEntity toEntity() {
        return ReplyEntity.builder()
                .replyId(replyId)
                .rcontent(rcontent)
                .rwriter(rwriter)
                .rnickname(rnickname)
                .rdate(rdate)
                .replyRef(replyRef)
                .build();
    }
}