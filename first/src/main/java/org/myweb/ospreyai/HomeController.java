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
		logger.info("Home endpoint accessed");
		Map<String, String> response = new HashMap<>();
		response.put("message", "Welcome to the Home Page!");
		return response; // JSON 형식으로 반환
	}

	@GetMapping("/main")
	public Map<String, String> forwardMain() {
		logger.info("Main endpoint accessed");
		Map<String, String> response = new HashMap<>();
		response.put("message", "Welcome to the Main Page!");
		return response; // JSON 형식으로 반환
	}
}
