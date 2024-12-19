package org.myweb.ospreyai.squatfeedback.model.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.myweb.ospreyai.squatfeedback.jpa.entity.SquatFeedback;
import org.myweb.ospreyai.squatfeedback.jpa.repository.SquatFeedbackRepository;
import org.myweb.ospreyai.squatfeedback.model.dto.SquatFeedbackDTO;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort; // 올바른 임포트 추가
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Calendar;
import java.util.Date;
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

	public List<SquatFeedbackDTO> getDailyStats(int page, int size) {
		return squatFeedbackRepository.findAll(PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "squatDate")))
				.stream()
				.map(SquatFeedback::toDto)
				.collect(Collectors.toList());
	}

	public long getTotalFeedbackCount() {
		return squatFeedbackRepository.count();
	}

	public List<SquatFeedbackDTO> getFeedbackByDate(Date date) {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		calendar.set(Calendar.HOUR_OF_DAY, 0);
		calendar.set(Calendar.MINUTE, 0);
		calendar.set(Calendar.SECOND, 0);
		calendar.set(Calendar.MILLISECOND, 0);
		Date startDate = calendar.getTime();

		calendar.add(Calendar.DAY_OF_MONTH, 1);
		Date endDate = calendar.getTime();

		return squatFeedbackRepository.findByDate(startDate, endDate).stream()
				.map(SquatFeedback::toDto)
				.collect(Collectors.toList());
	}
}
