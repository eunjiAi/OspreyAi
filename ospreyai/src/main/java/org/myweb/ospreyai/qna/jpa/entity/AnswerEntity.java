package org.myweb.ospreyai.qna.jpa.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.myweb.ospreyai.qna.model.dto.Answer;

import java.sql.Date;

@Data    //@Getter, @Setter, @ToString, @EqualsAndHashCode, @RequiredArgsConstructor
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "ANSWER")  // 매핑할 테이블 이름 지정
@Entity // JPA가 관리함, 테이블의 컬럼과 DTO 클래스의 프로퍼티를 매핑하는 역할
public class AnswerEntity {
    @Id  // JPA가 객체를 관리할 때 식별할 기본키 지정
    @Column(name = "ANO", nullable = false)
    private int ano;       // ANO NUMBER (primary key)
    @Column(name = "ATITLE", nullable = false, length = 200)
    private String aTitle;  // ATITLE VARCHAR2(200 BYTE)
    @Column(name = "ACONTENT", length = 4000)
    private String aContent; // ACONTENT VARCHAR2(4000 BYTE)
    @Column(name = "ADATE")
    private Date aDate;     // ADATE DATE
    @Column(name = "AWRITER", nullable = false, length = 50)
    private String aWriter;  // AWRITER VARCHAR2(50 BYTE)
    @Column(name = "ANSWERREF")
    private int answerRef;
    @PrePersist  // JPA로 넘어가기 전에 작동
    public void prePersist() {
            aDate = new Date(System.currentTimeMillis());  //
    }

    // entity --> dto로 변환하는 메소드
    public Answer toDto() {
        return Answer.builder()
                .ano(ano)
                .aTitle(aTitle)
                .aContent(aContent)
                .aDate(aDate)
                .aWriter(aWriter)
                .answerRef(answerRef)
                .build();
    }
}