package org.myweb.ospreyai.qna.jpa.repository;


import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.myweb.ospreyai.member.jpa.entity.MemberEntity;
import org.myweb.ospreyai.qna.jpa.entity.QAnswerEntity;
import org.myweb.ospreyai.member.jpa.entity.QMemberEntity;
import org.myweb.ospreyai.qna.jpa.entity.AnswerEntity;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class AnswerRepositoryCustomImpl implements AnswerRepositoryCustom {
    private final JPAQueryFactory queryFactory;
    private final EntityManager entityManager; // Native Query 필요 시 사용 가능
    private QAnswerEntity answer = QAnswerEntity.answerEntity;

    @Override
    public List<AnswerEntity> findAllAnswer(int qno) {
        return queryFactory
                .selectFrom(answer)
                .where(answer.answerRef.eq(qno)) // 해당 질문에 대한 답변 조회
                .orderBy(answer.ano.desc()) // 전체 답변 조회
                .fetch();
    }

    @Override
    public int findLastAnswerNum() {
        return queryFactory
                .selectFrom(answer)
                .orderBy(answer.ano.desc())
                .fetch().get(0).getAno();  //가장 마지막 등록 글 1개 조회
    }

    @Override
    public List<AnswerEntity> findSearchWriter(String keyword, Pageable pageable) {
        return queryFactory
                .selectFrom(answer) // QAnswerEntity 사용
                .where(answer.aWriter.like("%" + keyword + "%")) // 유저 아이디 조건 추가
                .orderBy(answer.ano.desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();
    }

    @Override
    public long countSearchWriter(String keyword) {
        return queryFactory
                .selectFrom(answer)
                .where(answer.aWriter.containsIgnoreCase(keyword)) // 제목 검색 개수
                .fetchCount();
    }

    @Override
    public int updateAnswer(AnswerEntity entity) {
        int result = (int)queryFactory
                .update(answer)
                .set(answer.aTitle, entity.getATitle()) // replyTitle 수정
                .set(answer.aContent, entity.getAContent()) // replyContent 수정
                .where(answer.ano.eq(entity.getAno())) // 조건: replyNum 일치
                .execute();

        entityManager.flush();
        entityManager.clear();

        return result;
    }
}
