package org.myweb.ospreyai.qna.jpa.repository;

import org.myweb.ospreyai.qna.jpa.entity.QuestionEntity;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface QuestionRepositoryCustom {
    List<QuestionEntity> findSearchTitle(String keyword, Pageable pageable);
    List<QuestionEntity> findSearchContent(String keyword, Pageable pageable);
    List<QuestionEntity> findAllQuestions(Pageable pageable);

    void saveAnswerYn(String answerYn, int qno);


    int findLastQno();
    long countSearchTitle(String keyword);
    long countSearchContent(String keyword);

    long countByqWriter(String userid);

    List<QuestionEntity> findByqWriter(String userid, Pageable pageable);
}
