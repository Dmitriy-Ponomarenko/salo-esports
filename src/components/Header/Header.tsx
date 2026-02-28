import React, { useState } from 'react';

import styles from './Header.module.css';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          SALO<span>ESPORTS</span>
        </div>

        <button
          className={styles.menuButton}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <svg className={styles.menuIcon} width="24" height="24">
            <use xlinkHref="/icons.svg#icon-menu" />
          </svg>
        </button>

        <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ''}`}>
          <a href="#features" className={styles.navLink} onClick={closeMenu}>
            Функционал
          </a>
          <a href="#roster" className={styles.navLink} onClick={closeMenu}>
            Состав
          </a>
          <button className={styles.btnLogin} onClick={closeMenu}>
            Войти
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
