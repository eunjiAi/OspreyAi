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
    private Long squatId;

    @Column(name = "UUID", nullable = false)
    private String uuid; // 추가된 필드

    @Column(name = "NAME", nullable = false)
    private String name;

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
                .uuid(uuid) // 추가된 필드
                .name(name)
                .totalAttempts(totalAttempts)
                .correctCount(correctCount)
                .date(squatDate)
                .build();
    }
}
