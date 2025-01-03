package org.myweb.ospreyai.faq.jpa.repository;

import org.myweb.ospreyai.faq.jpa.entity.FaqEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FaqRepository extends JpaRepository<FaqEntity, Integer>, org.myweb.ospreyai.faq.jpa.repository.FaqRepositoryCustom {
}
