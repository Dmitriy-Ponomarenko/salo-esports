import React from 'react';

import styles from './Features.module.css';

const featuresData = [
  {
    icon: '📊',
    title: 'Аналитика VOD',
    desc: 'Загружайте записи игр для автоматического разбора ключевых моментов, ошибок и таймингов.',
  },
  {
    icon: '📅',
    title: 'Умный планировщик',
    desc: 'Координация скримов и тренировок. У каждого участника свое расписание.',
  },
  {
    icon: '🧠',
    title: 'База знаний',
    desc: 'Актуальная мета, разбор драфтов и тактические наработки команды.',
  },
];

const Features: React.FC = () => {
  return (
    <section id="features" className={styles.features}>
      <div className={styles.container}>
        <h2 className={styles.featuresTitle}>Функционал платформы</h2>
        <div className={styles.featuresGrid}>
          {featuresData.map((feature, index) => (
            <div key={index} className={styles.featureCard}>
              <div className={styles.featureIcon}>{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
