package org.myweb.ospreyai.SquatFeedback.jpa.repository;

import org.myweb.ospreyai.SquatFeedback.jpa.entity.SquatFeedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface SquatFeedbackRepository extends JpaRepository<SquatFeedback, Long> {

    @Query("SELECT SUM(s.duration) FROM SquatFeedback s WHERE s.userId = :userId")
    Integer getTotalDuration(String userId);
}
