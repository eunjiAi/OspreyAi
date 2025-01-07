package org.myweb.ospreyai.member.model.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Autowired
    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendEmail(String to, String subject, String text) {
        try {
            // 이메일 메시지 생성
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to); // 수신자 이메일 주소
            message.setSubject(subject); // 이메일 제목
            message.setText(text); // 이메일 본문

            // 이메일 전송
            mailSender.send(message);
            System.out.println("이메일 전송 성공: " + to);
        } catch (Exception e) {
            System.err.println("이메일 전송 실패: " + e.getMessage());
            throw new RuntimeException("이메일 전송에 실패했습니다.", e);
        }
    }
}
