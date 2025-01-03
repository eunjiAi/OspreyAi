package org.myweb.ospreyai.qna.controller;

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
import org.myweb.ospreyai.qna.jpa.repository.QuestionRepository;
import org.myweb.ospreyai.qna.model.dto.Answer;
import org.myweb.ospreyai.qna.model.dto.Question;
import org.myweb.ospreyai.qna.model.service.AnswerService;
import org.myweb.ospreyai.qna.model.service.QuestionService;
import org.myweb.ospreyai.common.FileNameChange;
import org.myweb.ospreyai.common.Paging;
import org.myweb.ospreyai.common.Search;

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

@Slf4j    //log 객체 선언임, 별도의 로그객체 선언 필요없음, 제공되는 레퍼런스는 log 임
@RequiredArgsConstructor
@RestController
@RequestMapping("/question")
@CrossOrigin			//다른 port 에서 오는 요청을 처리하기 위함
public class QuestionController {

    @Autowired
    private QuestionService questionService;
    @Autowired
    private AnswerService answerService;

    @GetMapping
    public Map<String, Object> QuestionListMethod(
            @RequestParam(name = "page", defaultValue = "1") int currentPage,
            @RequestParam(name = "limit", defaultValue = "10") int limit) {
        // page : 출력할 페이지, limit : 한 페이지에 출력할 목록 갯수

        // 총 목록갯수 조회해서 총 페이지 수 계산함
        int listCount = questionService.selectListCount();
        // 페이지 관련 항목 계산 처리
        Paging paging = new Paging(listCount, limit, currentPage, "/question");
        paging.calculate();

        //JPA 에 사용될 Pageable 객체 생성
        Pageable pageable = PageRequest.of(
                paging.getCurrentPage() - 1,
                paging.getLimit(),
                Sort.by(Sort.Direction.DESC, "qno"));

        // 서비스롤 목록 조회 요청하고 결과 받기
        ArrayList<Question> list = questionService.selectList(pageable);
        Map<String, Object> map = new HashMap<>();
        map.put("list", list);
        map.put("paging", paging);

        return map;
    }

    // 게시글 원글 상세 내용보기 요청 처리용
    @GetMapping("/detail/{qno}")
    public ResponseEntity<Map> questionDetailMethod(@PathVariable("qno") int qno) {
        log.info("questionDetailMethod : " + qno); // 전송받은 값 확인

        Question question = questionService.selectQuestion(qno);


        // 대답 컬럼이 완성되면 추가할 것.
        //해당 원글에 대한 답변도 같이 조회
        ArrayList<Answer> answerList = answerService.selectAnswerList(qno);

        Map<String, Object> map = new HashMap<>();
        map.put("question", question);
        map.put("answerList", answerList);
        // 대답 완성되면 다시 추가 map.put("list", answerList);

        return new ResponseEntity<>(map, HttpStatus.OK);
    }

    // 새 질문 원글 등록 요청 처리용 (파일 업로드 기능 x)
    @PostMapping()
    public ResponseEntity questionInsertMethod(
            @ModelAttribute Question question) {
        log.info("questionInsertMethod : " + question); // 전송온 값 저장 확인

        question.setAnswerYn("N");

        if (questionService.insertQuestion(question) > 0) {
            // 새 게시 원글 등록 성공시 목록 페이지 내보내기 요청
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }


    } // binsert.do

    // 게시글 원글 삭제 요청 처리용
    // 원글 삭제시 외래키(foreign key) 제약조건의 삭제룰(on delete cascade)에 의해 댓글과 대댓글도 함께 삭제됨
    @DeleteMapping("/{qno}")
    public ResponseEntity questionDeleteMethod(
            @PathVariable int qno) {
        Question question = new Question();
        question.setQno(qno);
        if (questionService.deleteQuestion(question) > 0) {
            // 공지글 삭제 성공시
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 질문 원글 수정 요청 처리용 (파일 업로드 기능 x)
    @PutMapping("/{qno}")
    public ResponseEntity QuestionoriginUpdateMethod(
            @ModelAttribute Question question) {
        log.info("QuestionoriginUpdateMethod : " + question); // 전송온 값 확인


        // answer_yn 을 강제로 설정
        question.setAnswerYn("N");
        //현재 날짜를 게시글 등록 날짜로 수정한다면
        question.setQdate(new java.sql.Date(System.currentTimeMillis()));

        if (questionService.updateOrigin(question) > 0) { // 게시원글 수정 성공시
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    // 질문글 제목 검색용 (페이징 처리 포함)
    @GetMapping("/search/title")
    public ResponseEntity<Map> questionSearchTitleMethod(
            @RequestParam("action") String action,
            @RequestParam("keyword") String keyword,
            @RequestParam(name = "page", defaultValue = "1") int currentPage,
            @RequestParam(name = "limit", defaultValue = "10") int limit) {

        // page : 출력할 페이지, limit : 한 페이지에 출력할 목록 갯수

        // 검색결과가 적용된 총 목록갯수 조회해서 총 페이지 수 계산함
        int listCount = questionService.selectSearchTitleCount(keyword);
        // 페이지 관련 항목 계산 처리
        Paging paging = new Paging(listCount, limit, currentPage, "/search/title");
        paging.calculate();

        //JPA 가 사용할 Pageable 객체 생성
        Pageable pageable = PageRequest.of(paging.getCurrentPage() - 1,
                paging.getLimit(), Sort.by(Sort.Direction.DESC, "qno"));

        // 서비스롤 목록 조회 요청하고 결과 받기
        ArrayList<Question> list = questionService.selectSearchTitle(keyword, pageable);
        Map<String, Object> map = new HashMap<String, Object>();

        if (list != null && list.size() > 0) {
            map.put("list", list);
            map.put("paging", paging);

            return new ResponseEntity<Map>(map, HttpStatus.OK);
        } else {
            map.put("message", action + "에 대한 " + keyword + " 검색 결과가 존재하지 않습니다.");
            return new ResponseEntity<Map>(map, HttpStatus.BAD_REQUEST);
        }
    }

    // 질문글 내용 검색용 (페이징 처리 포함)
    @GetMapping("/search/content")
    public ResponseEntity<Map> questionSearchContentMethod(
            @RequestParam("action") String action,
            @RequestParam("keyword") String keyword,
            @RequestParam(name = "page", defaultValue = "1") int currentPage,
            @RequestParam(name = "limit", defaultValue = "10") int limit) {

        // page : 출력할 페이지, limit : 한 페이지에 출력할 목록 갯수

        // 검색결과가 적용된 총 목록갯수 조회해서 총 페이지 수 계산함
        int listCount = questionService.selectSearchContentCount(keyword);
        // 페이지 관련 항목 계산 처리
        Paging paging = new Paging(listCount, limit, currentPage, "/search/content");
        paging.calculate();

        //JPA 가 사용할 Pageable 객체 생성
        Pageable pageable = PageRequest.of(paging.getCurrentPage() - 1,
                paging.getLimit(), Sort.by(Sort.Direction.DESC, "qno"));

        // 서비스롤 목록 조회 요청하고 결과 받기
        ArrayList<Question> list = questionService.selectSearchContent(keyword, pageable);
        Map<String, Object> map = new HashMap<String, Object>();

        if (list != null && list.size() > 0) {
            map.put("list", list);
            map.put("paging", paging);

            return new ResponseEntity<Map>(map, HttpStatus.OK);
        } else {
            map.put("message", action + "에 대한 " + keyword + " 검색 결과가 존재하지 않습니다.");
            return new ResponseEntity<Map>(map, HttpStatus.BAD_REQUEST);
        }
    }




}
