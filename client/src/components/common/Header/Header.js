import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css'; // 추가된 CSS 파일 경로

function Header() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/" className="project-name">OspreyAI</Link> {/* 프로젝트 이름에 Home 링크 추가 */}
        </div>

        <ul className="navbar-menu">

          <li className="navbar-item dropdown">
            <Link to="/SquatFeedback" className="navbar-link">스쿼트피드백AI</Link>
            <ul className="dropdown-menu">

              <li><Link to="/about/team" className="dropdown-link">Our Team</Link></li>

            </ul>
          </li>

          <li className="navbar-item dropdown">
            <Link to="/Board" className="navbar-link">공지사항</Link>
            <ul className="dropdown-menu">
              <li><Link to="/upload/images" className="dropdown-link">Upload Images</Link></li>

            </ul>
          </li>

          <li className="navbar-item dropdown">
            <Link to="/Board" className="navbar-link">게시판</Link>
            <ul className="dropdown-menu">
              <li><Link to="/upload/images" className="dropdown-link">Upload Images</Link></li>

            </ul>
          </li>

          <li className="navbar-item dropdown">
            <Link to="/Login" className="navbar-link">로그인</Link>
            <ul className="dropdown-menu">
              <li><Link to="/upload/images" className="dropdown-link">Upload Images</Link></li>

            </ul>
          </li>

          {/* <li className="navbar-item dropdown">
            <Link to="/MyPage" className="navbar-link">MyPage</Link>
            <ul className="dropdown-menu">
              <li><Link to="/upload/images" className="dropdown-link">Upload Images</Link></li>

            </ul>
          </li> */}

        </ul>
      </div>
    </nav>
  );
}

export default Header;
