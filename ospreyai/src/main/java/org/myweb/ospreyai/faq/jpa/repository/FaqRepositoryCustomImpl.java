package org.myweb.ospreyai.faq.jpa.repository;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.myweb.ospreyai.faq.jpa.entity.FaqEntity;
import org.myweb.ospreyai.faq.jpa.entity.QFaqEntity;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class FaqRepositoryCustomImpl implements org.myweb.ospreyai.faq.jpa.repository.FaqRepositoryCustom {
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
    public void deleteFaq(int faqId) {
        // 댓글 먼저 삭제
        queryFactory
                .delete(faq)
                .where(faq.faqQa.eq("A")
                        .and(faq.qnaId.eq(faqId))) // 댓글의 parentId가 원글 ID와 일치
                .execute();

        // 원글 삭제
        queryFactory
                .delete(faq)
                .where(faq.qnaId.eq(faqId)) // 원글 ID
                .execute();

        entityManager.flush();
        entityManager.clear();
    }

//    @Override
//    public int findCount() {
//        int result = (int)queryFactory
//                .selectFrom(faq)
//                .where(faq.faqQa.eq("Q"))
//                .fetchCount();
//        return result;
//    }

//    @Override
//    public List<FaqEntity> findList(Pageable pageable) {
//        return queryFactory
//                .selectFrom(faq)
//                .where(faq.faqQa.eq("Q"))
//                .orderBy(faq.faqId.desc())
//                .offset(pageable.getOffset())
//                .limit(pageable.getPageSize())
//                .fetch();
//    }

    @Override
    public int countByCategory(String category) {
        BooleanExpression isQuestion = faq.faqQa.eq("Q");
        BooleanExpression hasCategory = category.isEmpty() ? null : faq.category.eq(category);

        int result = (int) queryFactory
                .selectFrom(faq)
                .where(isQuestion.and(hasCategory)) // 조건 조합
                .fetchCount();

        return result;
    }

    @Override
    public List<FaqEntity> findByCategory(String category, Pageable pageable) {
        BooleanExpression isQuestion = faq.faqQa.eq("Q");
        BooleanExpression hasCategory = category.isEmpty() ? null : faq.category.eq(category);

        return queryFactory
                .selectFrom(faq)
                .where(isQuestion.and(hasCategory))
                .orderBy(faq.faqId.desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();
    }
}
