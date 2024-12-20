import React from 'react';
import { Link } from 'react-router-dom';
import styles from './SideMenu.module.css'; 

function SideMenu() {
  return (
    <aside className={styles.sideMenu}>
      <ul className={styles.menuList}>
        <li><Link to="/profile">내 프로필</Link></li>
        <li><Link to="/settings">설정</Link></li>
        <li><Link to="/help">도움말</Link></li>
        <li><Link to="/logout">로그아웃</Link></li>
      </ul>
    </aside>
  );
}

export default SideMenu;
