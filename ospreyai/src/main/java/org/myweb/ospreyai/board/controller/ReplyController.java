package org.myweb.ospreyai.board.controller;

import lombok.extern.slf4j.Slf4j;

import org.myweb.ospreyai.board.model.service.ReplyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

@Slf4j
@Controller
public class ReplyController {
    @Autowired
    ReplyService replyService;

    // 댓글, 대댓글 등록 페이지로 이동 처리용
    @RequestMapping("breplyform.do")
    public ModelAndView moveReplyPage(
            ModelAndView mv,
            @RequestParam("bnum") int boardNum,
            @RequestParam("page") int currentPage) {

        mv.addObject("bnum", boardNum);
        mv.addObject("currentPage", currentPage);
        mv.setViewName("board/boardReplyForm");

        return mv;
    }
}
