package org.myweb.ospreyai.squatfeedback.jpa.repository;

import org.myweb.ospreyai.squatfeedback.jpa.entity.SquatFeedback;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface SquatFeedbackRepository extends JpaRepository<SquatFeedback, Long> {

    @Query("SELECT f FROM SquatFeedback f WHERE f.squatDate >= :startDate AND f.squatDate < :endDate AND f.name = :name")
    List<SquatFeedback> findByNameAndDate(@Param("name") String name,
                                          @Param("startDate") Date startDate,
                                          @Param("endDate") Date endDate);

    Page<SquatFeedback> findByName(String name, Pageable pageable);

    long countByName(String name);
}
