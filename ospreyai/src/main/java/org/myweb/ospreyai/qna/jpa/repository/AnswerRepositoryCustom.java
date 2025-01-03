package org.myweb.ospreyai.qna.jpa.repository;

import org.myweb.ospreyai.member.jpa.entity.MemberEntity;
import org.myweb.ospreyai.qna.jpa.entity.AnswerEntity;
import org.myweb.ospreyai.qna.model.dto.Answer;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface AnswerRepositoryCustom {
    // 질문에 대한 답변 조회
    List<AnswerEntity> findAllAnswer(int qno);
    List<AnswerEntity> findSearchWriter(String keyword, Pageable pageable);
    long countSearchWriter(String keyword);
    int updateAnswer(AnswerEntity entity);
    int findLastAnswerNum();

}
