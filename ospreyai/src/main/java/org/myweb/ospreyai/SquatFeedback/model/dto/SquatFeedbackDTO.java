package org.myweb.ospreyai.SquatFeedback.model.dto;

public class SquatFeedbackDTO {

	private String userId;
	private int duration;
	private int correctPostureDuration;

	public SquatFeedbackDTO() {}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public int getDuration() {
		return duration;
	}

	public void setDuration(int duration) {
		this.duration = duration;
	}

	public int getCorrectPostureDuration() {
		return correctPostureDuration;
	}

	public void setCorrectPostureDuration(int correctPostureDuration) {
		this.correctPostureDuration = correctPostureDuration;
	}
}
