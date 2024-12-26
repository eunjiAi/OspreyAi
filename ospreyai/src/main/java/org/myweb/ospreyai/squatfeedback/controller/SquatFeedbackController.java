package org.myweb.ospreyai.squatfeedback.controller;

import org.myweb.ospreyai.squatfeedback.model.dto.SquatFeedbackDTO;
import org.myweb.ospreyai.squatfeedback.model.service.SquatFeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Date;

@RestController
@RequestMapping("/api/squat")
public class SquatFeedbackController {

	@Autowired
	private SquatFeedbackService squatFeedbackService;

	@PostMapping("/feedback")
	public ResponseEntity<String> submitFeedback(@RequestBody SquatFeedbackDTO dto, Authentication authentication) {
		String name = authentication.getName(); // 인증된 사용자 이름
		int result = squatFeedbackService.saveFeedback(dto, name);
		if (result == 1) {
			return ResponseEntity.ok("Feedback saved successfully");
		} else {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error saving feedback");
		}
	}

	@GetMapping("/daily-stats")
	public ResponseEntity<Map<String, Object>> getDailyStats(
			@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "6") int size,
			Authentication authentication) {
		String name = authentication.getName(); // 인증된 사용자 이름
		List<SquatFeedbackDTO> feedbackList = squatFeedbackService.getDailyStats(page, size, name);
		long totalFeedbackCount = squatFeedbackService.getTotalFeedbackCount(name);

		Map<String, Object> response = new HashMap<>();
		response.put("feedbackList", feedbackList);
		response.put("totalCount", totalFeedbackCount);
		response.put("currentPage", page);
		response.put("pageSize", size);

		return ResponseEntity.ok(response);
	}

	@GetMapping("/feedback-by-date")
	public ResponseEntity<List<SquatFeedbackDTO>> getFeedbackByDate(
			@RequestParam String date,
			Authentication authentication) {
		try {
			String name = authentication.getName(); // 인증된 사용자 이름
			Date parsedDate = new SimpleDateFormat("yyyy-MM-dd").parse(date);
			List<SquatFeedbackDTO> feedbackList = squatFeedbackService.getFeedbackByDate(parsedDate, name);

			if (feedbackList.isEmpty()) {
				return ResponseEntity.status(HttpStatus.NO_CONTENT).body(null);
			}

			return ResponseEntity.ok(feedbackList);
		} catch (ParseException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
		}
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<Map<String, String>> handleException(Exception ex) {
		Map<String, String> errorResponse = new HashMap<>();
		errorResponse.put("error", "Internal Server Error");
		errorResponse.put("message", ex.getMessage());
		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
	}
}
