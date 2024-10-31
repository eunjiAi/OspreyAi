package org.myweb.first;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Handles requests for the application home page.
 */
@RestController  // @Controller 대신 @RestController 사용
@RequestMapping("/api")
public class HomeController {

	private static final Logger logger = LoggerFactory.getLogger(HomeController.class);

	@GetMapping("/home")
	public String home() {
		// 홈 화면에 표시할 메시지 반환
		logger.info("Home endpoint accessed");
		return "Welcome to the Home Page!";
	}

	@GetMapping("/main")
	public String forwardMain() {
		// 메인 화면에 표시할 메시지 반환
		logger.info("Main endpoint accessed");
		return "Welcome to the Main Page!";
	}
}
