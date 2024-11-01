package org.myweb.ospreyai.squatfeedback.model.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.myweb.ospreyai.squatfeedback.model.dto.SquatFeedbackDTO;
import org.myweb.ospreyai.squatfeedback.jpa.entity.SquatFeedback;
import org.myweb.ospreyai.squatfeedback.jpa.repository.SquatFeedbackRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class SquatFeedbackService {

	private final SquatFeedbackRepository squatFeedbackRepository;

	public int saveFeedback(SquatFeedbackDTO dto) {
		try {
			squatFeedbackRepository.save(dto.toEntity());
			return 1;
		} catch (Exception e) {
			log.error("Error saving feedback: " + e.getMessage());
			return 0;
		}
	}

	public List<SquatFeedbackDTO> getAllFeedback() {
		List<SquatFeedback> feedbackList = squatFeedbackRepository.findAll();
		System.out.println("Fetched feedback data from database: " + feedbackList);
		return feedbackList.stream()
				.map(SquatFeedback::toDto)
				.collect(Collectors.toList());
	}
}
