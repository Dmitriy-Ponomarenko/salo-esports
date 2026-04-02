import React from 'react';
import { Link } from 'react-router-dom';

import styles from './Hero.module.css';

const Hero: React.FC = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <h1 className={styles.heroTitle}>
          Платформа для команды<span>SALO ESPORTS</span> по Mobile Legends
        </h1>
        <p className={styles.heroSubtitle}>
          Аналитика, планирование тренировок и база знаний. Всё необходимое для
          достижения новый высот в одном месте.
        </p>
        <div className={styles.heroBtns}>
          <Link to="/register" className={styles.btnPrimary}>
            Начать использование
          </Link>
          <a href="#features" className={styles.btnSecondary}>
            Узнать больше
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
