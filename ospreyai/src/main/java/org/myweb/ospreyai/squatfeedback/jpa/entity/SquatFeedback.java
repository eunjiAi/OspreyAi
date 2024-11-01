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

    @Column(name = "DURATION", nullable = false)
    private int duration;

    @Column(name = "CORRECT_POSTURE_DURATION", nullable = false)
    private int correctPostureDuration;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "SQUAT_DATE", nullable = false) // DATE에서 SQUAT_DATE로 변경
    private Date squatDate; // 필드 이름도 변경

    public SquatFeedbackDTO toDto() {
        return SquatFeedbackDTO.builder()
                .id(id)
                .userId(userId)
                .duration(duration)
                .correctPostureDuration(correctPostureDuration)
                .date(squatDate) // 변경된 필드 이름
                .build();
    }
}
