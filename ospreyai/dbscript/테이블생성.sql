

-- member 테이블
DROP TABLE IF EXISTS `member`;

CREATE TABLE `member` (
    `uuid` VARCHAR(36) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `pw` VARCHAR(255) NOT NULL,
    `phone_number` VARCHAR(15) NOT NULL,
    `join_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `is_admin` TINYINT DEFAULT 0,
    `face_id` VARCHAR(255) NULL,
    PRIMARY KEY (`uuid`)
);

-- Squatfeedback 테이블
DROP TABLE IF EXISTS `Squatfeedback`;

CREATE TABLE `Squatfeedback` (
    `squat_id` INT NOT NULL,
    `uuid` VARCHAR(36) NOT NULL,
    `total_attempts` INT NOT NULL,
    `correct_count` INT NOT NULL,
    `squat_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`squat_id`, `uuid`),
    CONSTRAINT `FK_MEMBER_SQUATFEEDBACK` FOREIGN KEY (`uuid`) REFERENCES `member` (`uuid`)
);

-- Posts 테이블
DROP TABLE IF EXISTS `Posts`;

CREATE TABLE `Posts` (
    `post_id` INT NOT NULL,
    `uuid` VARCHAR(36) NOT NULL,
    `title` VARCHAR(200) NOT NULL,
    `content` TEXT NOT NULL,
    `report_status` TINYINT NOT NULL,
    `is_public` TINYINT NOT NULL,
    `post_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`post_id`, `uuid`),
    CONSTRAINT `FK_MEMBER_POSTS` FOREIGN KEY (`uuid`) REFERENCES `member` (`uuid`)
);
