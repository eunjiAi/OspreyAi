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

	//ajax 통신으로 가입할 회원의 이메일(유니크) 중복 검사 요청 처리용 메소드
	@PostMapping("/emailchk")
	public ResponseEntity<String> dupCheckIdMethod(@RequestParam("email") String email) {
		if(memberService.selectCheckEmail(email) == 0){
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
		member.setSignType("direct");
		log.info("회원가입 정보 : " + member);

		memberService.insertMember(member);
		return ResponseEntity.status(HttpStatus.OK).build();

	}

	@GetMapping("/nickname")
	public ResponseEntity<String> getNicknameByUserId(@RequestParam String userid) {
		String nickname = memberService.getNicknameByUserId(userid);
		if (nickname != null) {
			return ResponseEntity.ok(nickname);
		} else {
			return ResponseEntity.notFound().build();
		}
	}
	// '내 정보 보기' 클릭시 회원 정보 조회 요청 처리용 메소드
//	@GetMapping("/myinfo/{userId}")
//	public ResponseEntity<Member> memberDetailMethod(@PathVariable String userId) {
//		log.info("memberDetailMethod : " + userId);
//
//		// 서비스 메소드로 아이디 전달하고, 해당 회원 정보 받기
//		Member member = memberService.selectMember(userId);
//		log.info("member : " + member);
//
//		// 저장된 사진파일명이 "userId_파일명.확장자"이므로, 프론트로 나갈때는 "userId_"를 제외시킴
//		if(member.getPhotoFileName() != null) {
//			member.setPhotoFileName(member.getPhotoFileName().split("_")[1]);
//			log.info("photoFilename : " + member.getPhotoFileName());
//		}
//
//		if(member != null){
//			return ResponseEntity.status(HttpStatus.OK).body(member);
//		} else {
//			return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
//		}
//
//	}

//	@PutMapping("/{userId}")
//	public ResponseEntity memberUpdateMethod(
//		    @ModelAttribute Member member,
//			@RequestParam(name="photofile", required=false) MultipartFile mfile,
//		 	@RequestParam("originalUserPwd") String originalUserPwd,
//		 	@RequestParam("ofile") String originalFileName) {
//		log.info("put update member : " + member); // 전송온 값 확인
//
//		if (member.getUserPwd() != null && member.getUserPwd().length() > 0) { // 암호가 변경되었다면
//			// 패스워드 암호화 처리
//			member.setUserPwd(bcryptPasswordEncoder.encode(member.getUserPwd()));
//			log.info("after encode : " + member.getUserPwd() + ", length : " + member.getUserPwd().length());
//
//		} else { // 암호가 변경되지 않았다면 userPwd == null
//			member.setUserPwd(originalUserPwd); // 원래 패스워드로 기록 저장
//		}
//
//		// 회원가입시 사진 파일첨부가 있을 경우, 저장 폴더 경로 지정 -----------------------------------
//		String savePath = uploadDir + "/photo";
//		log.info("savePath : " + savePath);
//
//		File directory = new File(savePath);
//		if(!directory.exists()){
//			directory.mkdirs();
//		}
//
//			// 수정된 첨부파일이 있다면
//		if (mfile == null && !mfile.isEmpty()) {
//			// 전송온 파일 이름 추출함
//			String fileName = mfile.getOriginalFilename();
//
//			// 이전 파일명과 새로 첨부된 파일명이 다른지 확인
//			if (!fileName.equals(originalFileName)) {
//
//				// 여러 회원이 업로드한 사진파일명이 중복될 경우를 대비해서 저장파일명 이름바꾸기함
//				// 바꿀 파일이름은 개발자가 정함
//				// userId 가 기본키이므로 중복이 안됨 => userId_filename 저장형태로 정해봄
//				String renameFileName = member.getUserId() + "_" + fileName;
//
//				// 저장 폴더에 저장 처리
//				if (fileName != null && fileName.length() > 0) {
//					try {
//						// mfile.transferTo(new File(savePath + "\\" + fileName));
//						// 저장시 바뀐 이름으로 저장 처리함
//						mfile.transferTo(new File(savePath + "\\" + renameFileName));
//					} catch (Exception e) {
//						// 첨부파일 저장시 에러 발생
//						e.printStackTrace();
//						return new ResponseEntity<String>("첨부파일 업로드 실패", HttpStatus.BAD_REQUEST);
//					}
//				}
//
//				// 파일 업로드 정상 처리되었다면
//				// member.setPhotoFileName(fileName); //db 저장시에는 원래 이름으로 기록함
//				member.setPhotoFileName(renameFileName); // db 저장시에는 변경된 이름으로 기록함
//			} // 첨부파일이 있을 때
//		} else { // 수정된 첨부파일과 원래 첨부파일명이 같은 경우 (폴더에 저장된 상태임)
//			member.setPhotoFileName(member.getUserId() + "_" + originalFileName);
//		}
//
//		//마지막 수정날짜 저장 처리
//		member.setLastModified(new Date(System.currentTimeMillis()));
//
//		try {
//			memberService.updateMember(member); // 회원정보 수정 성공시
//			return ResponseEntity.ok().build();
//		} catch (Exception e) {
//			e.printStackTrace();
//			return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
//		}
//	}

	// 회원 탈퇴(삭제) 요청 처리용
	// 요청 행위가 delete (쿼리문) 이면 전송방식이 delete 이고, 매핑은 @DeleteMapping 으로 지정함
	// 탈퇴처리의 요청 행위가 update (쿼리문, 탈퇴여부 컬럼을 Y로 변경 등) 이면, 전송방식이 put 임
	// @PutMapping 으로 지정함 => 컨트롤러 안에 같은 매핑이 여러 개이면 하위 url 을 추가해서 구분 지정함
//	@DeleteMapping("/{userId}")
//	public ResponseEntity memberDeleteMethod(@PathVariable String userId) {
//		try {
//			memberService.deleteMember(userId);
//			return ResponseEntity.ok().build();
//		} catch (Exception e) {
//			e.printStackTrace();
//			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
//		}
//	}
	
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



















