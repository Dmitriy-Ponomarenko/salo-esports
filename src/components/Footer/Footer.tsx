import React from 'react';

import styles from './Footer.module.css';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p>&copy; 2026 SALO ESPORTS. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
