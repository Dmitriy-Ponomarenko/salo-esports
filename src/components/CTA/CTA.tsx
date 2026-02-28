import React from 'react';

import styles from './CTA.module.css';

const CTA: React.FC = () => {
  return (
    <section className={styles.cta}>
      <div className="container">
        <h2 className={styles.ctaTitle}>Готов к новому уровню?</h2>
        <p className={styles.ctaText}>
          Присоединяйся к нашей платформе и начни тренироваться как профи.
        </p>
        <button className={styles.btnPrimary}>Зарегистрироваться</button>
      </div>
    </section>
  );
};

export default CTA;
