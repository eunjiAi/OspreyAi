package org.myweb.ospreyai.qna.model.service;

import java.util.ArrayList;
import java.util.List;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.myweb.ospreyai.qna.jpa.entity.AnswerEntity;
import org.myweb.ospreyai.qna.jpa.repository.AnswerRepository;
import org.myweb.ospreyai.qna.model.dto.Answer;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class AnswerService {

    private final AnswerRepository answerRepository;

    public ArrayList<Answer> selectAnswerList(int qno) {
        // 전달받은 원글번호로 board_ref 컬럼의 값이 일치하는 댓글과 대댓글 조회용
        List<AnswerEntity> entities = answerRepository.findAllAnswer(qno); // 인스턴스를 통해 호출
        ArrayList<Answer> list = new ArrayList<>();
        for (AnswerEntity entity : entities) {
            list.add(entity.toDto());
        }
        return list;
    }


    @Transactional
    public int insertAnswer(Answer answer) {
        log.info("AnswerService answer insert : " + answer);

        answer.setAno(answerRepository.findLastAnswerNum() + 1);

        try {
            // Answer DTO를 AnswerEntity로 변환하여 저장
            answerRepository.save(answer.toEntity());
            return 1;  // 성공
        } catch (Exception e) {
            log.error(e.getMessage());
            return 0;  // 실패
        }
    }

    @Transactional
    public int updateAnswer(Answer answer) {
       return answerRepository.updateAnswer(answer.toEntity());

    }

    @Transactional
    public int deleteAnswer(int ano) {
        //댓글, 대댓글 삭제
        //댓글 삭제시 제약조건에 의해 대댓글도 함께 삭제됨(on delete cascade 설정되어 있음)
        //jpa 제공 메소드 사용
        try {
            answerRepository.deleteById(ano);  //jpa 제공
            return 1;
        }catch (Exception e){
            log.info(e.getMessage());
            return 0;
        }

    }
}
