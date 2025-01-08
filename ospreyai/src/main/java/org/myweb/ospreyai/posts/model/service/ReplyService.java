package org.myweb.ospreyai.posts.model.service;

import java.util.ArrayList;
import java.util.List;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.myweb.ospreyai.posts.jpa.entity.ReplyEntity;
import org.myweb.ospreyai.posts.jpa.repository.ReplyRepository;
import org.myweb.ospreyai.posts.jpa.repository.ReplyRepositoryCustom;
import org.myweb.ospreyai.posts.model.dto.Reply;
import org.myweb.ospreyai.posts.model.service.PostsService;
import org.myweb.ospreyai.qna.jpa.entity.AnswerEntity;
import org.myweb.ospreyai.qna.jpa.repository.AnswerRepository;
import org.myweb.ospreyai.qna.model.dto.Answer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class ReplyService {

    @Autowired
    private PostsService postsService;

    private final ReplyRepository replyRepository;


    public ArrayList<Reply> selectReplyList(int id) {
        // 전달받은 원글번호로 board_ref 컬럼의 값이 일치하는 댓글과 대댓글 조회용
        List<ReplyEntity> entities = replyRepository.findAllReply(id); // 인스턴스를 통해 호출
        ArrayList<Reply> list = new ArrayList<>();
        for (ReplyEntity entity : entities) {
            list.add(entity.toDto());
        }
        return list;
    }


    @Transactional
    public int insertReply(Reply reply) {
        log.info("ReplyService reply insert : " + reply);

        if (replyRepository.findLastReplyId() == 0) {
            reply.setReplyId(1);
        } else {
            reply.setReplyId(replyRepository.findLastReplyId() + 1);
        }

        try {
            // Answer DTO를 AnswerEntity로 변환하여 저장
            replyRepository.save(reply.toEntity());
            return 1;  // 성공
        } catch (Exception e) {
            log.error(e.getMessage());
            return 0;  // 실패
        }
    }

    @Transactional
    public int updateReply(Reply reply) {
        return replyRepository.updateReply(reply.toEntity());

    }

    @Transactional
    public int deleteReply(int replyId) {
        // 답변 삭제
        //jpa 제공 메소드 사용
        try {
            replyRepository.deleteById(replyId);  //jpa 제공
            return 1;
        }catch (Exception e){
            log.info(e.getMessage());
            return 0;
        }

    }
}
