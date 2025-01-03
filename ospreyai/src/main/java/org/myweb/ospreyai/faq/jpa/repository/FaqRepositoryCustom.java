package org.myweb.ospreyai.faq.jpa.repository;

import org.myweb.ospreyai.faq.jpa.entity.FaqEntity;
import org.springframework.data.domain.Pageable;



import java.util.List;

public interface FaqRepositoryCustom {
    int findLastFaqId();

    //상제조회관련 메소드 ------------------------------------
    List<FaqEntity> findFaq(int faqId);
    void deleteFaq (int faqId);
    //목록조회관련 메소드 --------------------------------------
    // int findCount ();
    //List<FaqEntity> findList (Pageable pageable);

    int countByCategory(String category);

    List<FaqEntity> findByCategory(String category, Pageable pageable);
}
