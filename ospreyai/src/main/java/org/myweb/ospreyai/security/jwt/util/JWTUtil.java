package org.myweb.ospreyai.security.jwt.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.myweb.ospreyai.member.model.dto.Member;
import org.myweb.ospreyai.member.model.service.MemberService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import javax.crypto.spec.SecretKeySpec;
import java.sql.Date;
import java.util.Base64;

@Slf4j
@Component
public class JWTUtil {
    private SecretKeySpec secretKey;
    private final MemberService memberService;

    @Value("${jwt.secret}")
    private String secretKeyString;

    public JWTUtil(MemberService memberService) {
        this.memberService = memberService;
    }

    @PostConstruct
    public void init() {
        byte[] keyBytes = Base64.getDecoder().decode(secretKeyString);
        this.secretKey = new SecretKeySpec(keyBytes, SignatureAlgorithm.HS256.getJcaName());
    }

    public String generateToken(String userId, String category, Long expiredMs) {
        log.info("generate token : {}", secretKey);

        Member member = memberService.selectMember(userId);
        log.info("member : {}", member);

        if (member == null) {
            throw new UsernameNotFoundException("userId : " + userId + " not found.");
        }

        String adminYN = member.getAdminYn();

        return Jwts.builder()
                .setSubject(userId)
                .claim("category", category)
                .claim("name", member.getName())
                .claim("uuid", member.getUuid()) // 추가된 UUID 클레임
                .claim("role", (adminYN.equals("Y") ? "ADMIN" : "USER"))
                .setExpiration(new Date(System.currentTimeMillis() + expiredMs))
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();
    }

    private Claims getClaimsFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public String getUserIdFromToken(String token) {
        return getClaimsFromToken(token).getSubject();
    }

    public boolean isTokenExpired(String token) {
        return getClaimsFromToken(token).getExpiration().before(new java.util.Date());
    }

    public String getAdminFromToken(String token) {
        return getClaimsFromToken(token).get("role", String.class);
    }

    public String getCategoryFromToken(String token) {
        return getClaimsFromToken(token).get("category", String.class);
    }

    public String getRoleFromToken(String token) {
        return getClaimsFromToken(token).get("role", String.class);
    }

    // 추가: 토큰에서 UUID 추출
    public String getUuidFromToken(String token) {
        return getClaimsFromToken(token).get("uuid", String.class);
    }

    // 추가: 토큰에서 Name 추출
    public String getNameFromToken(String token) {
        return getClaimsFromToken(token).get("name", String.class);
    }
}
