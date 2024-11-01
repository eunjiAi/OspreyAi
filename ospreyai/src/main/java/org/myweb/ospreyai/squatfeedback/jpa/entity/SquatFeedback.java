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
    private Long id;

    @Column(name = "USER_ID", nullable = false)
    private String userId;

    @Column(name = "TOTAL_ATTEMPTS", nullable = false)
    private int totalAttempts;

    @Column(name = "CORRECT_POSTURE_COUNT", nullable = false)
    private int correctPostureCount;

    @Temporal(TemporalType.DATE)
    @Column(name = "SQUAT_DATE", nullable = false)
    private Date squatDate;

    public SquatFeedbackDTO toDto() {
        return SquatFeedbackDTO.builder()
                .id(id)
                .userId(userId)
                .totalAttempts(totalAttempts)
                .correctPostureCount(correctPostureCount)
                .date(squatDate)
                .build();
    }
}
