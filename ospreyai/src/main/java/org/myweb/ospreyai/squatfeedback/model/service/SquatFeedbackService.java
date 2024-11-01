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

	public SquatFeedbackDTO findFeedbackById(Long id) {
		return squatFeedbackRepository.findById(id)
				.map(SquatFeedback::toDto)
				.orElse(null);
	}

	// 일별 피드백 통계 조회 메서드 추가
	public List<SquatFeedbackDTO> getAllFeedback() {
		return squatFeedbackRepository.findAll().stream()
				.map(SquatFeedback::toDto)
				.collect(Collectors.toList());
	}
}
