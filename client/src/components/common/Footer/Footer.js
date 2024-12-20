import React from 'react';
import './Footer.css'; // CSS 파일 불러오기

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-left">
          <div className="footer-logo">
            <span className="footer-project-name">OspreyAI</span>
          </div>
          <p className="footer-description">
            OspreyAI
          </p>
        </div>
        <div className="footer-right">
          <div className="footer-links">
            <a href="/about" className="footer-link">스쿼트피드백AI</a>
            <a href="/services" className="footer-link">공지사항</a>
            <a href="/contact" className="footer-link">게시판</a>
          </div>
          <div className="footer-socials">
            <a href="https://twitter.com" className="footer-social-link" aria-label="Twitter">
              <img src="path/to/twitter-icon.png" alt="Instagram" />
            </a>
            <a href="https://facebook.com" className="footer-social-link" aria-label="Facebook">
              <img src="path/to/facebook-icon.png" alt="Facebook" />
            </a>

          </div>
        </div>
      </div>
      <div className="footer-bottom">
        &copy; 2024 OspreyAI
      </div>
    </footer>
  );
}

export default Footer;
