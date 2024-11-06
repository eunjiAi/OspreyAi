package org.myweb.ospreyai.squatfeedback.controller;

import org.myweb.ospreyai.squatfeedback.model.dto.SquatFeedbackDTO;
import org.myweb.ospreyai.squatfeedback.model.service.SquatFeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/squat")
public class SquatFeedbackController {

	@Autowired
	private SquatFeedbackService squatFeedbackService;

	@PostMapping("/feedback")
	public String submitFeedback(@RequestBody SquatFeedbackDTO dto) {
		int result = squatFeedbackService.saveFeedback(dto);
		return result == 1 ? "Feedback saved successfully" : "Error saving feedback";
	}

	// 날짜별 피드백 통계를 조회하는 GET
	@GetMapping("/daily-stats")
	public Map<String, Object> getDailyStats(@RequestParam(defaultValue = "0") int page,
											 @RequestParam(defaultValue = "6") int size) {
		List<SquatFeedbackDTO> feedbackList = squatFeedbackService.getDailyStats(page, size);
		long totalFeedbackCount = squatFeedbackService.getTotalFeedbackCount(); // 전체 피드백 수 가져오기

		Map<String, Object> response = new HashMap<>();
		response.put("feedbackList", feedbackList);
		response.put("totalCount", totalFeedbackCount);
		return response;
	}
}
