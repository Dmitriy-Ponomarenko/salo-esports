import React from 'react';

import styles from './Footer.module.css';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p>&copy; 2026 TEAMNAME. All rights reserved.</p>
        <p>Mobile Legends: Bang Bang</p>
      </div>
    </footer>
  );
};

export default Footer;
