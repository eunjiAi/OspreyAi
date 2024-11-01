package org.myweb.ospreyai.squatfeedback.jpa.repository;

import org.myweb.ospreyai.squatfeedback.jpa.entity.SquatFeedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SquatFeedbackRepository extends JpaRepository<SquatFeedback, Long> {
}
