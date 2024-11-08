package org.myweb.ospreyai.squatfeedback.controller;

import org.myweb.ospreyai.squatfeedback.model.dto.SquatFeedbackDTO;
import org.myweb.ospreyai.squatfeedback.model.service.SquatFeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
	public ResponseEntity<String> submitFeedback(@RequestBody SquatFeedbackDTO dto) {
		int result = squatFeedbackService.saveFeedback(dto);
		if (result == 1) {
			return ResponseEntity.ok("Feedback saved successfully");
		} else {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error saving feedback");
		}
	}

	// 날짜별 피드백 통계를 최신순으로 조회
	@GetMapping("/daily-stats")
	public ResponseEntity<Map<String, Object>> getDailyStats(@RequestParam(defaultValue = "0") int page,
															 @RequestParam(defaultValue = "6") int size) {
		List<SquatFeedbackDTO> feedbackList = squatFeedbackService.getDailyStats(page, size);
		long totalFeedbackCount = squatFeedbackService.getTotalFeedbackCount(); // 전체 피드백 수 가져오기

		if (feedbackList.isEmpty()) {
			return ResponseEntity.status(HttpStatus.NO_CONTENT).body(null); // 데이터가 없는 경우 204 No Content
		}

		Map<String, Object> response = new HashMap<>();
		response.put("feedbackList", feedbackList);
		response.put("totalCount", totalFeedbackCount);
		response.put("currentPage", page);
		response.put("pageSize", size);

		return ResponseEntity.ok(response);
	}
}
