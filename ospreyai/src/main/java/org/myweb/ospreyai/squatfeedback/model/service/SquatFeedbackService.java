package org.myweb.ospreyai.squatfeedback.model.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.myweb.ospreyai.squatfeedback.jpa.entity.SquatFeedback;
import org.myweb.ospreyai.squatfeedback.jpa.repository.SquatFeedbackRepository;
import org.myweb.ospreyai.squatfeedback.model.dto.SquatFeedbackDTO;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
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

	public int saveFeedback(SquatFeedbackDTO dto, String name) {
		try {
			SquatFeedback entity = dto.toEntity();
			entity.setName(name); // name 설정
			squatFeedbackRepository.save(entity);
			return 1;
		} catch (Exception e) {
			log.error("Error saving feedback: " + e.getMessage());
			return 0;
		}
	}

	public List<SquatFeedbackDTO> getDailyStats(int page, int size, String name) {
		return squatFeedbackRepository.findByName(name, PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "squatDate")))
				.stream()
				.map(SquatFeedback::toDto)
				.collect(Collectors.toList());
	}

	public long getTotalFeedbackCount(String name) {
		return squatFeedbackRepository.countByName(name);
	}

	public List<SquatFeedbackDTO> getFeedbackByDate(Date date, String name) {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		calendar.set(Calendar.HOUR_OF_DAY, 0);
		calendar.set(Calendar.MINUTE, 0);
		calendar.set(Calendar.SECOND, 0);
		calendar.set(Calendar.MILLISECOND, 0);
		Date startDate = calendar.getTime();

		calendar.add(Calendar.DAY_OF_MONTH, 1);
		Date endDate = calendar.getTime();

		return squatFeedbackRepository.findByNameAndDate(name, startDate, endDate).stream()
				.map(SquatFeedback::toDto)
				.collect(Collectors.toList());
	}
}
