package org.myweb.ospreyai.member.model.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Autowired
    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendEmail(String to, String subject, String text) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();    // 이메일 객체 생성
            message.setTo(to);                                      // 수신자 이메일 주소
            message.setSubject(subject);                            // 이메일 제목
            message.setText(text);                                  // 이메일 본문

            mailSender.send(message);                               // 이메일 전송
        } catch (Exception e) {
            throw new RuntimeException("이메일 전송에 실패했습니다.", e);
        }
    }
}
