package org.myweb.ospreyai.qna.jpa.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.myweb.ospreyai.qna.model.dto.Question;

import java.sql.Date;

@Data // @Getter, @Setter, @ToString, @EqualsAndHashCode, @RequiredArgsConstructor
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "QUESTION") // 매핑할 테이블 이름 지정
@Entity // JPA가 관리하는 엔티티로 설정
public class QuestionEntity {
    @Id // 기본 키 지정
    // @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "QNO", nullable = false)
    private int qno;
    @Column(name = "QTITLE", nullable = false, length = 200)
    private String qtitle;
    @Column(name = "QCONTENT", nullable = false, length = 4000)
    private String qcontent;
    @JsonFormat(pattern = "yyyy-MM-dd")
    @Column(name = "QDATE")
    private Date qdate;
    @Column(name = "QWRITER", nullable = false, length = 50)
    private String qwriter;
    @Column(name = "ANSWER_YN", nullable = false, columnDefinition = "N")
    private String answerYn;

    @PrePersist // jpa 로 넘어가지 전에 작동
    public void prePersist() {
        qdate = new Date(System.currentTimeMillis());
    }

    // Entity -> DTO
    public Question toDto() {
        return Question.builder()
                .qno(qno)
                .qtitle(qtitle)
                .qcontent(qcontent)
                .qdate(qdate)
                .qwriter(qwriter)
                .answerYn(answerYn)
                .build();
    }
}