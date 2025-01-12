package org.myweb.ospreyai.notice.jpa.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.myweb.ospreyai.notice.jpa.entity.NoticeEntity;
import org.myweb.ospreyai.notice.jpa.entity.QNoticeEntity;
import org.myweb.ospreyai.notice.model.dto.Notice;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.util.ArrayList;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class NoticeRepositoryCustomImpl implements NoticeRepositoryCustom {

    private final JPAQueryFactory queryFactory;
    private final EntityManager entityManager;
    private QNoticeEntity notice = QNoticeEntity.noticeEntity;

    @Override
    public int findLastNoticeNo() {
        NoticeEntity noticeEntity = queryFactory
                .selectFrom(notice)
                .orderBy(notice.noticeNo.desc())
                .fetch().get(0);
        return noticeEntity.getNoticeNo();
    }

    @Override
    public List<NoticeEntity> findSearchTitle(String keyword, Pageable pageable) {
        return queryFactory
                .selectFrom(notice)
                .where(notice.nTitle.like("%" + keyword + "%"))
                .orderBy(notice.noticeNo.desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();
    }

    @Override
    public long countSearchTitle(String keyword) {
        return queryFactory
                .selectFrom(notice)
                .where(notice.nTitle.like("%" + keyword + "%"))
                .fetchCount();
    }

    @Override
    public List<NoticeEntity> findBynWriter(String userid, Pageable pageable) {
        // 단순히 조건에 맞는 공지사항 목록만 반환
        return queryFactory
                .selectFrom(notice)
                .where(notice.nWriter.eq(userid))
                .orderBy(notice.noticeNo.desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();
    }


    @Override
    public long countBynWriter(String userid) {
        // null을 반환하지 않고, 해당 userid에 대한 공지사항 개수를 반환
        return queryFactory
                .selectFrom(notice)
                .where(notice.nWriter.eq(userid))
                .fetchCount();  // fetchCount()로 해당 조건에 맞는 레코드 수를 반환
    }
}
