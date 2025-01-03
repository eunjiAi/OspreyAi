package org.myweb.ospreyai.qna.model.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.myweb.ospreyai.qna.jpa.entity.QuestionEntity;

import java.sql.Date;

@Data // @Getter, @Setter, @ToString, @EqualsAndHashCode, @RequiredArgsConstructor
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Question {
    private int qno;                 // QNO NUMBER : 질문 번호 (PK)
    private String qtitle;           // QTITLE VARCHAR2(200) : 질문 제목
    private String qcontent;         // QCONTENT VARCHAR2(4000) : 질문 내용
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date qdate;              // QDATE DATE : 질문 등록 날짜
    private String qwriter;          // QWRITER VARCHAR2(50) : 질문 작성자 아이디 (FK)
    private String answerYn;         // ANSWER_YN CHAR(1) : 답변 여부 (Y/N)

    // DTO -> Entity 변환 메소드
    public QuestionEntity toEntity() {
        return QuestionEntity.builder()
                .qno(qno)
                .qtitle(qtitle)
                .qcontent(qcontent)
                .qdate(qdate)
                .qwriter(qwriter)
                .answerYn(answerYn)
                .build();
    }
}