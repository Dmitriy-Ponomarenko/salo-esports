import React from 'react';

import styles from './Header.module.css';

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          SALO<span>ESPORTS</span>
        </div>
        <nav className={styles.nav}>
          <a href="#features" className={styles.navLink}>
            Функционал
          </a>
          <a href="#roster" className={styles.navLink}>
            Состав
          </a>
          <button className={styles.btnLogin}>Войти</button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
