package org.myweb.ospreyai.member.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.myweb.ospreyai.common.Paging;
import org.myweb.ospreyai.member.jpa.entity.MemberEntity;
import org.myweb.ospreyai.member.model.dto.Member;
import org.myweb.ospreyai.member.model.service.EmailService;
import org.myweb.ospreyai.member.model.service.MemberService;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@Slf4j
@RestController
@RequestMapping("/member")
@RequiredArgsConstructor
@CrossOrigin
public class MemberController {
    private final MemberService memberService;
    private final EmailService emailService;
    private final BCryptPasswordEncoder bcryptPasswordEncoder;

    //ajax 통신으로 가입할 회원의 아이디(유니크) 중복 검사 요청 처리용 메소드
    @PostMapping("/memberidchk")
    public ResponseEntity<String> dupCheckIdMethod(@RequestParam("memberId") String memberId) {
        if (memberService.selectCheckId(memberId) == 0) {
            return new ResponseEntity<String>("ok", HttpStatus.OK);
        } else {
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
        log.info("회원 가입 정보 member : " + member);
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

    // 아이디 찾기
    @GetMapping("/findId")
    public ResponseEntity<?> findIdMethod(
            @RequestParam("name") String name,
            @RequestParam("email") String email) {
        Member member = memberService.findByNameAndEmail(name, email);

        if (member != null) {
            return ResponseEntity.ok(Collections.singletonMap("id", member.getMemberId()));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Collections.singletonMap("message", "아이디를 찾을 수 없습니다."));
        }
    }

    // 비밀번호 변경
    @PostMapping("/resetPassword")
    public ResponseEntity<?> sendTemporaryPassword(@RequestBody Map<String, String> request) {
        String userId = request.get("userId");
        String email = request.get("email");

        // 사용자 확인
        Optional<MemberEntity> userOptional = memberService.checkUserExists(userId, email);
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Collections.singletonMap("message", "아이디와 이메일 정보가 일치하지 않습니다."));
        }

        // 임시 비밀번호 생성
        String tempPassword = UUID.randomUUID().toString().substring(0, 16);

        // 임시 비밀번호 암호화
        String encryptedPassword = bcryptPasswordEncoder.encode(tempPassword);

        // 비밀번호 업데이트
        memberService.updatePassword(userId, encryptedPassword);

        // 이메일 전송
        emailService.sendEmail(email, "OspreyAI 임시 비밀번호 발급",
                "안녕하세요, OspreyAI 사용자님.\n\n임시 비밀번호 :\n" +
                        tempPassword +
                        "\n\n안전한 사용을 위해 발급된 임시 비밀번호는 즉시 변경해 주시길 권장합니다.\n" +
                        "비밀번호 변경과 관련하여 도움이 필요하신 경우, 언제든지 문의해 주십시오.\n" +
                        "\n" +
                        "감사합니다.\n" +
                        "OspreyAI 드림");

        return ResponseEntity.ok(Collections.singletonMap("message", "임시 비밀번호가 이메일로 전송되었습니다."));
    }

    // 이메일 인증 메일
    @PostMapping("/emailCheck")
    public ResponseEntity<?> checkingEmail(@RequestBody Map<String, String> request) {
        String email = request.get("email");

        // 6자리 무작위 숫자 생성
        String randomNumber = String.format("%06d", new Random().nextInt(999999));

        // 이메일 전송
        emailService.sendEmail(email, "OspreyAI 인증 코드 발급",
                "안녕하세요, OspreyAI 사용자님.\n\n인증 코드 :\n" +
                        randomNumber +
                        "\n\n안전한 사용을 위해 발급된 인증 코드를 즉시 사용해 주시길 권장합니다.\n" +
                        "코드 사용과 관련하여 도움이 필요하신 경우, 언제든지 문의해 주십시오.\n" +
                        "\n" +
                        "감사합니다.\n" +
                        "OspreyAI 드림");

        Map<String, String> response = new HashMap<>();
        response.put("message", "인증 코드가 이메일로 전송되었습니다.");
        response.put("code", randomNumber);

        return ResponseEntity.ok(response);
    }


    // 마이페이지 메인
    @GetMapping("/mypage/{userId}")
    public ResponseEntity<Member> memberDetailMethod(@PathVariable String userId) {
        log.info("마이페이지 회원 아이디 : " + userId);

        Member member = memberService.selectMember(userId);

        if (member != null) {
            return ResponseEntity.status(HttpStatus.OK).body(member);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

    }

    //회원정보 수정
    @PutMapping("/mypage/{uuid}")
    public ResponseEntity memberUpdateMethod(@PathVariable String uuid, @RequestBody Member member) {
        Member preMember = memberService.selectUuid(uuid);

        preMember.setName(member.getName());
        preMember.setNickname(member.getNickname());
        preMember.setPhoneNumber(member.getPhoneNumber());
        preMember.setGender(member.getGender());
        preMember.setGoogle(member.getGoogle());
        preMember.setNaver(member.getNaver());
        preMember.setKakao(member.getKakao());

        try {
            memberService.updateMember(preMember); // 회원정보 수정 성공시
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

    // Google 이메일 연동하기
    @PostMapping("/google")
    public ResponseEntity<String> insertGoogle(@RequestBody Map<String, String> map) {
        log.info("구글 인서트() : uuid: {}, email: {} ", map.get("uuid"), map.get("email"));
        Member member = memberService.selectUuid(map.get("uuid"));
        member.setGoogle(map.get("email"));
        memberService.updateMember(member);

        return ResponseEntity.ok().build();
    }

    // Google 이메일 연동 해제하기
    @PutMapping("/google")
    public ResponseEntity<String> deleteGoogle(@RequestBody Map<String, String> map) {
        log.info("구글 컬럼 삭제() : uuid: {}", map.get("uuid"));
        memberService.deleteGoogle(map.get("uuid"));

        return ResponseEntity.ok().build();
    }




    // 새로운 비밀번호로 변경
    @PutMapping("/mypage/pwchange/{uuid}")
    public ResponseEntity pwChangeMethod(@PathVariable String uuid, @RequestBody Map<String, String> request) {
        Member member = memberService.selectUuid(uuid);

        member.setPw(bcryptPasswordEncoder.encode(request.get("pw")));

        try {
            memberService.updateMember(member);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
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

    // 관리자 기능 *********************************************************
    // 회원 목록 보기 요청
    @GetMapping("/admin/members")
    public ResponseEntity<Map<String, Object>> memberListMethod(
            //ajax 통신에서는 반환형을 ResponseEntity<객체자료형> 을 사용하지 않아도 됨
            @RequestParam(name = "page", defaultValue = "1") int currentPage,
            @RequestParam(name = "limit", defaultValue = "10") int limit) {

        int listCount = memberService.selectListCount();
        Paging paging = new Paging(listCount, limit, currentPage);
        paging.calculate();

        Pageable pageable = PageRequest.of(paging.getCurrentPage() - 1, paging.getLimit(),
                Sort.by(Sort.Direction.DESC, "enrollDate"));

        try {
            List<Member> members = memberService.selectList(pageable);
            Map<String, Object> map = new HashMap<>();
            map.put("list", members);
            map.put("paging", paging);
            return new ResponseEntity<Map<String, Object>>(map, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 마스터페이지 목록 보기 요청
    @GetMapping("/admin/master")
    public ResponseEntity<Map<String, Object>> masterListMethod(
            //ajax 통신에서는 반환형을 ResponseEntity<객체자료형> 을 사용하지 않아도 됨
            @RequestParam(name = "page", defaultValue = "1") int currentPage,
            @RequestParam(name = "limit", defaultValue = "10") int limit) {

        int listCount = memberService.selectListCount();
        Paging paging = new Paging(listCount, limit, currentPage);
        paging.calculate();

        Pageable pageable = PageRequest.of(paging.getCurrentPage() - 1, paging.getLimit(),
                Sort.by(Sort.Direction.DESC, "adminYn"));

        try {
            List<Member> members = memberService.selectMasterList(pageable);
            Map<String, Object> map = new HashMap<>();
            map.put("list", members);
            map.put("paging", paging);
            return new ResponseEntity<Map<String, Object>>(map, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    //회원 로그인 제한/허용 처리
    @PutMapping("/loginok/{uuid}/{loginOk}")
    public ResponseEntity<String> changeLoginOKMethod(
            @PathVariable String uuid,
            @PathVariable String loginOk) {
        log.info("회원 제한 메서드() : " + uuid + ", " + loginOk);

        try {
            memberService.updateLoginOK(uuid, loginOk);
            return new ResponseEntity(HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    //관리자 권한 변경 처리
    @PutMapping("/adminYn/{uuid}/{adminYn}")
    public ResponseEntity<String> changeAdminYnMethod(
            @PathVariable String uuid,
            @PathVariable String adminYn) {
        log.info("관리자 권한 메서드() : " + uuid + ", " + adminYn);

        try {
            memberService.updateAdminYn(uuid, adminYn);
            return new ResponseEntity(HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

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



















