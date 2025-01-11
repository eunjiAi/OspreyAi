package org.myweb.ospreyai.member.model.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.myweb.ospreyai.member.jpa.entity.MemberEntity;
import org.myweb.ospreyai.member.jpa.repository.MemberRepository;
import org.myweb.ospreyai.member.model.dto.Member;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.NoSuchElementException;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class MemberService {
    private final MemberRepository memberRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder();

    // id로 회원 정보 검색
    public Member selectMember(String userId) {
        Optional<MemberEntity> entityOptional = memberRepository.findByMemberId(userId);

        return entityOptional
                .map(MemberEntity::toDto)
                .orElseThrow(() -> new NoSuchElementException("해당 아이디를 조회할 수 없습니다 : " + userId));
    }

    // uuid로 회원 정보 검색
    public Member selectUuid(String uuid) {
        return memberRepository.findById(uuid).get().toDto();
    }

    //구글 이메일로 회원 정보 조회
    public Member findGoogleEmail(String email) {
        Optional<MemberEntity> entityOptional = memberRepository.findByGoogle(email);

        return entityOptional
                .map(MemberEntity::toDto)
                .orElseThrow(() -> new NoSuchElementException("해당 구글정보를 조회할 수 없습니다 : " + email));
    }

    //네이버 이메일로 회원 정보 조회
    public Member findNaverEmail(String email) {
        Optional<MemberEntity> entityOptional = memberRepository.findByNaver(email);

        return entityOptional
                .map(MemberEntity::toDto)
                .orElseThrow(() -> new NoSuchElementException("해당 네이버정보를 조회할 수 없습니다 : " + email));
    }

    //카카오 이메일로 회원 정보 조회
    public Member findKakaoEmail(String email) {
        Optional<MemberEntity> entityOptional = memberRepository.findByKakao(email);

        return entityOptional
                .map(MemberEntity::toDto)
                .orElseThrow(() -> new NoSuchElementException("해당 카카오정보를 조회할 수 없습니다 : " + email));
    }

    //회원가입시 id 중복 검사용
    public int selectCheckId(String memberId) {
        String uuid = memberRepository.findByMemberId(memberId)
                .map(MemberEntity::getUuid)
                .orElse(null);

        return (uuid != null && memberRepository.existsById(uuid)) ? 1 : 0;
    }

    //닉네임 조회
    public String getNicknameByUserId(String userid) {
        return memberRepository.findByMemberId(userid)
                .map(MemberEntity::getNickname)
                .orElseThrow(() -> new IllegalArgumentException("해당 사용자 ID를 찾을 수 없습니다: " + userid));
    }

    //패스워드 비교(비밀번호 변경시)
    public boolean checkPassword(String userId, String inputPassword) {
        Member member = memberRepository.findByMemberId(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다.")).toDto();
        log.info("checkPassword() : " + member);

        return bCryptPasswordEncoder.matches(inputPassword, member.getPw());
    }

    // 이름과 이메일로 아이디 찾기
    public Member findByNameAndEmail(String name, String email) {
        return memberRepository.findByNameAndEmail(name, email).get().toDto();
    }

    // 비밀번호 변경시 아이디와 이메일로 일치 회원 조회
    public Optional<MemberEntity> checkUserExists(String userId, String email) {
        return memberRepository.existsByUserIdAndEmail(userId, email);
    }

    // 비밀번호 변경
    public void updatePassword(String userId, String encryptedPassword) {
        memberRepository.updatePassword(userId, encryptedPassword);
    }

    //회원 가입
    @Transactional
    public int insertMember(Member member) {
        try {
            memberRepository.save(member.toEntity()).toDto();
            return 1;
        } catch (Exception e) {
            log.error(e.getMessage());
            return 0;
        }
    }

    //회원정보 수정
    @Transactional
    public int updateMember(Member member) {
        try {
            memberRepository.save(member.toEntity()).toDto();
            return 1;
        } catch (Exception e) {
            log.error(e.getMessage());
            return 0;
        }
    }

    //회원정보 삭제
    @Transactional
    public int deleteMember(String userId) {
        try {
            memberRepository.deleteById(userId);
            return 1;
        } catch (Exception e) {
            log.info(e.getMessage());
            return 0;
        }
    }

    //관리자용 ******************************************
    // 회원 카운트
    public int selectListCount() {
        return (int) memberRepository.count();
    }

    // 회원 리스트 조회
    public ArrayList<Member> selectList(Pageable pageable) {
        Page<MemberEntity> entityList = memberRepository.findAll(pageable);
        ArrayList<Member> list = new ArrayList<>();
        for (MemberEntity entity : entityList) {
            //관리자가 아닌 회원만 리스트에 저장
            if (entity.getAdminYn().equals("N")) {
                list.add(entity.toDto());
            }
        }
        return list;
    }

    // 마스터용 회원 리스트 조회
    public ArrayList<Member> selectMasterList(Pageable pageable) {
        Page<MemberEntity> entityList = memberRepository.findAll(pageable);
        ArrayList<Member> list = new ArrayList<>();
        for (MemberEntity entity : entityList) {
            if (!entity.getMemberId().equals("master")) {
                list.add(entity.toDto());
            }
        }
        return list;
    }


    // 회원 로그인 가능/불가 관리
    public int updateLoginOK(String uuid, String loginOk) {
        try {
            Member updateMember = memberRepository.findById(uuid).get().toDto();
            updateMember.setLoginOk(loginOk);
            memberRepository.save(updateMember.toEntity());
            return 1;
        } catch (Exception e) {
            log.error(e.getMessage());
            return 0;
        }
    }

    // 관리자 권한 관리
    public int updateAdminYn(String uuid, String adminYn) {
        try {
            Member updateMember = memberRepository.findById(uuid).get().toDto();
            updateMember.setAdminYn(adminYn);
            memberRepository.save(updateMember.toEntity());
            return 1;
        } catch (Exception e) {
            log.error(e.getMessage());
            return 0;
        }
    }


}
