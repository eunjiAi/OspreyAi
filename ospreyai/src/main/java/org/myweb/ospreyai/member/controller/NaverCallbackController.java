package org.myweb.ospreyai.member.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Controller
public class NaverCallbackController {

    @Value("${naver.client_id}")
    private String clientId;
    @Value("${naver.client_secret}")
    private String clientSecret;
    @Value("${naver.redirect_uri}")
    private String redirectUri;

    @GetMapping("/naver/callback")
    public ResponseEntity<String> naverCallback(@RequestParam String code, @RequestParam String state) {
        String tokenUrl = "https://nid.naver.com/oauth2.0/token?grant_type=authorization_code" +
                "&client_id=" + clientId +
                "&client_secret=" + clientSecret +
                "&redirect_uri=" + redirectUri +
                "&code=" + code +
                "&state=" + state;

        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> tokenResponse = restTemplate.getForEntity(tokenUrl, String.class);

        // Access Token 추출
        String accessToken = extractAccessToken(tokenResponse.getBody());

        // 사용자 정보 요청
        String email = getUserEmail(accessToken);

        // 이메일을 POST 요청으로 /login 엔드포인트로 전달
        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/x-www-form-urlencoded");

        String body = "naverEmail=" + email;
        HttpEntity<String> request = new HttpEntity<>(body, headers);

        ResponseEntity<String> loginResponse = restTemplate.postForEntity("http://localhost:8888/login", request, String.class);

        // 클라이언트에게 로그인 결과 반환
        return ResponseEntity.ok(loginResponse.getBody());
    }


    private String extractAccessToken(String responseBody) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode rootNode = objectMapper.readTree(responseBody);
            return rootNode.get("access_token").asText();
        } catch (Exception e) {
            throw new RuntimeException("Failed to extract access token", e);
        }
    }

    private String getUserEmail(String accessToken) {
        String userInfoUrl = "https://openapi.naver.com/v1/nid/me";

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + accessToken);

        HttpEntity<String> request = new HttpEntity<>(headers);
        RestTemplate restTemplate = new RestTemplate();

        ResponseEntity<String> response = restTemplate.exchange(userInfoUrl, HttpMethod.GET, request, String.class);

        // 이메일 정보 추출
        return extractEmail(response.getBody());
    }

    private String extractEmail(String responseBody) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode rootNode = objectMapper.readTree(responseBody);
            JsonNode responseNode = rootNode.get("response");
            return responseNode.get("email").asText();
        } catch (Exception e) {
            throw new RuntimeException("Failed to extract email", e);
        }
    }
}

