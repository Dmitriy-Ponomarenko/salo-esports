import React from 'react';

import styles from './About.module.css';

const About: React.FC = () => {
  return (
    <section id="about" className={styles.about}>
      <div className={styles.container}>
        <h2 className={styles.aboutTitle}>О нашей команде</h2>
        <p className={styles.aboutText}>
          Мы — амбициозный стак по Mobile Legends, нацеленный на Tier-3 турниры.
          Наша платформа помогает нам анализировать ошибки, планировать
          тренировки и всегда быть на шаг впереди соперников. Мы верим в
          дисциплину и командную работу.
        </p>
      </div>
    </section>
  );
};

export default About;
