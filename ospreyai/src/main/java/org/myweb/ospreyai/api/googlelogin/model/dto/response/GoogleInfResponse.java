package org.myweb.ospreyai.api.googlelogin.model.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class GoogleInfResponse {
    // 구글 로그인 과정에서 반환되는 값
    private String iss;     // 토큰을 발행한 주체 예 : "https://accounts.google.com"
    private String azp;     // OAuth 2.0 클라이언트 ID, 이 토큰을 사용할 수 있는 클라이언트의 ID
    private String aud;     // 토큰의 대상이 되는 애플리케이션의 클라이언트 ID, 해당 토큰이 특정 애플리케이션에서 유효한지 확인하는 데 사용
    private String sub;     // Google 계정에 연결된 고유한 ID이며, 사용자 식별을 위한 고유 값
    private String email;   // 사용자의 이메일 주소
    private String email_verified;  // 이메일 주소가 검증되었는지를 나타내는 Boolean 값
    private String at_hash;         // Access Token의 해시 값, Access Token의 무결성을 확인하는 데 사용
    private String name;            // 사용자의 전체 이름
    private String picture;         // 사용자의 프로필 이미지 URL
    private String given_name;      // 사용자의 이름(First Name)
    private String family_name;     // 사용자의 성(Last Name)
    private String locale;          // 사용자의 언어 및 지역 정보
    private String iat;     // 토큰 발행 시간
    private String exp;     // 토큰 만료 시간
    private String alg;     // JWT(Json Web Token) 서명에 사용된 알고리즘
    private String kid;     // 서명을 검증하기 위한 키의 ID
    private String typ;     // 토큰의 타입 "JWT"
}
