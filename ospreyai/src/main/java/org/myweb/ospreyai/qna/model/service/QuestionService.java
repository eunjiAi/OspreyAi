package org.myweb.ospreyai.qna.model.service;

import java.math.BigDecimal;
import java.sql.Date;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.myweb.ospreyai.qna.jpa.entity.QuestionEntity;
import org.myweb.ospreyai.qna.jpa.repository.QuestionRepository;
import org.myweb.ospreyai.qna.model.dto.Question;
import org.myweb.ospreyai.common.Search;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class QuestionService {

    private final QuestionRepository questionRepository;

    public int selectListCount() {
        //jpa 가 제공 : count() 사용
        return (int)questionRepository.count();
    }

    public ArrayList<Question> selectList(Pageable pageable) {
        //jpa 가 제공 : findAll(Pageable) : Page<Entity>
        Page<QuestionEntity> page = questionRepository.findAll(pageable);
        ArrayList<Question> list = new ArrayList<>();
        for(QuestionEntity entity : page){
            list.add(entity.toDto());
        }
        return list;
    }

    public Question selectQuestion(int qno) {
        //jpa 가 제공하는 메소드 사용 : findById(id로 지정한 프로퍼티변수의 값) : Optional<Entity> 리턴
        Optional<QuestionEntity> optionalQuestion = questionRepository.findById(qno);
        return optionalQuestion.get().toDto();
    }

    @Transactional
    public int insertQuestion(Question question) {
        //추가한 메소드 사용 : 현재 마지막 게시글번호 조회용
        question.setQno(questionRepository.findLastQno() + 1);
        log.info("QuestionService question insert : " + question);
        //jpa 가 제공하는 메소드 사용 : save(Entity) => 성공하면 Entity, 실패하면 null 임
        // => pk 에 해당되는 글번호가 테이블에 없으면 insert 문 실행함
        // => pk 에 해당되는 글번호가 테이블에 있으면 update 문 실행함
        try {
            questionRepository.save(question.toEntity());
            return 1;
        }catch (Exception e){
            log.error(e.getMessage());
            return 0;
        }
    }

    @Transactional
    public int deleteQuestion(Question question) {
        try {
            questionRepository.deleteById(question.getQno());  //jpa 제공
            return 1;
        }catch (Exception e){
            log.error(e.getMessage());
            return 0;
        }
    }

    @Transactional
    public int updateOrigin(Question question) {
        //jpa 가 제공하는 메소드 사용 : save(Entity) : Entity
        try {
            questionRepository.save(question.toEntity());
            return 1;
        }catch (Exception e){
            log.error(e.getMessage());
            return 0;
        }
    }

    public int selectSearchTitleCount(String keyword) {
        // jpa 가 제공하는 전체 목록 갯수 조회하는 count() 로는 해결이 안됨
        // 추가 작성해서 사용 : 리포지토리 인터페이스에 추가 작성하
        return (int)questionRepository.countSearchTitle(keyword);
    }

    public int selectSearchContentCount(String keyword) {
        // jpa 가 제공하는 전체 목록 갯수 조회하는 count() 로는 해결이 안됨
        // 추가 작성해서 사용 : 리포지토리 인터페이스에 추가 작성하
        return (int)questionRepository.countSearchContent(keyword);
    }

    public ArrayList<Question> selectSearchTitle(String keyword, Pageable pageable) {
        //jpa 가 제공하는 findAll(pageable) 메소드가 있으나, 키워드도 함께 전달되는 메소드는 없음
        //추가해서 사용함 : BoardRepository 인터페이스에 메소드 추가함
        List<QuestionEntity> page = questionRepository.findSearchTitle(keyword, pageable);
        ArrayList<Question> list = new ArrayList<>();
        for(QuestionEntity entity : page){
            list.add(entity.toDto());
        }
        return list;
    }

    public ArrayList<Question> selectSearchContent(String keyword, Pageable pageable) {
        //jpa 가 제공하는 findAll(pageable) 메소드가 있으나, 키워드도 함께 전달되는 메소드는 없음
        //추가해서 사용함 : BoardRepository 인터페이스에 메소드 추가함
        List<QuestionEntity> page = questionRepository.findSearchContent(keyword, pageable);
        ArrayList<Question> list = new ArrayList<>();
        for(QuestionEntity entity : page){
            list.add(entity.toDto());
        }
        return list;
    }


    public void updateanswerYn(String answerYn, int qno) {

        questionRepository.saveAnswerYn(answerYn, qno);



    }
}
