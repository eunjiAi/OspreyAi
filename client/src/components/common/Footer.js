
import React from 'react';
import styles from './Footer.module.css';

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.footerLeft}>
          <h2 className={styles.companyName}>OspreyAI</h2>
          <p className={styles.siteName}>AI Real-Time Feedback Platform</p>
          <p className={styles.siteDescription}>
            OspreyAI는 사람의 관절을 추적하고,<br />
             캠 화면에 자세를 비추면 실시간으로 운동 피드백을 보냅니다.
          </p>
        </div>
        <div className={styles.footerRight}>
          <h3 className={styles.contactTitle}>고객지원</h3>
          <p className={styles.contactDetails}>
            Email: ospery7ai@gmail.com
          </p>
          <p className={styles.contactDetails}>
            Phone: +82 10-1234-5678
          </p>
          <p className={styles.contactDetails}>
            Address: 서울 서초구 서초대로 77길 41
          </p>
        </div>
      </div>
      <div className={styles.footerBottom}>
        &copy; 2024 OspreyAI. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
