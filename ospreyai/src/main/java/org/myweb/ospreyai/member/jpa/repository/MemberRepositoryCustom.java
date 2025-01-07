package org.myweb.ospreyai.member.jpa.repository;

import org.myweb.ospreyai.member.jpa.entity.MemberEntity;
import org.myweb.ospreyai.member.model.dto.Member;
import org.springframework.data.domain.Pageable;

import java.sql.Date;
import java.util.List;
import java.util.Optional;

//QueryDSL 용 Custom 인터페이스를 작성함
public interface MemberRepositoryCustom {
    // QueryDSL 사용방법 첫번째 : 1. 추가하는 메소드에 대해 인터페이스 만들고, 추상메소드로 선언함

    //추가한 메소드에 대한 추상메소드로 선언
    List<MemberEntity> findSearchUserId(String keyword, Pageable pageable);
    long countSearchUserId(String keyword);
    List<MemberEntity> findSearchGender(String keyword, Pageable pageable);
    long countSearchGender(String keyword);
    List<MemberEntity> findSearchDate(Date begin, Date end, Pageable pageable);
    long countSearchDate(Date begin, Date end);
    List<MemberEntity> findSearchLoginOK(String keyword, Pageable pageable);
    long countSearchLoginOK(String keyword);

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

    void updatePassword(String userId, String encryptedPassword);
}
