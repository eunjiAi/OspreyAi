package org.myweb.ospreyai.faq.jpa.repository;

import org.myweb.ospreyai.faq.jpa.entity.FaqEntity;
import org.myweb.ospreyai.faq.model.dto.Faq;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.sql.Date;
import java.util.List;

public interface FaqRepositoryCustom {
    int findLastFaqId();

    //상제조회관련 메소드 ------------------------------------
    List<FaqEntity> findFaq(int faqId);
    void deleteFaq (int faqId);
    //목록조회관련 메소드 --------------------------------------
    int findCount ();
    List<FaqEntity> findList (Pageable pageable);
}
