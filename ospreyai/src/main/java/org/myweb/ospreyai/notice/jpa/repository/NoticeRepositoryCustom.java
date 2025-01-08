package org.myweb.ospreyai.notice.jpa.repository;

import org.myweb.ospreyai.notice.jpa.entity.NoticeEntity;
import org.myweb.ospreyai.notice.model.dto.Notice;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.sql.Date;
import java.util.ArrayList;
import java.util.List;

//QueryDSL 사용방법 첫번째 :
//1. QueryDSL 용 커스텀 인터페이스를 만들고, 추가하는 메소드를 추상메소드로 만든다.
public interface NoticeRepositoryCustom {
     int findLastNoticeNo();

    //검색 관련 메소드 ------------------------------------
     List<NoticeEntity> findSearchTitle(String keyword, Pageable pageable);
     long countSearchTitle(String keyword);

    long countBynWriter(String userid);

    List<NoticeEntity> findBynWriter(String userid, Pageable pageable);
//     List<NoticeEntity> findSearchContent(String keyword, Pageable pageable);
//     long countSearchContent(String keyword);
//     List<NoticeEntity> findSearchDate(Date begin, Date end, Pageable pageable);
//     long countSearchDate(Date begin, Date end);
}
