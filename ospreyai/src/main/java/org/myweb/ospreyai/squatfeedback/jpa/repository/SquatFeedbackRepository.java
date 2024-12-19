package org.myweb.ospreyai.squatfeedback.jpa.repository;

import org.myweb.ospreyai.squatfeedback.jpa.entity.SquatFeedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface SquatFeedbackRepository extends JpaRepository<SquatFeedback, Long> {

    // 특정 날짜에 해당하는 피드백 데이터 조회
    @Query("SELECT f FROM SquatFeedback f WHERE f.squatDate >= :startDate AND f.squatDate < :endDate")
    List<SquatFeedback> findByDate(@Param("startDate") Date startDate, @Param("endDate") Date endDate);
}

