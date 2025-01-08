package org.myweb.ospreyai.posts.controller;

import java.io.File;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.myweb.ospreyai.posts.model.dto.Reply;
import org.myweb.ospreyai.posts.model.service.PostsService;
import org.myweb.ospreyai.posts.model.service.ReplyService;
import org.myweb.ospreyai.qna.jpa.repository.QuestionRepository;
import org.myweb.ospreyai.qna.model.dto.Question;
import org.myweb.ospreyai.qna.model.service.QuestionService;
import org.myweb.ospreyai.common.FileNameChange;
import org.myweb.ospreyai.common.Paging;
import org.myweb.ospreyai.common.Search;
import org.myweb.ospreyai.qna.model.dto.Answer;
import org.myweb.ospreyai.qna.model.service.AnswerService;
import org.myweb.ospreyai.qna.jpa.entity.AnswerEntity;
import org.myweb.ospreyai.qna.jpa.repository.AnswerRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;
import java.sql.Date;

@Slf4j    //log 객체 선언임, 별도의 로그객체 선언 필요없음, 제공되는 레퍼런스는 log 임
@RequiredArgsConstructor
@RestController
@RequestMapping("/reply")
@CrossOrigin
public class ReplyController {

    @Autowired
    private ReplyService replyService;

    // 답변 등록 처리용
    @PostMapping
    public ResponseEntity replyInsertMethod(@ModelAttribute Reply reply) {
        log.info("replyInsertMethod : " + reply);

        reply.setRdate(new Date(System.currentTimeMillis()));

        // 답변 등록 메소드 호출
        if(replyService.insertReply(reply) > 0) {
            return ResponseEntity.ok().build();  // 성공
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();  // 실패
        }
    }

    //답변 수정 처리용
    @PutMapping("/{replyId}")
    public ResponseEntity replyUpdateMethod(@RequestBody Reply reply) {
        // json 형태로 보내는 값 : @RequestBody
        // formData 로 보내는 값 : @ModelAttribute
        log.info("replyUpdateMethod : " + reply);
        //수정날짜로 변경 처리
        reply.setRdate(new Date(System.currentTimeMillis()));

        if(replyService.updateReply(reply) > 0) {
            //댓글과 대댓글 수정 성공시 다시 상세보기가 보여지게 처리
            return ResponseEntity.ok().build();
        }else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    //답변 삭제 처리용
    @DeleteMapping("/{replyId}")
    public ResponseEntity replyDeleteMethod(
            @PathVariable int replyId) {
        log.info("replyDeleteMethod : " + replyId);

        if(replyService.deleteReply(replyId) > 0) {
            return ResponseEntity.ok().build();
        }else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }


    //


}
