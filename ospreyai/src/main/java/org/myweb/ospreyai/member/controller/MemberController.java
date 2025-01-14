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

    // ajax 통신으로 가입할 회원의 아이디(유니크) 중복 검사 요청 처리용 메소드
    @PostMapping("/memberidchk")
    public ResponseEntity<String> checkIdMethod(@RequestParam("memberId") String memberId) {
        if (memberService.selectCheckId(memberId) == 0) {
            return new ResponseEntity<String>("ok", HttpStatus.OK);
        } else {
            return new ResponseEntity<String>("dup", HttpStatus.OK);
        }
    }

    // 회원 가입
    @PostMapping
    public ResponseEntity<?> memberInsertMethod(
            @ModelAttribute Member member) {
        member.setUuid(UUID.randomUUID().toString());
        member.setPw(bcryptPasswordEncoder.encode(member.getPw()));
        member.setLoginOk("Y");
        member.setAdminYn("N");

        int result = memberService.insertMember(member);
        if (result == 1) {
        return ResponseEntity.status(HttpStatus.OK).build();
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

    }

    // 이름과 이메일로 아이디 찾기
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

    // 아이디와 이메일로 비밀번호 변경
    @PostMapping("/resetPassword")
    public ResponseEntity<?> sendMailRandomPassword(@RequestBody Map<String, String> request) {
        String userId = request.get("userId");
        String email = request.get("email");

        Optional<MemberEntity> userOptional = memberService.checkUserExists(userId, email);
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Collections.singletonMap("message", "아이디와 이메일 정보가 일치하지 않습니다."));
        }

        String tempPassword = UUID.randomUUID().toString().substring(0, 16);
        String encryptedPassword = bcryptPasswordEncoder.encode(tempPassword);
        memberService.updatePassword(userId, encryptedPassword);

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

    // 이메일 인증 (send mail)
    @PostMapping("/emailCheck")
    public ResponseEntity<?> checkingEmail(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String randomNumber = String.format("%06d", new Random().nextInt(999999));

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
    public ResponseEntity<Member> mypageDetailMenu(@PathVariable String userId) {
        Member member = memberService.selectMember(userId);

        if (member != null) {
            return ResponseEntity.status(HttpStatus.OK).body(member);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

    }

    // 회원정보 수정
    @PutMapping("/mypage/{uuid}")
    public ResponseEntity<?> memberUpdateMethod(@PathVariable String uuid, @RequestBody Member member) {
        Member preMember = memberService.selectUuid(uuid);

        preMember.setName(member.getName());
        preMember.setNickname(member.getNickname());
        preMember.setPhoneNumber(member.getPhoneNumber());
        preMember.setGender(member.getGender());
        preMember.setGoogle(member.getGoogle());
        preMember.setNaver(member.getNaver());
        preMember.setKakao(member.getKakao());

        try {
            memberService.updateMember(preMember);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    // Google 이메일 연동하기
    @PostMapping("/google")
    public ResponseEntity<String> insertGoogle(@RequestBody Map<String, String> map) {
        Member member = memberService.selectUuid(map.get("uuid"));
        member.setGoogle(map.get("email"));
        memberService.updateMember(member);

        return ResponseEntity.ok().build();
    }

    // Naver 이메일 연동하기
    @PostMapping("/naver")
    public ResponseEntity<String> insertNaver(@RequestBody Map<String, String> map) {
        Member member = memberService.selectUuid(map.get("uuid"));
        member.setNaver(map.get("email"));
        memberService.updateMember(member);

        return ResponseEntity.ok().build();
    }

    // Kakao 이메일 연동하기
    @PostMapping("/kakao")
    public ResponseEntity<String> insertKakao(@RequestBody Map<String, String> map) {
        Member member = memberService.selectUuid(map.get("uuid"));
        member.setKakao(map.get("email"));
        memberService.updateMember(member);

        return ResponseEntity.ok().build();
    }

    // Google 이메일 연동 해제하기
    @PutMapping("/google")
    public ResponseEntity<String> deleteGoogle(@RequestBody Map<String, String> map) {
        memberService.deleteGoogle(map.get("uuid"));

        return ResponseEntity.ok().build();
    }

    // Naver 이메일 연동 해제하기
    @PutMapping("/naver")
    public ResponseEntity<String> deleteNaver(@RequestBody Map<String, String> map) {
        memberService.deleteNaver(map.get("uuid"));

        return ResponseEntity.ok().build();
    }

    // Kakao 이메일 연동 해제하기
    @PutMapping("/kakao")
    public ResponseEntity<String> deleteKakao(@RequestBody Map<String, String> map) {
        memberService.deleteKakao(map.get("uuid"));

        return ResponseEntity.ok().build();
    }

    // 현재 비밀번호 비교 확인(비밀번호 변경시)
    @PostMapping("/mypage/chkpw/{userId}")
    public ResponseEntity<?> checkCurrentPassword(@PathVariable String userId, @RequestBody Map<String, String> request) {
        String inputPassword = request.get("pw");
        boolean pwChk = memberService.checkPassword(userId, inputPassword);

        if (pwChk) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    // 새로운 비밀번호로 변경
    @PutMapping("/mypage/pwchange/{uuid}")
    public ResponseEntity<?> changePassword(@PathVariable String uuid, @RequestBody Map<String, String> request) {
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
    public ResponseEntity<?> memberDeleteMethod(@PathVariable String uuid) {
        try {
            memberService.deleteMember(uuid);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 아이디로 닉네임 가져오기
    @GetMapping("/nickname")
    public ResponseEntity<String> getNicknameByUserId(@RequestParam String userid) {
        String nickname = memberService.getNicknameByUserId(userid);
        if (nickname != null) {
            return ResponseEntity.ok(nickname);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // 관리자 기능 *********************************************************
    // 회원 목록 보기 요청
    @GetMapping("/admin/members")
    public ResponseEntity<Map<String, Object>> memberListMethod(
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
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 마스터 페이지 목록 보기 요청
    @GetMapping("/admin/master")
    public ResponseEntity<Map<String, Object>> listForMaster(
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
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 회원 로그인 (허용 / 제한) 처리
    @PutMapping("/loginok/{uuid}/{loginOk}")
    public ResponseEntity<String> changeLoginOKMethod(
            @PathVariable String uuid,
            @PathVariable String loginOk) {

        try {
            memberService.updateLoginOK(uuid, loginOk);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 관리자 권한 변경 처리(마스터)
    @PutMapping("/adminYn/{uuid}/{adminYn}")
    public ResponseEntity<String> changeAdminYnMethod(
            @PathVariable String uuid,
            @PathVariable String adminYn) {

        try {
            memberService.updateAdminYn(uuid, adminYn);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}