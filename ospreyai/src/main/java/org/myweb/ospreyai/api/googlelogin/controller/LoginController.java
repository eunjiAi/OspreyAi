package org.myweb.ospreyai.api.googlelogin.controller;

import org.myweb.ospreyai.api.googlelogin.model.dto.request.GoogleRequest;
import org.myweb.ospreyai.api.googlelogin.model.dto.response.GoogleInfResponse;
import org.myweb.ospreyai.api.googlelogin.model.dto.response.GoogleResponse;
import org.myweb.ospreyai.member.model.dto.Member;
import org.myweb.ospreyai.member.model.service.MemberService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@CrossOrigin
public class LoginController {
    private final MemberService memberService;

    @Value("${google.client.id}")
    private String googleClientId;
    @Value("${google.client.pw}")
    private String googleClientPw;

    public LoginController(MemberService memberService) {
        this.memberService = memberService;
    }

    @RequestMapping(value="/api/v1/oauth2/google", method = RequestMethod.POST)
    public String loginUrlGoogle(){
        String reqUrl = "https://accounts.google.com/o/oauth2/v2/auth?client_id=" + googleClientId
                + "&redirect_uri=http://localhost:8888/api/v1/oauth2/google&response_type=code&scope=email%20profile%20openid&access_type=offline";
        return reqUrl;
    }
    @RequestMapping(value="/api/v1/oauth2/google", method = RequestMethod.GET)
    public ResponseEntity loginGoogle(@RequestParam(value = "code") String authCode){
        RestTemplate restTemplate = new RestTemplate();
        GoogleRequest googleOAuthRequestParam = GoogleRequest
                .builder()
                .clientId(googleClientId)
                .clientSecret(googleClientPw)
                .code(authCode)
                .redirectUri("http://localhost:8888/api/v1/oauth2/google")
                .grantType("authorization_code").build();
        ResponseEntity<GoogleResponse> resultEntity = restTemplate.postForEntity("https://oauth2.googleapis.com/token",
                googleOAuthRequestParam, GoogleResponse.class);
        String jwtToken=resultEntity.getBody().getId_token();
        Map<String, String> map = new HashMap<>();
        map.put("id_token",jwtToken);
        ResponseEntity<GoogleInfResponse> resultEntity2 = restTemplate.postForEntity("https://oauth2.googleapis.com/tokeninfo",
                map, GoogleInfResponse.class);
        String email = resultEntity2.getBody().getEmail();

        if(memberService.selectCheckEmail(email) < 1) {
            Member member = new Member();
            member.setUuid(UUID.randomUUID().toString());
            member.setName(resultEntity2.getBody().getName());
            member.setNickname(resultEntity2.getBody().getGiven_name());
            member.setEmail(email);
            member.setGender("N");
            member.setAdminYn("N");
            member.setGoogle(email);
            member.setLoginOk("Y");

            memberService.insertMember(member);
        }

        return ResponseEntity.ok().build();

    }
}
