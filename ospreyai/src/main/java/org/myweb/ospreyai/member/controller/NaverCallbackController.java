package org.myweb.ospreyai.member.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.net.URI;

@Controller
public class NaverCallbackController {

    @Value("${naver.client_id}")
    private String clientId;
    @Value("${naver.client_secret}")
    private String clientSecret;
    @Value("${naver.redirect_uri}")
    private String redirectUri;
    @Value("${naver.redirect_linkuri}")
    private String redirectLinkUri;

    // 네이버 로그인 콜백
    @GetMapping("/naver/callback")
    public ResponseEntity<Void> naverCallback(@RequestParam String code, @RequestParam String state) {
        String tokenUrl = "https://nid.naver.com/oauth2.0/token?grant_type=authorization_code" +
                "&client_id=" + clientId +
                "&client_secret=" + clientSecret +
                "&redirect_uri=" + redirectUri +
                "&code=" + code +
                "&state=" + state;

        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> tokenResponse = restTemplate.getForEntity(tokenUrl, String.class);

        String accessToken = extractAccessToken(tokenResponse.getBody());
        String email = getUserEmail(accessToken);

        String redirectUrl = "http://localhost:3000/naver/callbackUi?email=" + email;
        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(URI.create(redirectUrl));

        return new ResponseEntity<>(headers, HttpStatus.FOUND);
    }

    // 네이버 연동 콜백 (로그인과는 다른 페이지를 불러오기 위해 작성)
    @GetMapping("/naver/linkcallback")
    public ResponseEntity<Void> naverLinkCallback(@RequestParam String code, @RequestParam String state) {
        String tokenUrl = "https://nid.naver.com/oauth2.0/token?grant_type=authorization_code" +
                "&client_id=" + clientId +
                "&client_secret=" + clientSecret +
                "&redirect_uri=" + redirectLinkUri +
                "&code=" + code +
                "&state=" + state;

        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> tokenResponse = restTemplate.getForEntity(tokenUrl, String.class);

        String accessToken = extractAccessToken(tokenResponse.getBody());
        String email = getUserEmail(accessToken);

        String redirectUrl = "http://localhost:3000/naver/linkcallbackUi?email=" + email;
        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(URI.create(redirectUrl));
        return new ResponseEntity<>(headers, HttpStatus.FOUND);
    }

    // 네이버 액세스 토큰 추출
    private String extractAccessToken(String responseBody) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode rootNode = objectMapper.readTree(responseBody);
            return rootNode.get("access_token").asText();
        } catch (Exception e) {
            throw new RuntimeException("Failed to extract access token", e);
        }
    }

    // 네이버 액세스 토큰으로 네이버 사용자 정보 API 호출
    private String getUserEmail(String accessToken) {
        String userInfoUrl = "https://openapi.naver.com/v1/nid/me";

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + accessToken);

        HttpEntity<String> request = new HttpEntity<>(headers);
        RestTemplate restTemplate = new RestTemplate();

        ResponseEntity<String> response = restTemplate.exchange(userInfoUrl, HttpMethod.GET, request, String.class);

        return extractEmail(response.getBody());
    }

    // 네이버 응답에서 사용자 이메일 추출
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

