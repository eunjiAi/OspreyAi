package org.myweb.ospreyai.squatfeedback.controller;

import org.myweb.ospreyai.squatfeedback.model.dto.SquatFeedbackDTO;
import org.myweb.ospreyai.squatfeedback.model.service.SquatFeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/squat")
public class SquatFeedbackController {

	@Autowired
	private SquatFeedbackService squatFeedbackService;

	@PostMapping("/feedback")
	public String submitFeedback(@RequestBody SquatFeedbackDTO dto) {
		squatFeedbackService.saveFeedback(dto);
		return "Feedback saved successfully";
	}

	// 날짜별 피드백 통계를 조회하는 GET 엔드포인트
	@GetMapping("/daily-stats")
	public List<SquatFeedbackDTO> getDailyStats() {
		return squatFeedbackService.getAllFeedback();
	}
}
