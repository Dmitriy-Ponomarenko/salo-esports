import React from 'react';

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
          <button className={styles.btnPrimary}>Начать использование</button>
          <button className={styles.btnSecondary}>Узнать больше</button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
