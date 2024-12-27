package org.myweb.ospreyai.faq.jpa.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.myweb.ospreyai.faq.jpa.entity.FaqEntity;
import org.myweb.ospreyai.faq.jpa.entity.QFaqEntity;
import org.myweb.ospreyai.notice.jpa.entity.NoticeEntity;
import org.myweb.ospreyai.notice.jpa.entity.QNoticeEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class FaqRepositoryCustomImpl implements FaqRepositoryCustom {
    private final JPAQueryFactory queryFactory;

    private final EntityManager entityManager;
    private QFaqEntity faq = QFaqEntity.faqEntity;

    @Override
    public int findLastFaqId() {
        FaqEntity faqEntity = queryFactory
                .selectFrom(faq)         //select * from faq
                .orderBy(faq.faqId.desc())
                .fetch().get(0);    //내림차순정렬한 faq목록의 첫번째 행 선택 == 가장 최근 등록된 faq글
        return faqEntity.getFaqId();
    }

    @Override
    public List<FaqEntity> findFaq(int faqId) {
        return queryFactory
                .selectFrom(faq)
                .where(faq.qnaId.eq(faqId))
                .fetch();
    }

    @Override
    public void deleteFaq(int faqId) {      // 원글,답글 삭제
        queryFactory
                .delete(faq)
                .where(faq.qnaId.eq(faqId)) // 조건 : faqId 일치
                .execute();

        entityManager.flush();
        entityManager.clear();
    }

    @Override
    public int findCount() {
        int result = (int)queryFactory
                .selectFrom(faq)
                .where(faq.category.eq("Q"))
                .fetchCount();
        return result;
    }

    @Override
    public List<FaqEntity> findList(Pageable pageable) {
        return queryFactory
                .selectFrom(faq)
                .where(faq.category.eq("Q"))
                .orderBy(faq.faqId.desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();
    }
}
