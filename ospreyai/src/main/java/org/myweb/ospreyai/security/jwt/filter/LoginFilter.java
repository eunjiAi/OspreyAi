package org.myweb.ospreyai.security.jwt.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.myweb.ospreyai.security.jwt.filter.input.InputMember;
import org.myweb.ospreyai.security.jwt.filter.output.CustomUserDetails;
import org.myweb.ospreyai.security.jwt.jpa.entity.RefreshToken;
import org.myweb.ospreyai.security.jwt.model.service.RefreshService;
import org.myweb.ospreyai.security.jwt.model.service.UserService;
import org.myweb.ospreyai.security.jwt.util.JWTUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Slf4j
public class LoginFilter extends UsernamePasswordAuthenticationFilter {

    private final UserService userService;
    private final RefreshService refreshService;
    private final AuthenticationManager authenticationManager;
    private final JWTUtil jwtUtil;
    private final BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder();

//    private static final long ACCESS_TOKEN_EXPIRATION = 900000L;
//    private static final long REFRESH_TOKEN_EXPIRATION = 86400000L;

    //생성자를 통한 의존성 주입
    public LoginFilter(UserService userService, RefreshService refreshService,
                       AuthenticationManager authenticationManager, JWTUtil jwtUtil) {
        this.userService = userService;
        this.refreshService = refreshService;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;

        //로그인 url 요청에 대한 엔드포인트 설정
        setFilterProcessesUrl("/login");
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response)
            throws AuthenticationException {
        try {
            // 요청 속성에서 사용자 ID와 비밀번호 가져오기
            String id = request.getParameter("id");
            String googleEmail = request.getParameter("googleEmail");
            String naverEmail = request.getParameter("naverEmail");
            String kakaoEmail = request.getParameter("kakaoEmail");
            log.info("googleEmail: " + googleEmail + ", kakaoEmail: " + kakaoEmail + ", id: " + id);

            if (googleEmail != null && !googleEmail.isEmpty()) {
                // Google 사용자 인증 처리
                log.info("Google 사용자 인증 처리 시작: userId={}", googleEmail);

                CustomUserDetails userDetails = (CustomUserDetails) userService.loadUserByGoogle(googleEmail);
                if (userDetails == null) {
                    throw new UsernameNotFoundException("사용자를 찾을 수 없습니다: " + googleEmail);
                }

                // 비밀번호 검증 생략
                return new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
            } else if (naverEmail != null && !naverEmail.isEmpty()) {
                // Naver 사용자 인증 처리
                log.info("Naver 사용자 인증 처리 시작: userId={}", naverEmail);

                CustomUserDetails userDetails = (CustomUserDetails) userService.loadUserByNaver(naverEmail);
                if (userDetails == null) {
                    throw new UsernameNotFoundException("사용자를 찾을 수 없습니다: " + naverEmail);
                }

                // 비밀번호 검증 생략
                return new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
            } else if (kakaoEmail != null && !kakaoEmail.isEmpty()) {
                // Kakao 사용자 인증 처리
                log.info("Kakao 사용자 인증 처리 시작: userId={}", kakaoEmail);

                CustomUserDetails userDetails = (CustomUserDetails) userService.loadUserByKakao(kakaoEmail);
                if (userDetails == null) {
                    throw new UsernameNotFoundException("사용자를 찾을 수 없습니다: " + kakaoEmail);
                }

                // 비밀번호 검증 생략
                return new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
            } else if (id != null && !id.isEmpty()) {
                // Face Login 사용자 인증 처리
                log.info("Face Login 사용자 인증 처리 시작: userId={}", id);

                CustomUserDetails userDetails = (CustomUserDetails) userService.loadUserByFaceLogin(id);
                if (userDetails == null) {
                    throw new UsernameNotFoundException("사용자를 찾을 수 없습니다: " + id);
                }

                // 비밀번호 검증 생략
                return new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
            }

            // 일반 로그인 데이터 읽기
            log.info("일반 로그인 인증 시작");
            InputMember loginData = new ObjectMapper().readValue(request.getInputStream(), InputMember.class);
            log.info("로그인 정보: {}", loginData);

            UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(loginData.getUserId(), loginData.getUserPwd());
            return authenticationManager.authenticate(authToken);
        } catch (IOException e) {
            throw new RuntimeException("Failed to parse login request", e);
        }
    }



    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response,
                                            FilterChain chain, Authentication authResult) throws IOException {
        // 인증절차가 성공되면 자동으로 구동됨
        log.info("토큰 생성 시작");

        CustomUserDetails userDetails = (CustomUserDetails) authResult.getPrincipal();
        String username = userDetails.getUsername();  //로그인한 userId 임
        log.info("토큰에 사용될 ID: {}", username);

        //로그인 성공이므로, 토큰 만들기함
        String accessToken = jwtUtil.generateToken(username, "access", 900000L);
        String refreshToken = jwtUtil.generateToken(username, "refresh", 604800000L);

        //만들어진 리프레시토큰 정보 db 에 저장함
        RefreshToken tokenEntity = RefreshToken.builder()
                .id(UUID.randomUUID())
                .userId(username)
                .tokenValue(refreshToken)
                .expiresIn(604800000L)
                .status("activated")
                .build();
        refreshService.save(tokenEntity);

        response.addHeader("Authorization", "Bearer " + accessToken);

        Map<String, Object> body = new HashMap<>();
        body.put("refreshToken", refreshToken);

        response.setContentType("application/json");
        body.put("redirectUrl", "/"); // 리디렉션 URL 포함(25.01.19 추가)
        new ObjectMapper().writeValue(response.getWriter(), body);
    }

    //로그인 실패시 실행되는 메소드임.
    //실패할 경우 HTTP 상태 코드 401 을 반환함
    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response,
                                              AuthenticationException exception) throws IOException {
        // 인증 조회가 실패하면 자동 구동됨
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        Map<String, Object> responseBody = new HashMap<>();
        responseBody.put("message", "Authentication failed");
        responseBody.put("error", exception.getMessage());

        response.setContentType("application/json");
        new ObjectMapper().writeValue(response.getWriter(), responseBody);
    }

}