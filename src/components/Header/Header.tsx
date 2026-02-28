import React, { useState } from 'react';

import styles from './Header.module.css';

const Header: React.FC = () => {
  // Стейт для мобильного меню
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Закрываем меню при клике на ссылку (для якорей)
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          SALO<span>ESPORTS</span>
        </div>

        {/* Кнопка-гамбургер (видна только на мобильных) */}
        <button
          className={styles.menuButton}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span
            className={`${styles.hamburger} ${isMenuOpen ? styles.open : ''}`}
          ></span>
        </button>

        {/* Навигация (меняет стили в зависимости от isMenuOpen) */}
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
