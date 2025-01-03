package org.myweb.ospreyai.qna.model.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.myweb.ospreyai.qna.jpa.entity.AnswerEntity;

@Data    //@Getter, @Setter, @ToString, @EqualsAndHashCode, @RequiredArgsConstructor
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Answer {
    private int ano;       //ANO	NUMBER
    private String aTitle;     //ATITLE	VARCHAR2(200 BYTE)
    private String aContent;   //ACONTENT	VARCHAR2(4000 BYTE)
    @JsonFormat(pattern = "yyyy-MM-dd")
    private java.sql.Date aDate;  //ADATE	DATE
    private String aWriter;     //AWRITER	VARCHAR2(50 BYTE)
    private int answerRef;

    //dto --> entity 로 변환하는 메소드 추가함
    public AnswerEntity toEntity() {
        return AnswerEntity.builder()
                .ano(ano)
                .aTitle(aTitle)
                .aContent(aContent)
                .aDate(aDate)
                .aWriter(aWriter)
                .answerRef(answerRef)
                .build();
    }
}