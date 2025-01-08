package org.myweb.ospreyai.qna.jpa.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.myweb.ospreyai.qna.jpa.entity.QQuestionEntity;
import org.myweb.ospreyai.qna.jpa.entity.QuestionEntity;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class QuestionRepositoryCustomImpl implements QuestionRepositoryCustom {
    private final JPAQueryFactory queryFactory;
    private final EntityManager entityManager; // Native Query 필요 시 사용 가능
    private QQuestionEntity question = QQuestionEntity.questionEntity;

    @Override
    public int findLastQno() {
        QuestionEntity questionEntity = queryFactory
                .select(question)
                .from(question)
                .orderBy(question.qno.desc())
                .fetch().get(0);  //가장 마지막 등록 글 1개 조회
        return questionEntity.getQno();
    }

    @Override
    public List<QuestionEntity> findSearchTitle(String keyword, Pageable pageable) {
        return queryFactory
                .selectFrom(question)
                .where(question.qtitle.like("%" + keyword + "%")) // 제목 검색
                .orderBy(question.qno.desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();
    }

    @Override
    public List<QuestionEntity> findSearchContent(String keyword, Pageable pageable) {
        return queryFactory
                .selectFrom(question)
                .where(question.qcontent.like("%" + keyword + "%")) // 내용 검색
                .orderBy(question.qno.desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();
    }

    @Override
    public List<QuestionEntity> findAllQuestions(Pageable pageable) {
        return queryFactory
                .selectFrom(question)
                .orderBy(question.qno.desc()) // 전체 질문 조회
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();
    }

    @Override
    public void saveAnswerYn(String answerYn, int qno) {
        queryFactory.update(question)
                .set(question.answerYn, answerYn)
                .where(question.qno.eq(qno))
                .execute();
    }

    @Override
    public long countSearchTitle(String keyword) {
        return queryFactory
                .selectFrom(question)
                .where(question.qtitle.containsIgnoreCase(keyword)) // 제목 검색 개수
                .fetchCount();
    }

    @Override
    public long countSearchContent(String keyword) {
        return queryFactory
                .selectFrom(question)
                .where(question.qcontent.containsIgnoreCase(keyword)) // 내용 검색 개수
                .fetchCount();
    }

    @Override
    public long countByqWriter(String userid) {
        return queryFactory
                .selectFrom(question)
                .where(question.qwriter.eq(userid))
                .fetchCount();
    }

    @Override
    public List<QuestionEntity> findByqWriter(String userid, Pageable pageable) {
        return queryFactory
                .selectFrom(question)
                .where(question.qwriter.eq(userid))
                .orderBy(question.qno.desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();
    }
}
