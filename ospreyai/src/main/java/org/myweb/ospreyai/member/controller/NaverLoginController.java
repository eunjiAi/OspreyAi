package org.myweb.ospreyai.member.controller;

import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.stereotype.Controller;

@Controller
@Data
public class NaverLoginController {

    @Value("${naver.client_id}")
    private String clientId;
    @Value("${naver.redirect_uri}")
    private String redirectUri;

    @GetMapping("/naver/login")
    public String naverLogin() {
        String state = "random_state_string"; // CSRF 방지를 위해 랜덤 값 생성
        String authUrl = "https://nid.naver.com/oauth2.0/authorize?response_type=code" +
                "&client_id=" + clientId +
                "&redirect_uri=" + redirectUri +
                "&state=" + state;

        return "redirect:" + authUrl;
    }
}
