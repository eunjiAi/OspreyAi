-- test_user 추가
INSERT INTO Member (uuid, name, nickname, email, pw, phone_number, gender, admin_yn, face_id, enroll_date, lastmodified, signtype, login_ok)
VALUES ('test_user', '테스트 사용자', 'test_user', 'test@example.com', 'adminpass', '01012345678', 'F', 'Y', NULL, SYSDATE, NULL, 'direct', 'Y');

-- 추가적인 더미 데이터
INSERT INTO Member (uuid, name, nickname, email, pw, phone_number, gender, admin_yn, face_id, enroll_date, lastmodified, signtype, login_ok)
VALUES ('uuid-1', 'Alice', 'Alice', 'alice@example.com', 'password123', '010-1234-5678', 'M', 'N', 'face-1', SYSDATE, NULL, 'direct', 'Y');

INSERT INTO Member (uuid, name, nickname, email, pw, phone_number, gender, admin_yn, face_id, enroll_date, lastmodified, signtype, login_ok)
VALUES ('uuid-2', 'Bob', 'Bob', 'bob@example.com', 'password123', '010-9876-5432', 'F', 'N', 'face-2', SYSDATE, SYSDATE, 'direct', 'Y');

INSERT INTO Member (uuid, name, nickname, email, pw, phone_number, gender, admin_yn, face_id, enroll_date, lastmodified, signtype, login_ok)
VALUES ('uuid-3', 'Charlie', 'Charlie', 'charlie@example.com', 'password123', '010-5678-1234', 'F', 'N', 'face-3', SYSDATE, NULL, 'direct', 'Y');

INSERT INTO Member (uuid, name, nickname, email, pw, phone_number, gender, admin_yn, face_id, enroll_date, lastmodified, signtype, login_ok)
VALUES ('uuid-4', 'Shayne', 'Shayne', 'smtt22@example.com', '$2a$10$qlpgw16FieOHTMVaMiQG6uwxsywy3SRLlhDbtE4ZQq8uSYql3SXBa', '010-0101-1234', 'M', 'Y', 'face-4', SYSDATE, NULL, 'direct', 'Y');


-- 공지사항 더미 데이터
INSERT INTO NOTICE (NOTICE_NO, NTITLE, NCONTENT, NWRITER, NCREATED_AT, OFILENAME, RFILENAME, NCOUNT)
VALUES (1, '신년 이벤트 안내', '2024년 새해를 맞이하여 특별 이벤트를 진행합니다.', '관리자', SYSDATE, 'event.jpg', 'event_resized.jpg', 15);

INSERT INTO NOTICE (NOTICE_NO, NTITLE, NCONTENT, NWRITER, NCREATED_AT, OFILENAME, RFILENAME, NCOUNT)
VALUES (2, '서비스 점검 공지', '서비스 점검이 2024년 1월 10일에 진행될 예정입니다.', '운영팀', SYSDATE - 5, NULL, NULL, 25);

INSERT INTO NOTICE (NOTICE_NO, NTITLE, NCONTENT, NWRITER, NCREATED_AT, OFILENAME, RFILENAME, NCOUNT)
VALUES (3, '새로운 기능 업데이트', '새롭게 추가된 기능을 소개합니다.', '개발팀', SYSDATE - 10, 'update.jpg', 'update_resized.jpg', 50);

INSERT INTO NOTICE (NOTICE_NO, NTITLE, NCONTENT, NWRITER, NCREATED_AT, OFILENAME, RFILENAME, NCOUNT)
VALUES (4, '긴급 보안 패치 공지', '보안 취약점을 해결하기 위한 긴급 패치를 적용합니다.', '보안팀', SYSDATE - 1, NULL, NULL, 100);


-- FAQ 더미 데이터
insert into faq
values (1, '배 지방을 어떻게 빼나요?', '운동을 열심히 하고 있는데 배에 있는 지방이 잘 빠지지 않아요. 어떻게 해야 하나요?',
'Q', 0, to_date('2024-03-12'), 1, 'smtt22@example.com');

insert into faq
values (3, '근육을 키우기 위한 가장 좋은 운동은 무엇인가요?', '근육을 키우고 싶은데 어떤 운동이 효과적인가요?',
'Q', 0, to_date('2024-04-11'), 3, 'smtt22@example.com');

insert into faq
values (5, '운동은 얼마나 자주 해야 하나요?', '운동을 시작하려고 하는데, 주 몇 회 운동을 해야 하나요?',
'Q', 0, to_date('2024-04-11'), 5, 'smtt22@example.com');

insert into faq
values (7, '다이어트를 위한 최적의 식단은 무엇인가요?', 
        '다이어트를 위해서는 탄수화물 섭취를 줄이고 단백질을 충분히 섭취하는 것이 중요합니다. 또한 저지방, 고단백 식단을 유지하며, 과일과 채소를 많이 섭취해야 합니다. 칼로리 섭취를 감소시키는 동시에 영양소를 고르게 분배해야 합니다.',
        'Q', 0, to_date('2024-06-01'), 7, 'smtt22@example.com');

insert into faq
values (8, '유산소 운동과 근력 운동을 병행해야 하나요?', 
        '유산소 운동과 근력 운동을 병행하는 것이 좋습니다. 유산소 운동은 심혈관 건강에 좋고, 근력 운동은 근육을 발달시키는 데 도움을 줍니다. 둘을 병행하면 체지방 감소와 근육량 증가에 모두 효과적입니다.',
        'Q', 0, to_date('2024-06-01'), 8, 'smtt22@example.com');

insert into faq
values (9, '스트레칭을 언제 해야 하나요?', 
        '운동 전 후에 스트레칭을 하는 것이 중요합니다. 운동 전에는 가벼운 스트레칭으로 근육을 풀어주고, 운동 후에는 근육 이완을 위해 스트레칭을 해주어야 합니다. 이를 통해 부상 예방과 유연성 향상에 도움이 됩니다.',
        'Q', 0, to_date('2024-06-01'), 9, 'smtt22@example.com');
        
insert into faq
values (13, '자세를 교정하려면 어떻게 해야 하나요?', 
        '평소 앉아있는 시간이 많고, 컴퓨터를 자주 사용해서 어깨가 굽고, 허리가 아파요. 자세를 개선하려면 어떻게 해야 하나요?',
        'Q', 0, to_date('2024-06-15', 'YYYY-MM-DD'), 13, 'smtt22@example.com');

insert into faq
values (14, '어깨 통증을 완화하려면 어떤 운동을 해야 하나요?', 
        '어깨가 자주 아프고 운동할 때 통증이 발생합니다. 어깨 통증을 완화하려면 어떤 운동을 해야 하나요?',
        'Q', 0, to_date('2024-06-20', 'YYYY-MM-DD'), 14, 'smtt22@example.com');

insert into faq
values (15, '하체 근육을 키우려면 어떤 운동을 해야 하나요?', 
        '하체 근육을 키우기 위한 운동을 알고 싶습니다. 어떤 운동을 하면 좋을까요?',
        'Q', 0, to_date('2024-06-22', 'YYYY-MM-DD'), 15, 'smtt22@example.com');

insert into faq
values (16, '허리 통증 예방을 위한 운동은 무엇인가요?', 
        '허리 통증이 자주 발생하는데, 예방을 위한 운동이나 스트레칭은 무엇이 있을까요?',
        'Q', 0, to_date('2024-06-25', 'YYYY-MM-DD'), 16, 'smtt22@example.com');

insert into faq
values (17, '상체를 키우기 위한 운동 추천', 
        '상체를 키우고 싶은데 어떤 운동이 좋을까요? 특히 어깨와 팔 근육을 키우는 방법을 알고 싶습니다.',
        'Q', 0, to_date('2024-06-28', 'YYYY-MM-DD'), 17, 'smtt22@example.com');
        
insert into faq
values (23, '무릎 통증을 완화하는 운동', 
        '무릎 통증을 완화하려면 어떤 운동을 해야 하나요? 스쿼트와 같은 하체 운동을 할 때 무릎에 부담이 가는데, 이를 완화할 수 있는 운동이 있을까요?',
        'Q', 0, to_date('2024-07-01', 'YYYY-MM-DD'), 23, 'smtt22@example.com');

insert into faq
values (24, '피트니스 목표 설정 방법', 
        '피트니스 목표를 설정하려면 어떻게 해야 하나요? 운동을 시작했는데 목표를 어떻게 설정하고 계획을 세워야 할지 모르겠습니다.',
        'Q', 0, to_date('2024-07-05', 'YYYY-MM-DD'), 24, 'smtt22@example.com');

insert into faq
values (25, '체중 감량을 위한 운동 루틴', 
        '체중을 감량하기 위한 운동 루틴은 어떤 것이 좋을까요? 유산소 운동과 근력 운동을 어떻게 조합해야 할지 알고 싶습니다.',
        'Q', 0, to_date('2024-07-08', 'YYYY-MM-DD'), 25, 'smtt22@example.com');

-- 답글등록
insert into faq
values (2, '배 지방을 효과적으로 빼는 방법', '배 지방을 빼려면 칼로리 섭취를 줄이고 유산소 운동을 꾸준히 해야 합니다. 달리기, 자전거 타기, HIIT 운동 등이 효과적입니다. 또한 근력 운동을 병행하여 근육을 키우는 것도 지방 연소에 도움을 줍니다. 건강한 식단을 유지하고 칼로리 부족 상태를 만들어야 합니다.',
'A', 0, to_date('2024-03-12'), 1, 'smtt22@example.com');

insert into faq
values (4, '근육을 키우는 최고의 운동들', '근육을 키우기 위해서는 스쿼트, 데드리프트, 벤치프레스, 풀업, 오버헤드 프레스와 같은 복합 운동이 효과적입니다. 여러 근육을 동시에 자극하는 복합 운동에 집중하세요. 근력이 늘어날수록 점진적으로 무게를 증가시켜야 근육 성장을 자극할 수 있습니다.',
'A', 0, to_date('2024-05-15'), 3, 'smtt22@example.com');

insert into faq
values (6, '운동 빈도에 대한 최적의 가이드', '초보자의 경우, 일주일에 3-4일 정도 운동하는 것이 이상적입니다. 유산소 운동과 근력 운동을 번갈아가며 하는 것이 좋습니다. 경험이 쌓이면 주 5-6일로 늘릴 수 있지만, 과도한 운동을 피하고 근육 회복을 위한 휴식도 중요합니다.',
'A', 0, to_date('2024-05-15'), 5, 'smtt22@example.com');

insert into faq
values (10, '다이어트를 위한 최적의 식단은 무엇인가요?', 
        '다이어트를 위한 식단은 칼로리 섭취를 줄이되, 단백질 섭취를 충분히 유지해야 합니다. 또한, 식이섬유가 풍부한 채소와 과일을 포함시키고, 가공된 탄수화물보다는 복합 탄수화물을 선택하는 것이 좋습니다.',
        'A', 0, to_date('2024-06-01'), 7, 'smtt22@example.com');

insert into faq
values (11, '유산소 운동과 근력 운동을 병행해야 하나요?', 
        '유산소 운동과 근력 운동을 병행하면 서로 보완적인 효과를 발휘합니다. 유산소 운동으로 체지방을 감소시키고, 근력 운동으로 근육을 키우면 체형 개선에 매우 효과적입니다.',
        'A', 0, to_date('2024-06-01'), 8, 'smtt22@example.com');

insert into faq
values (12, '스트레칭을 언제 해야 하나요?', 
        '스트레칭은 운동 전후 모두 중요합니다. 운동 전에는 부상 예방을 위해 동적 스트레칭을 하고, 운동 후에는 근육의 이완과 회복을 위해 정적 스트레칭을 해주는 것이 좋습니다.',
        'A', 0, to_date('2024-06-01'), 9, 'smtt22@example.com');
        
insert into faq
values (18, '자세 교정 운동', 
        '자세 교정을 위해서는 하루에 몇 분씩이라도 스트레칭을 하는 것이 중요합니다. 특히, 가슴을 열어주는 스트레칭과 등 근육을 강화하는 운동을 병행하세요. 또한, 바른 앉는 자세와 서 있는 자세를 지속적으로 유지하는 것이 중요합니다.',
        'A', 0, to_date('2024-06-15', 'YYYY-MM-DD'), 13, 'smtt22@example.com');

insert into faq
values (19, '어깨 통증 완화를 위한 운동', 
        '어깨 통증을 완화하기 위해서는 어깨 회전근개를 강화하는 운동이 필요합니다. 예를 들어, 덤벨을 이용한 어깨 외회전 운동과 밴드를 이용한 어깨 운동을 꾸준히 해주세요. 또한, 어깨를 자주 풀어주고, 지나치게 무리한 운동은 피하는 것이 중요합니다.',
        'A', 0, to_date('2024-06-20', 'YYYY-MM-DD'), 14, 'smtt22@example.com');

insert into faq
values (20, '하체 근육을 키우는 운동', 
        '하체 근육을 키우기 위해서는 스쿼트, 런지, 데드리프트와 같은 복합 운동을 꾸준히 해야 합니다. 또한, 하체 운동 후 충분한 휴식과 식이 조절이 중요합니다. 하체 근육은 다른 부위보다 더 큰 근육군이므로 체중을 점진적으로 증가시키는 것이 효과적입니다.',
        'A', 0, to_date('2024-06-22', 'YYYY-MM-DD'), 15, 'smtt22@example.com');

insert into faq
values (21, '허리 통증 예방을 위한 운동', 
        '허리 통증 예방을 위해서는 코어 근육을 강화하는 운동이 중요합니다. 플랭크, 브릿지, 힙 쓰러스트와 같은 운동이 효과적이며, 요가나 필라테스도 허리 건강에 도움이 됩니다. 바른 자세를 유지하고 무리하지 않게 운동을 해야 합니다.',
        'A', 0, to_date('2024-06-25', 'YYYY-MM-DD'), 16, 'smtt22@example.com');

insert into faq
values (22, '상체 근육을 키우는 운동', 
        '상체 근육을 키우기 위해서는 벤치프레스, 푸시업, 풀업, 어깨 프레스 등의 복합 운동이 필요합니다. 팔꿈치와 어깨를 안전하게 보호하면서 운동하고, 점진적으로 무게를 증가시켜 주세요. 꾸준한 운동과 충분한 휴식이 필수입니다.',
        'A', 0, to_date('2024-06-28', 'YYYY-MM-DD'), 17, 'smtt22@example.com');
        
insert into faq
values (26, '무릎 통증을 완화하는 운동', 
        '무릎 통증을 완화하려면 무릎을 굽히는 운동을 자제하고, 하체 근육을 강화하는 운동을 하는 것이 좋습니다. 레그 프레스, 다리 들어올리기 운동 등이 도움이 됩니다. 또한, 무릎을 스트레칭하고 유연성을 높여주는 운동도 필요합니다.',
        'A', 0, to_date('2024-07-01', 'YYYY-MM-DD'), 23, 'smtt22@example.com');

insert into faq
values (27, '피트니스 목표 설정 방법', 
        '피트니스 목표를 설정하려면 현실적이고 측정 가능한 목표를 설정하세요. 예를 들어, "3개월 내에 5kg 감량" 또는 "주 3회 운동"처럼 구체적인 목표를 설정하고, 목표에 맞는 운동 계획을 수립하세요.',
        'A', 0, to_date('2024-07-05', 'YYYY-MM-DD'), 24, 'smtt22@example.com');

insert into faq
values (28, '체중 감량을 위한 운동 루틴', 
        '체중 감량을 위해서는 유산소 운동을 30분 이상 꾸준히 하고, 근력 운동을 병행하는 것이 좋습니다. HIIT 운동이나 조깅, 자전거 타기 등의 유산소 운동과 함께 스쿼트, 푸시업, 덤벨 운동을 추가하는 것이 효과적입니다.',
        'A', 0, to_date('2024-07-08', 'YYYY-MM-DD'), 25, 'smtt22@example.com');

COMMIT;