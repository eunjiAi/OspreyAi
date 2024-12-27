package org.myweb.ospreyai.security.controller;

import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.myweb.ospreyai.member.model.dto.Member;
import org.myweb.ospreyai.member.model.service.MemberService;
import org.myweb.ospreyai.security.jwt.jpa.entity.RefreshToken;
import org.myweb.ospreyai.security.jwt.model.service.RefreshService;
import org.myweb.ospreyai.security.jwt.util.JWTUtil;
import org.springframework.beans.factory.annotation.Value; // 추가된 import
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Enumeration;
import java.util.Optional;

@Slf4j
@RequiredArgsConstructor
@RestController
public class ReissueController {

    private final JWTUtil jwtUtil;
    private final MemberService memberService;
    private final RefreshService refreshService;

    // application.properties에서 값 가져오기
    @Value("${jwt.access_expiration}")
    private long accessTokenExpiration;

    @Value("${jwt.refresh_expiration}")
    private long refreshTokenExpiration;

    @PostMapping("/reissue")
    public ResponseEntity<?> reissue(HttpServletRequest request, HttpServletResponse response) {
        log.info("[디버깅] /reissue 엔드포인트 요청 처리 시작");

        // 요청 헤더 디버깅
        log.info("[디버깅] 요청에 포함된 헤더 목록:");
        Enumeration<String> headerNames = request.getHeaderNames();
        while (headerNames.hasMoreElements()) {
            String headerName = headerNames.nextElement();
            log.info("[디버깅] 헤더 이름: {}, 값: {}", headerName, request.getHeader(headerName));
        }

        // Authorization 헤더 확인
        String refresh = request.getHeader("Authorization");
        if (refresh == null || !refresh.startsWith("Bearer ")) {
            log.warn("[디버깅] Authorization 헤더가 비어있거나 잘못되었습니다.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Authorization 헤더가 비어있거나 잘못되었습니다.");
        }

        // Refresh Token 추출
        String token = refresh.substring("Bearer ".length());
        log.info("[디버깅] 추출된 Refresh Token: {}", token);

        // Refresh Token 유효성 검사
        try {
            if (jwtUtil.isTokenExpired(token)) {
                log.warn("[디버깅] Refresh Token이 만료되었습니다: {}", token);
                refreshService.deleteByRefreshToken(token);
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Refresh token expired.");
            }
        } catch (ExpiredJwtException e) {
            log.error("[디버깅] Refresh Token 만료 예외 발생: {}", e.getMessage());
            refreshService.deleteByRefreshToken(token);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Refresh token expired.");
        }

        // Refresh Token 카테고리 확인
        String category = jwtUtil.getCategoryFromToken(token);
        if (!"refresh".equals(category)) {
            log.warn("[디버깅] 잘못된 토큰 카테고리: {}", category);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("잘못된 토큰 카테고리입니다.");
        }

        // 사용자 정보 확인
        String username = jwtUtil.getUserIdFromToken(token);
        log.info("[디버깅] 토큰에서 추출된 사용자 아이디: {}", username);
        Member member = memberService.selectMember(username);
        if (member == null) {
            log.error("[디버깅] 사용자 정보를 찾을 수 없습니다: {}", username);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("사용자를 찾을 수 없습니다.");
        }

        // Refresh Token 상태 확인
        Optional<RefreshToken> refreshTokenOptional = refreshService.findByTokenValue(token);
        if (refreshTokenOptional.isEmpty()) {
            log.warn("[디버깅] Refresh Token이 DB에서 발견되지 않았습니다.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Refresh token not found.");
        }

        RefreshToken refreshToken = refreshTokenOptional.get();
        if (!"activated".equals(refreshToken.getStatus())) {
            log.warn("[디버깅] Refresh Token이 활성화되지 않았거나 상태가 잘못되었습니다.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Refresh token not activated.");
        }

        // 새 Access Token 발급
        String access = jwtUtil.generateToken(username, "access", accessTokenExpiration);
        log.info("[디버깅] 새 Access Token 발급 완료: {}", access);

        // 응답 헤더에 Access Token 설정
        response.setHeader("Authorization", "Bearer " + access);
        response.setHeader("Access-Control-Expose-Headers", "Authorization");

        return ResponseEntity.ok("새 Access Token이 발급되었습니다.");
    }
}
