package org.myweb.ospreyai.SquatFeedback.controller;

import org.myweb.ospreyai.SquatFeedback.model.dto.SquatFeedbackDTO;
import org.myweb.ospreyai.SquatFeedback.service.SquatFeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/squat")
public class SquatFeedbackController {

	@Autowired
	private SquatFeedbackService squatFeedbackService;

	@PostMapping("/log")
	public Map<String, Object> logSquatFeedback(@RequestBody SquatFeedbackDTO squatFeedbackDTO) {
		return squatFeedbackService.processSquatFeedback(squatFeedbackDTO);
	}
}
