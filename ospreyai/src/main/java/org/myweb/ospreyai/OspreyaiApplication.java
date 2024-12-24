package org.myweb.ospreyai;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

@SpringBootApplication(exclude = { SecurityAutoConfiguration.class })
//@EntityScan("org.myweb.ospreyai")
//@EnableJpaRepositories("org.myweb.ospreyai")
public class OspreyaiApplication {
    public static void main(String[] args) {
        SpringApplication.run(OspreyaiApplication.class, args);
    }
}
