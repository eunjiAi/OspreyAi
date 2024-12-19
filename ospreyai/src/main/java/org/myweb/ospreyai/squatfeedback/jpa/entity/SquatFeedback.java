package org.myweb.ospreyai.squatfeedback.jpa.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.myweb.ospreyai.squatfeedback.model.dto.SquatFeedbackDTO;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "SQUATFEEDBACK")
public class SquatFeedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SQUAT_ID")
    private Long squatId; // 기본 키

    @Column(name = "UUID", nullable = false)
    private String uuid; // 외래 키 (Member 테이블의 uuid와 연관)

    @Column(name = "TOTAL_ATTEMPTS", nullable = false)
    private int totalAttempts;

    @Column(name = "CORRECT_COUNT", nullable = false)
    private int correctCount;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "SQUAT_DATE", nullable = false)
    private Date squatDate;

    public SquatFeedbackDTO toDto() {
        return SquatFeedbackDTO.builder()
                .id(squatId)
                .uuid(uuid)
                .totalAttempts(totalAttempts)
                .correctCount(correctCount)
                .date(squatDate)
                .build();
    }
}
