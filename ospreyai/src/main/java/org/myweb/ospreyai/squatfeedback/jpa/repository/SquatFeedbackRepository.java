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

    @Query("SELECT f FROM SquatFeedback f WHERE f.name = :name AND f.uuid = :uuid")
    Page<SquatFeedback> findByNameAndUuid(@Param("name") String name, @Param("uuid") String uuid, Pageable pageable);

    @Query("SELECT f FROM SquatFeedback f WHERE f.squatDate >= :startDate AND f.squatDate < :endDate AND f.name = :name")
    List<SquatFeedback> findByNameAndDate(@Param("name") String name,
                                          @Param("startDate") Date startDate,
                                          @Param("endDate") Date endDate);

    Page<SquatFeedback> findByName(String name, Pageable pageable);

    long countByName(String name);

    // name과 uuid를 조건으로 사용하는 메서드
    @Query("SELECT COUNT(f) FROM SquatFeedback f WHERE f.name = :name AND f.uuid = :uuid")
    long countByNameAndUuid(@Param("name") String name, @Param("uuid") String uuid);
}
