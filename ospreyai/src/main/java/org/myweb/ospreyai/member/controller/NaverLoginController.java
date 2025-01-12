package org.myweb.ospreyai.member.controller;

import jakarta.servlet.http.HttpSession;
import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.stereotype.Controller;

import java.util.UUID;

@Controller
@Data
public class NaverLoginController {

    @Value("${naver.client_id}")
    private String clientId;
    @Value("${naver.redirect_uri}")
    private String redirectUri;
    @Value("${naver.redirect_linkuri}")
    private String redirectLinkUri;

    // 네이버 로그인
    @GetMapping("/naver/login")
    public String naverLogin(HttpSession session) {
        String state = UUID.randomUUID().toString();
        session.setAttribute("oauthState", state);

        String authUrl = "https://nid.naver.com/oauth2.0/authorize?response_type=code" +
                "&client_id=" + clientId +
                "&redirect_uri=" + redirectUri +
                "&state=" + state;

        return "redirect:" + authUrl;
    }

    // 네이버 연동
    @GetMapping("/naver/link")
    public String naverLink(HttpSession session) {
        String state = UUID.randomUUID().toString();
        session.setAttribute("oauthState", state);

        String authUrl = "https://nid.naver.com/oauth2.0/authorize?response_type=code" +
                "&client_id=" + clientId +
                "&redirect_uri=" + redirectLinkUri +
                "&state=" + state;

        return "redirect:" + authUrl;
    }
}
