package org.myweb.ospreyai.SquatFeedback.service;

import org.myweb.ospreyai.SquatFeedback.jpa.entity.SquatFeedback;
import org.myweb.ospreyai.SquatFeedback.jpa.repository.SquatFeedbackRepository;
import org.myweb.ospreyai.SquatFeedback.model.dto.SquatFeedbackDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class SquatFeedbackService {

	@Autowired
	private SquatFeedbackRepository squatFeedbackRepository;

	public Map<String, Object> processSquatFeedback(SquatFeedbackDTO squatFeedbackDTO) {
		SquatFeedback feedback = new SquatFeedback(
				squatFeedbackDTO.getUserId(),
				squatFeedbackDTO.getDuration(),
				squatFeedbackDTO.getCorrectPostureDuration()
		);
		squatFeedbackRepository.save(feedback);

		Map<String, Object> response = new HashMap<>();
		response.put("message", "Feedback logged successfully");
		response.put("totalTime", squatFeedbackRepository.getTotalDuration(squatFeedbackDTO.getUserId()));
		return response;
	}
}
