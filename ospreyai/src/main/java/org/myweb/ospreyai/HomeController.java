package org.myweb.ospreyai;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class HomeController {

	private static final Logger logger = LoggerFactory.getLogger(HomeController.class);

	@GetMapping("/home")
	public Map<String, String> home() {
		logger.info("Home endpoint accessed");  		// 엔드포인트 접근 로그
		Map<String, String> response = new HashMap<>();
		response.put("message", "!! OspreyAI Home API 테스트 !!");

		// 메시지를 반환하기 전에 출력
		logger.info("Returning response: {}", response);

		return response; // JSON 형식으로 반환
	}
}
