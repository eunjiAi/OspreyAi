package org.myweb.ospreyai.squatfeedback.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.myweb.ospreyai.squatfeedback.jpa.entity.SquatFeedback;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SquatFeedbackDTO {
	private Long id;
	private String userId;
	private int duration;
	private int correctPostureDuration;
	private Date date; // 날짜 필드

	public SquatFeedback toEntity() {
		return SquatFeedback.builder()
				.id(id)
				.userId(userId)
				.duration(duration)
				.correctPostureDuration(correctPostureDuration)
				.squatDate(date) // 변경된 필드 이름
				.build();
	}
}
