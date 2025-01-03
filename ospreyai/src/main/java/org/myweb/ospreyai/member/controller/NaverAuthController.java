package org.myweb.ospreyai.member.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/naver")
public class NaverAuthController {

    @Value("${naver.client-id}")
    private String clientId;

    @Value("${naver.client-secret}")
    private String clientSecret;

    @Value("${naver.redirect-uri}")
    private String redirectUri;

    // 네이버 로그인 URL 생성
    @GetMapping("/login")
    public ResponseEntity<String> naverLogin() {
        String state = "STATE_STRING"; // CSRF 방지를 위한 임의의 문자열
        String naverLoginUrl = "https://nid.naver.com/oauth2.0/authorize" +
                "?client_id=" + clientId +
                "&redirect_uri=" + redirectUri +
                "&response_type=code" +
                "&state=" + state;
        return ResponseEntity.status(HttpStatus.FOUND).header("Location", naverLoginUrl).build();
    }

    // 네이버 로그인 콜백 처리
    @GetMapping("/callback")
    public ResponseEntity<Object> naverCallback(@RequestParam String code, @RequestParam String state) {
        try {
            // 액세스 토큰 요청
            RestTemplate restTemplate = new RestTemplate();

            String tokenUrl = "https://nid.naver.com/oauth2.0/token";
            Map<String, String> tokenParams = new HashMap<>();
            tokenParams.put("grant_type", "authorization_code");
            tokenParams.put("client_id", clientId);
            tokenParams.put("client_secret", clientSecret);
            tokenParams.put("code", code);
            tokenParams.put("state", state);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            HttpEntity<Map<String, String>> tokenRequest = new HttpEntity<>(tokenParams, headers);
            ResponseEntity<Map> tokenResponse = restTemplate.exchange(tokenUrl, HttpMethod.POST, tokenRequest, Map.class);

            String accessToken = (String) tokenResponse.getBody().get("access_token");
            System.out.println("Naver Access Token: " + accessToken);

            // 사용자 정보 요청
            String userInfoUrl = "https://openapi.naver.com/v1/nid/me";
            HttpHeaders userInfoHeaders = new HttpHeaders();
            userInfoHeaders.set("Authorization", "Bearer " + accessToken);

            HttpEntity<Void> userInfoRequest = new HttpEntity<>(userInfoHeaders);
            ResponseEntity<Map> userInfoResponse = restTemplate.exchange(userInfoUrl, HttpMethod.GET, userInfoRequest, Map.class);

            Map<String, Object> userInfo = (Map<String, Object>) userInfoResponse.getBody().get("response");

            // 이메일 추출
            String email = (String) userInfo.get("email");
            log.info("Naver 사용자 이메일: " + email);

            return ResponseEntity.ok(Map.of(
                    "message", "네이버 로그인 성공",
                    "email", email,
                    "name", userInfo.get("name"),
                    "profile_image", userInfo.get("profile_image")
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("네이버 로그인 실패");
        }
    }
}
