package org.myweb.ospreyai.SquatFeedback.jpa.entity;

import javax.persistence.*;

@Entity
public class SquatFeedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String userId;
    private int duration;
    private int correctPostureDuration;

    // 기본 생성자, 게터/세터
}
