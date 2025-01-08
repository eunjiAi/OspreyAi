package org.myweb.ospreyai.posts.jpa.repository;

import org.myweb.ospreyai.member.jpa.entity.MemberEntity;
import org.myweb.ospreyai.posts.jpa.entity.ReplyEntity;
import org.myweb.ospreyai.qna.jpa.entity.AnswerEntity;
import org.myweb.ospreyai.qna.model.dto.Answer;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ReplyRepositoryCustom {
    List<ReplyEntity> findAllReply(int postId);
    int updateReply(ReplyEntity entity);
    int findLastReplyId();
}
