package org.myweb.ospreyai.member.jpa.repository;

import org.myweb.ospreyai.member.jpa.entity.MemberEntity;
import org.myweb.ospreyai.member.model.dto.Member;
import org.springframework.data.domain.Pageable;

import java.sql.Date;
import java.util.List;
import java.util.Optional;

public interface MemberRepositoryCustom {

    // 아이디 정보 조회
    Optional<MemberEntity> findByMemberId(String memberId);
    // 구글 이메일 조회
    Optional<MemberEntity> findByGoogle(String email);
    // 네이버 이메일 조회
    Optional<MemberEntity> findByNaver(String email);
    // 카카오 이메일 조회
    Optional<MemberEntity> findByKakao(String email);
    // 이름과 이메일로 아이디 찾기
    Optional<MemberEntity> findByNameAndEmail(String name, String email);
    // 아이디와 이메일로 사용자 찾기(패스워드 찾기에서 사용)
    Optional<MemberEntity> existsByUserIdAndEmail(String userId, String email);
    // 비밀번호 변경
    void updatePassword(String userId, String encryptedPassword);
    // 구글 정보 삭제(연동해제)
    void deleteByGoogle(String uuid);
    // 카카오 정보 삭제(연동해제)
    void deleteByKakao(String uuid);
}
