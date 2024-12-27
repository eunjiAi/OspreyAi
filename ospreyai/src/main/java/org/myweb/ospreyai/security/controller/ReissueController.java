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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Enumeration;
import java.util.Optional;

@Slf4j
@RequiredArgsConstructor   //어노테이션을 이용한 의존성 주입
@RestController
public class ReissueController {

    private final JWTUtil jwtUtil;  //jwt 토큰 처리를 위한 유틸리티
    private final MemberService memberService;  //사용자 정보 확인 처리용
    private final RefreshService refreshService;   //리프레시 토큰 처리용

//    @Value("${jwt.access_expiration}")
//    private long ACCESS_TOKEN_EXPIRATION;
//    @Value("${jwt.refresh_expiration}")
//    private long REFRESH_TOKEN_EXPIRATION;
    private static final long ACCESS_TOKEN_EXPIRATION = 1800000L;
    private static final long REFRESH_TOKEN_EXPIRATION = 86400000L;

    @PostMapping("/reissue")
    public ResponseEntity<?> reissue(HttpServletRequest request, HttpServletResponse response) {
        log.info("[디버깅] /reissue 엔드포인트 요청 처리 중...");

        // 요청 헤더 디버깅
        Enumeration<String> headerNames = request.getHeaderNames();
        log.info("[디버깅] 요청에 포함된 헤더 목록:");
        while (headerNames.hasMoreElements()) {
            String headerName = headerNames.nextElement();
            log.info("[디버깅] 헤더 이름: {}, 값: {}", headerName, request.getHeader(headerName));
        }

        // 리프레시 토큰 처리 로직
        String refresh = request.getHeader("Authorization");
        if (refresh == null || !refresh.startsWith("Bearer ")) {
            log.warn("[디버깅] Authorization 헤더가 비어있거나 잘못되었습니다.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        String token = refresh.substring("Bearer ".length());

        //토큰 만료 여부 검사
        try {
            if(jwtUtil.isTokenExpired(token)) {
                log.info("Refresh token expired: {}", token);
                refreshService.deleteByRefreshToken(token);
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Refresh token expired.");
            }

        } catch (ExpiredJwtException e) {
            refreshService.deleteByRefreshToken(token);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        //리프레시 토큰이 맞는지 카테고리로 확인함
        String category = jwtUtil.getCategoryFromToken(token);
        if(category.equals("refresh")) {
            //토큰에서 사용자 아이디 추출함
            String username = jwtUtil.getUserIdFromToken(token);
            Member member = memberService.selectMember(username);
            if (member == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
            }

            Optional<RefreshToken> refreshTokenOptional = refreshService.findByTokenValue(token);
            if (refreshTokenOptional.isEmpty()) {
                return new ResponseEntity<>("refresh token not found or does not match", HttpStatus.BAD_REQUEST);
            }

            //리프래시 토큰의 상태 확인
            RefreshToken refreshToken = refreshTokenOptional.get();
            if (refreshToken == null || !refreshToken.getStatus().equals("activated")) {
                log.info("Refresh token not activated or null: {}", token);
                return new ResponseEntity<>("Refresh token is not activated or invalid", HttpStatus.BAD_REQUEST);
            }


            //리프래시 토큰이 정상이면, 엑세스 토큰만 새로 생성함
            String access = jwtUtil.generateToken(username, "access", ACCESS_TOKEN_EXPIRATION);

            //응답 객체에 새로운 엑세스 토큰 정보 추가
            response.setHeader("Authorization", "Bearer " + access);
            //클라이언트가 Authorization 해더를 읽을 수 있도록 설정
            response.setHeader("Access-Control-Expose-Headers", "Authorization");

            //성공적으로 새 토큰 받았을 때의 응답 처리
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }

    //access token 만 확인하고 처리하는 메소드
    private ResponseEntity<?> handleAccessTokenOnly(String token, HttpServletResponse response) {
        try {
            if(jwtUtil.isTokenExpired(token)) {
                return new ResponseEntity<>("access token expired.", HttpStatus.UNAUTHORIZED);
            }
        }catch (ExpiredJwtException e){
            return new ResponseEntity<>("access token expired.", HttpStatus.UNAUTHORIZED);
        }

        String username = jwtUtil.getUserIdFromToken(token);
        Member member = memberService.selectMember(username);
        if(member == null) {
            return new ResponseEntity<>("User not found.", HttpStatus.NOT_FOUND);
        }

        //access token 이 유효하다면 필요한 추가 처리를 진행
        //예 : 사용자의 세션 갱신 또는 기타 액션

        return new ResponseEntity<>(HttpStatus.OK);
    }
}
