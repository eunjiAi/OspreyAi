package org.myweb.ospreyai.faq.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.myweb.ospreyai.common.Paging;
import org.myweb.ospreyai.faq.model.dto.Faq;
import org.myweb.ospreyai.faq.model.service.FaqService;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/faq")
@CrossOrigin
public class FaqController {
    private final FaqService faqService;

    // faq글 상세 내용보기 요청 처리용
    @GetMapping("/{faqId}")
    public ResponseEntity<Map<String, Faq>> faqDetailMethod(@PathVariable int faqId) {
        log.info("faqDetailMethod : " + faqId); // 전송받은 값 확인

        try {
            Map<String, Faq> map = faqService.selectFaq(faqId);    // 질문&답글 조회
            log.info("faqDetailMethod : " + map);
            // 조회수 1증가 처리
            faqService.updateAddReadCount(faqId);

            return new ResponseEntity<>(map, HttpStatus.OK);
        }catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // faq 전체 목록보기 요청 처리용 (페이징 처리 : 한 페이지에 10개씩 출력 처리)
    @GetMapping
    public Map<String, Object> faqListMethod(
            @RequestParam(name = "page", defaultValue = "1") int currentPage,
            @RequestParam(name = "limit", defaultValue = "10") int limit) {
        // page : 출력할 페이지, limit : 한 페이지에 출력할 목록 갯수

        // 총 목록갯수 조회해서 총 페이지 수 계산함
        int listCount = faqService.selectListCount();
        // 페이지 관련 항목 계산 처리
        Paging paging = new Paging(listCount, limit, currentPage);
        paging.calculate();

        //JPA 가 제공하는 메소드에 필요한 Pageable 객체 생성함 ---------------------------------------
        Pageable pageable = PageRequest.of(paging.getCurrentPage() - 1, paging.getLimit(),
                Sort.by(Sort.Direction.DESC, "faqId"));

        // 서비스롤 목록 조회 요청하고 결과 받기
        ArrayList<Faq> list = faqService.selectList(pageable);

        Map<String, Object> map = new HashMap<>();
        map.put("list", list);
        map.put("paging", paging);

        return map;
    }

    // 새 faq글(질문,답변) 등록 요청 처리용
    @PostMapping
    public ResponseEntity faqInsertMethod(
            @ModelAttribute Faq faq, @RequestParam("answerContent") String answerContent) {
            log.info("dd : " + answerContent);
        if (faqService.insertfaq(faq) > 0) {
            // 질문글 등록
            Faq faqa = new Faq();
            faqa.setQnaId(faqService.lastFaqId());
            faqa.setFaqWriter(faq.getFaqWriter());
            faqa.setFaqTitle(faq.getFaqTitle() + " 답변");
            faqa.setFaqContent(answerContent);
            faqService.insertfaqa(faqa);
            // 새 faq글 등록 성공시 목록 페이지 내보내기 요청
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    // faq글 삭제 요청 처리용
    @DeleteMapping("/{faqId}")
    public ResponseEntity faqDeleteMethod(@PathVariable int faqId) {
        if (faqService.deletefaq(faqId) > 0) { // faq글 삭제 성공시
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
