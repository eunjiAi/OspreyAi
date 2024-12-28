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
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Slf4j
@RequiredArgsConstructor
@RestController
public class ReissueController {

    private final JWTUtil jwtUtil;
    private final MemberService memberService;
    private final RefreshService refreshService;

    @Value("${jwt.access_expiration}")
    private long accessTokenExpiration;

    @Value("${jwt.refresh_expiration}")
    private long refreshTokenExpiration;

    @PostMapping("/reissue")
    public ResponseEntity<?> reissue(HttpServletRequest request, HttpServletResponse response) {
        log.info("액세스토큰 만료시간: {}ms, 리프레시토큰 만료시간: {}ms", accessTokenExpiration, refreshTokenExpiration);

        try {
            // Authorization 헤더에서 Refresh Token 추출
            String refresh = request.getHeader("Authorization");
            if (refresh == null || !refresh.startsWith("Bearer ")) {
                log.warn("Authorization 헤더가 비어있거나 잘못되었습니다.");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Authorization 헤더가 비어있거나 잘못되었습니다.");
            }
            String refreshToken = refresh.substring("Bearer ".length());
            log.info("추출된 Refresh Token: {}", refreshToken);

            // Refresh Token 만료 여부 확인
            if (jwtUtil.isTokenExpired(refreshToken)) {
                log.warn("Refresh Token이 만료되었습니다: {}", refreshToken);

                // Access Token 유효성 검사
                String accessToken = request.getHeader("Access-Token");
                if (accessToken != null && !jwtUtil.isTokenExpired(accessToken)) {
                    log.info("Access Token은 유효합니다. Refresh Token을 연장합니다.");

                    // Refresh Token 재발급
                    String username = jwtUtil.getUserIdFromToken(accessToken);
                    String newRefreshToken = jwtUtil.generateToken(username, "refresh", refreshTokenExpiration);

                    // 기존 Refresh Token 삭제 및 새로운 Token 저장
                    refreshService.deleteByRefreshToken(refreshToken);
                    refreshService.save(
                            RefreshToken.builder()
                                    .userId(username)
                                    .tokenValue(newRefreshToken)
                                    .expiresIn(refreshTokenExpiration)
                                    .status("activated")
                                    .build()
                    );

                    Map<String, String> responseBody = new HashMap<>();
                    responseBody.put("refreshToken", newRefreshToken);

                    return ResponseEntity.ok(responseBody);
                }

                log.warn("Access Token도 만료되었습니다.");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Refresh Token과 Access Token이 모두 만료되었습니다.");
            }

            // Refresh Token 카테고리 확인
            String category = jwtUtil.getCategoryFromToken(refreshToken);
            if (!"refresh".equals(category)) {
                log.warn("잘못된 토큰 카테고리: {}", category);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("잘못된 토큰 카테고리입니다.");
            }

            // 사용자 정보 확인
            String username = jwtUtil.getUserIdFromToken(refreshToken);
            log.info("토큰에서 추출된 사용자 아이디: {}", username);
            Member member = memberService.selectMember(username);
            if (member == null) {
                log.error("사용자 정보를 찾을 수 없습니다: {}", username);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("사용자를 찾을 수 없습니다.");
            }

            // 새 Access Token 발급
            String accessToken = jwtUtil.generateToken(username, "access", accessTokenExpiration);
            log.info("새 Access Token 발급 완료: {}", accessToken);

            Map<String, String> responseBody = new HashMap<>();
            responseBody.put("accessToken", accessToken);

            return ResponseEntity.ok(responseBody);
        } catch (ExpiredJwtException e) {
            log.error("Refresh Token 만료 예외 발생: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Refresh Token이 만료되었습니다.");
        } catch (Exception e) {
            log.error("알 수 없는 예외 발생: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류가 발생했습니다.");
        }
    }
}
