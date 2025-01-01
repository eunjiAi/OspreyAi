package org.myweb.ospreyai.security.jwt.jpa.repository;

import org.myweb.ospreyai.security.jwt.jpa.entity.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface RefreshRepository extends JpaRepository<RefreshToken, UUID> {
    //tokenValue 를 전달받아, db에 조회해서 토큰 객체를 리턴
    Optional<RefreshToken> findByTokenValue(String tokenValue);

    //토큰값이 db에 존재하는지 확인하는 용도
    Boolean existsByTokenValue(String refresh);

    //로그아웃시 토큰 삭제용
    void deleteByTokenValue(String refresh);

    //엑세스 토큰에 등록된 회원아이디(userid)로 리프레쉬 토큰 조회용
    @Query("SELECT r FROM RefreshToken r WHERE r.userId = :userId")
    List<RefreshToken> findByUserId(@Param("userId") String userId);

    // 누적 토큰 클리어
    @Modifying
    @Transactional
    @Query(value = "DELETE FROM REFRESH_TOKENS WHERE USERID = :userId", nativeQuery = true)
    int deleteEtcToken(@Param("userId") String userId);

    // 토큰 중복 갯수 조회
    @Query("SELECT COUNT(r) FROM RefreshToken r WHERE r.userId = :userId")
    int selectTokenCount(@Param("userId") String userId);
}
