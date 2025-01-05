package org.myweb.ospreyai.member.controller;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.myweb.ospreyai.common.Paging;
import org.myweb.ospreyai.common.Search;
import org.myweb.ospreyai.member.model.dto.Member;
import org.myweb.ospreyai.member.model.service.MemberService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.sql.Date;
import java.util.*;

@Slf4j
@RestController
@RequestMapping("/member")
@RequiredArgsConstructor
@CrossOrigin
public class MemberController {
	private final MemberService memberService;

	private final BCryptPasswordEncoder bcryptPasswordEncoder;

	//ajax 통신으로 가입할 회원의 아이디(유니크) 중복 검사 요청 처리용 메소드
	@PostMapping("/memberidchk")
	public ResponseEntity<String> dupCheckIdMethod(@RequestParam("memberId") String memberId) {
		if(memberService.selectCheckId(memberId) == 0){
			return new ResponseEntity<String>("ok", HttpStatus.OK);
		}else{
			return new ResponseEntity<String>("dup", HttpStatus.OK);
		}
	}

	// 회원 가입
	@PostMapping
	public ResponseEntity memberInsertMethod(
			@ModelAttribute Member member) {

		//UUID 자동 생성
		member.setUuid(UUID.randomUUID().toString());
		log.info("생성된 UUID : " + member.getUuid());

		// 패스워드 암호화 처리
		member.setPw(bcryptPasswordEncoder.encode(member.getPw()));

		//가입정보 추가 입력 처리
		member.setLoginOk("Y");
		member.setAdminYn("N");
		log.info("회원가입 정보 : " + member);

		memberService.insertMember(member);
		return ResponseEntity.status(HttpStatus.OK).build();

	}

	// 닉네임 가져오기
	@GetMapping("/nickname")
	public ResponseEntity<String> getNicknameByUserId(@RequestParam String userid) {
		String nickname = memberService.getNicknameByUserId(userid);
		if (nickname != null) {
			return ResponseEntity.ok(nickname);
		} else {
			return ResponseEntity.notFound().build();
		}
	}

	// 마이페이지
	@GetMapping("/mypage/{userId}")
	public ResponseEntity<Member> memberDetailMethod(@PathVariable String userId) {
		log.info("마이페이지 회원 아이디 : " + userId);

		Member member = memberService.selectMember(userId);
		log.info("마이페이지 회원 정보 : " + member);

		if(member != null){
			return ResponseEntity.status(HttpStatus.OK).body(member);
		} else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
		}

	}

	//회원정보 수정
	@PutMapping("/mypage/{uuid}")
	public ResponseEntity memberUpdateMethod(
		    @RequestBody Member member) {
		Member preMember = memberService.selectMember(member.getMemberId());

		member.setUuid(preMember.getUuid());
		member.setAdminYn(preMember.getAdminYn());
		member.setPw(preMember.getPw());
		member.setFaceId(preMember.getFaceId());
		member.setFaceVector(preMember.getFaceVector());
		member.setEnrollDate(preMember.getEnrollDate());
		member.setLastModified(new Date(System.currentTimeMillis()));
		member.setLoginOk(preMember.getLoginOk());

		try {
			memberService.updateMember(member); // 회원정보 수정 성공시
			return ResponseEntity.ok().build();
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
		}
	}

	// 비밀번호 체크(비밀번호 변경시)
	@PostMapping("/mypage/chkpw/{userId}")
	public ResponseEntity<?> pwCheckIdMethod(@PathVariable String userId, @RequestBody Map<String, String> request) {
		String inputPassword = request.get("pw");
		boolean pwChk = memberService.checkPassword(userId, inputPassword);

		if (pwChk) {
			return ResponseEntity.ok().build();
		} else {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
	}


	// 회원 탈퇴(삭제) 요청 처리용
	@DeleteMapping("/{uuid}")
	public ResponseEntity memberDeleteMethod(@PathVariable String uuid) {
		try {
			memberService.deleteMember(uuid);
			return ResponseEntity.ok().build();
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}
	
	// 관리자용 기능 *********************************************************
	// 회원 목록 보기 요청 처리용 (페이징 처리 포함)
//	@GetMapping
//	public ResponseEntity<Map<String, Object>> memberListMethod(
//			//ajax 통신에서는 반환형을 ResponseEntity<객체자료형> 을 사용하지 않아도 됨
//			//List 를 그대로 보내도 됨 => 뷰측에서 json 데이터로 받으면 됨
//			@RequestParam(name = "page", defaultValue = "1") int currentPage,
//			@RequestParam(name = "limit", defaultValue = "10") int limit) {
//		// page : 출력할 페이지, limit : 한 페이지에 출력할 목록 갯수
//
//		// 총 목록갯수 조회해서 총 페이지 수 계산함
//		int listCount = memberService.selectListCount();
//		// 페이지 관련 항목 계산 처리
//		Paging paging = new Paging(listCount, limit, currentPage, "mlist.do");
//		paging.calculate();
//
//		//JPA 가 제공하는 메소드에 필요한 Pageable 객체 생성함 ---------------------------------------
//		Pageable pageable = PageRequest.of(paging.getCurrentPage() - 1, paging.getLimit(),
//				Sort.by(Sort.Direction.DESC, "enrollDate"));
//
//		try {
//			// 서비스롤 목록 조회 요청하고 결과 받기
//			List<Member> members = memberService.selectList(pageable);
//			Map<String, Object> map = new HashMap<>();
//			map.put("list", members);
//			map.put("paging", paging);
//			return new ResponseEntity<Map<String, Object>>(map, HttpStatus.OK);
//		} catch (Exception e) {
//			e.printStackTrace();
//			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
//		}
//	}

	//회원 로그인 제한/허용 처리용 메소드
//	@PutMapping("/loginok/{userId}/{loginOk}")
//	public ResponseEntity<String> changeLoginOKMethod(
//			@PathVariable String userId,
//			@PathVariable String loginOk,
//			@RequestBody Member member) {
//		log.info("loginok : " + userId + ", " + loginOk);
//
//		try {
//			memberService.updateLoginOK(userId, loginOk);
//			return new ResponseEntity(HttpStatus.OK);
//		} catch (Exception e) {
//			e.printStackTrace();
//			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
//		}
//	}
	
	//관리자용 검색 기능 요청 처리용
//	@GetMapping("/search")
//	public ResponseEntity<Map> memberSearchMethod(
//			HttpServletRequest request) {
//		//전송 온 값 꺼내기
//		String action = request.getParameter("action");
//		log.info("action : " + action);
//		//필요한 변수 선언
//		String keyword = null, begin = null, end = null;
//		Search search = new Search();
//
//		if(action.equals("enroll")) {
//			begin = request.getParameter("begin");
//			end = request.getParameter("end");
//			search.setBegin(Date.valueOf(begin));
//			search.setEnd(Date.valueOf(end));
//			log.info("search begin : " + begin);
//		}else {
//			keyword = request.getParameter("keyword");
//			log.info("keyword : " + keyword);
//		}
//
//		//검색 결과에 대한 페이징 처리
//		int currentPage = 1;
//		//페이지로 전송온 값이 있다면
//		if(request.getParameter("page") != null) {
//			currentPage = Integer.parseInt(request.getParameter("page"));
//		}
//
//		//한 페이지에 출력할 목록 갯수 지정
//		int limit = 10;
//		//페이지로 전송온 값이 있다면
//		if(request.getParameter("limit") != null) {
//			limit = Integer.parseInt(request.getParameter("limit"));
//		}
//
//		//총 페이지수 계산을 위해 겸색 결과가 적용된 총 목록 갯수 조회
//		int listCount = 0;
//		switch(action) {
//		case "id":			listCount = memberService.selectSearchUserIdCount(keyword);		break;
//		case "gender":		listCount = memberService.selectSearchGenderCount(keyword);		break;
//		case "age":		listCount = memberService.selectSearchAgeCount(Integer.parseInt(keyword));		break;
//		case "enroll":	listCount = memberService.selectSearchEnrollDateCount(search.getBegin(), search.getEnd());		break;
//		case "lok":		listCount = memberService.selectSearchLoginOKCount(keyword);		break;
//		}
//
//		//페이징 계산 처리
//		Paging paging = new Paging(listCount, limit, currentPage, "msearch.do");
//		paging.calculate();
//
//		//JPA 가 제공하는 메소드에 필요한 Pageable 객체 생성함 ---------------------------------------
//		Pageable pageable = PageRequest.of(paging.getCurrentPage() - 1, paging.getLimit(),
//				Sort.by(Sort.Direction.DESC, "enrollDate"));
//
//		//겸색별 목록 조회 요청
//		ArrayList<Member> list = null;
//
//		switch(action) {
//		case "id":
//					list = memberService.selectSearchUserId(keyword, pageable);		break;
//		case "gender":
//					list = memberService.selectSearchGender(keyword, pageable);		break;
//		case "age":
//					list = memberService.selectSearchAge(Integer.parseInt(keyword), pageable);		break;
//		case "enroll":	list = memberService.selectSearchEnrollDate(search.getBegin(), search.getEnd(), pageable);		break;
//		case "lok":
//					list = memberService.selectSearchLoginOK(keyword, pageable);		break;
//		}
//		log.info("list : " + list);
//
//		Map<String, Object> map = new HashMap<>();
//		if(list != null && list.size() > 0) {
//			map.put("list", list);
//			map.put("paging", paging);
//			map.put("currentPage", currentPage);
//			map.put("limit", limit);
//			map.put("action", action);
//
//			if(keyword != null) {
//				map.put("keyword", keyword);
//			}else {
//				map.put("begin", begin);
//				map.put("end", end);
//			}
//
//			return new ResponseEntity(map, HttpStatus.OK);
//		}else {
//			return new ResponseEntity(map.put("error", "검색실패"), HttpStatus.BAD_REQUEST);
//		}
//
//	}

} // MemberController.class



















