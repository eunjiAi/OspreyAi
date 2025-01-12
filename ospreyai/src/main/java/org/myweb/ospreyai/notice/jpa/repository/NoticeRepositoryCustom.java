package org.myweb.ospreyai.notice.jpa.repository;

import org.myweb.ospreyai.notice.jpa.entity.NoticeEntity;
import org.myweb.ospreyai.notice.model.dto.Notice;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.sql.Date;
import java.util.ArrayList;
import java.util.List;

public interface NoticeRepositoryCustom {
    // 공지글 등록시 마지막 다음번호 지정
    int findLastNoticeNo();
    // 제목으로 글 검색
    List<NoticeEntity> findSearchTitle(String keyword, Pageable pageable);
    // 제목으로 글 검색(카운트)
    long countSearchTitle(String keyword);
    // 아이디로 글 검색(마이페이지, 카운트)
    long countBynWriter(String userid);
    // 아이디로 글 검색(마이페이지)
    List<NoticeEntity> findBynWriter(String userid, Pageable pageable);
}
