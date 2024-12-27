package org.myweb.ospreyai.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    // 리액트 (http://localhost:3000) 에서 오는 요청을 받아 주도록 cross origin 해결 설정임

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*") // 모든 헤더 허용
                .exposedHeaders("Authorization") // Authorization 헤더 노출
                .allowCredentials(true); // 쿠키 포함 허용
    }

}
