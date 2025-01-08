package org.myweb.ospreyai.posts.jpa.repository;


import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.myweb.ospreyai.member.jpa.entity.MemberEntity;
import org.myweb.ospreyai.posts.jpa.entity.QReplyEntity;
import org.myweb.ospreyai.posts.jpa.entity.ReplyEntity;
import org.myweb.ospreyai.posts.jpa.repository.ReplyRepositoryCustom;
import org.myweb.ospreyai.qna.jpa.entity.QAnswerEntity;
import org.myweb.ospreyai.member.jpa.entity.QMemberEntity;
import org.myweb.ospreyai.qna.jpa.entity.AnswerEntity;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class ReplyRepositoryCustomImpl implements ReplyRepositoryCustom {
    private final JPAQueryFactory queryFactory;
    private final EntityManager entityManager; // Native Query 필요 시 사용 가능
    private QReplyEntity reply = QReplyEntity.replyEntity;

    @Override
    public List<ReplyEntity> findAllReply(int postId) {
        return queryFactory
                .selectFrom(reply)
                .where(reply.replyRef.eq(postId)) // 해당 질문에 대한 답변 조회
                .orderBy(reply.replyId.desc()) // 전체 답변 조회
                .fetch();
    }

    @Override
    public int updateReply(ReplyEntity entity) {
        int result = (int)queryFactory
                .update(reply)
                .set(reply.rcontent, entity.getRcontent()) // replyContent 수정
                .where(reply.replyId.eq(entity.getReplyId())) // 조건: replyNum 일치
                .execute();

        entityManager.flush();
        entityManager.clear();

        return result;
    }

    @Override
    public int findLastReplyId() {
        return queryFactory
                .selectFrom(reply)
                .orderBy(reply.replyId.desc())
                .fetch().get(0).getReplyId();  //가장 마지막 등록 글 1개 조회
    }
}
