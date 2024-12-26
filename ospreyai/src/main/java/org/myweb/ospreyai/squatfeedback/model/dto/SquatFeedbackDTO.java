package org.myweb.ospreyai.squatfeedback.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.myweb.ospreyai.squatfeedback.jpa.entity.SquatFeedback;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SquatFeedbackDTO {
	private Long id;
	private String uuid;
	private String name;

	@JsonProperty("totalAttempts")
	private int totalAttempts;

	@JsonProperty("correctCount")
	private int correctCount;

	private Date date;

	@JsonProperty("dateFormatted") // 추가된 직렬화 필드
	private String dateFormatted;

	public SquatFeedback toEntity() {
		return SquatFeedback.builder()
				.squatId(id)
				.uuid(uuid)
				.name(name)
				.totalAttempts(totalAttempts)
				.correctCount(correctCount)
				.squatDate(date)
				.build();
	}
}
