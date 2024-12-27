package org.myweb.ospreyai.security.jwt.filter;

import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.myweb.ospreyai.member.jpa.entity.MemberEntity;
import org.myweb.ospreyai.security.jwt.filter.output.CustomUserDetails;
import org.myweb.ospreyai.security.jwt.util.JWTUtil;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.Enumeration;

@Slf4j
public class JWTFilter extends OncePerRequestFilter {
    private final JWTUtil jwtUtil;

    public JWTFilter(JWTUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws IOException {
        log.info("JWT 필터 작동중...");
        try {
            // Authorization 헤더가 있는지 확인
            String authorization = request.getHeader("Authorization");
            String requestURI = request.getRequestURI();

            Enumeration<String> headerNames = request.getHeaderNames();
            log.info("[디버깅] 요청에 포함된 헤더 목록:");
            while (headerNames != null && headerNames.hasMoreElements()) {
                String headerName = headerNames.nextElement();
                log.info("[디버깅] 헤더 이름: {}, 값: {}", headerName, request.getHeader(headerName));
            }

            // Authorization 헤더가 없거나 잘못된 형식이면 필터 통과
            if (authorization == null || !authorization.startsWith("Bearer ")) {
                log.warn("[디버깅] Authorization 헤더가 없거나 형식이 올바르지 않습니다.");
                filterChain.doFilter(request, response);
                return;
            }

            // 로그인 및 토큰 재발급 요청은 필터 통과
            if (requestURI.equals("/login") || requestURI.equals("/reissue")) {
                filterChain.doFilter(request, response);
                return;
            }

            String token = authorization.split(" ")[1];

            // 토큰 만료 여부 확인
            if (jwtUtil.isTokenExpired(token)) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("Access token expired");
                return;
            }

            // 토큰 카테고리 확인
            String category = jwtUtil.getCategoryFromToken(token);
            if (!"access".equals(category)) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("Invalid access token");
                return;
            }

            // 사용자 정보 추출
            String username = jwtUtil.getUserIdFromToken(token);
            String role = jwtUtil.getRoleFromToken(token);
            String uuid = jwtUtil.getUuidFromToken(token); // 추가: UUID 추출
            String name = jwtUtil.getNameFromToken(token); // 추가: Name 추출

            // 사용자 인증 객체 생성
            MemberEntity member = new MemberEntity();
            member.setEmail(username);
            member.setName(name); // 추가: Name 설정
            member.setUuid(uuid); // 추가: UUID 설정
            member.setAdminYn(role.equals("ADMIN") ? "Y" : "N");
            member.setPw("tempPassword");

            log.info("Authenticated member: {}", member);

            CustomUserDetails customUserDetails = new CustomUserDetails(member);
            Authentication authToken = new UsernamePasswordAuthenticationToken(
                    customUserDetails,
                    null,
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role))
            );

            // SecurityContext에 저장
            SecurityContextHolder.getContext().setAuthentication(authToken);

            filterChain.doFilter(request, response);
        } catch (ExpiredJwtException e) {
            log.error("Token expired: {}", e.getMessage());
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Access token expired");
        } catch (Exception e) {
            log.error("Error in JWTFilter: ", e);
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("An error occurred during JWT processing.");
        }
    }
}
