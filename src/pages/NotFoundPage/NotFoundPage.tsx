import React from 'react';
import { Link } from 'react-router-dom';

import styles from './NotFoundPage.module.css';

const NotFoundPage: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.backgroundElements}>
        <div className={styles.particle}></div>
        <div className={styles.particle}></div>
        <div className={styles.particle}></div>
      </div>

      <div className={styles.content}>
        <div className={styles.glitchWrapper}>
          <h1 className={styles.glitch} data-text="404">
            404
          </h1>
        </div>

        <p className={styles.subtitle}>ERROR: CONNECTION LOST</p>

        <p className={styles.description}>
          Кажется, вы заблудились в цифровом пространстве. Запрошенная страница
          не найдена.
        </p>

        <Link to="/" className={styles.button}>
          <span className={styles.buttonText}>Вернуться на базу</span>
          <span className={styles.buttonIcon}>🚀</span>
        </Link>
      </div>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        style={{ display: 'none' }}
      >
        <defs>
          <filter id="glitch">
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
              result="red"
            />
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
              result="green"
            />
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
              result="blue"
            />
            <feOffset in="red" dx="-3" dy="0" result="redOffset" />
            <feOffset in="green" dx="3" dy="0" result="greenOffset" />
            <feOffset in="blue" dx="0" dy="0" result="blueOffset" />
            <feMerge>
              <feMergeNode in="redOffset" />
              <feMergeNode in="greenOffset" />
              <feMergeNode in="blueOffset" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>
    </div>
  );
};

export default NotFoundPage;
