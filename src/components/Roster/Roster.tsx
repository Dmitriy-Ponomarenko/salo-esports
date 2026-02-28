import React from 'react';

import styles from './Roster.module.css';

const players = [
  { name: 'CaptainName', role: 'Roamer', info: 'Shotcaller' },
  { name: 'JunglerPro', role: 'Jungler', info: 'Tempo control' },
  { name: 'MidMaster', role: 'Mid Lane', info: 'Map control' },
  { name: 'GoldKing', role: 'Gold Lane', info: 'Damage dealer' },
  { name: 'TopTank', role: 'EXP Lane', info: 'Frontliner' },
];

const Roster: React.FC = () => {
  return (
    <section id="roster" className={styles.roster}>
      <div className={styles.container}>
        <h2 className={styles.rosterTitle}>Наш состав</h2>
        <div className={styles.rosterGrid}>
          {players.map(player => (
            <div key={player.name} className={styles.playerCard}>
              <div className={styles.playerRole}>{player.role}</div>
              <div className={styles.playerName}>{player.name}</div>
              <div className={styles.playerInfo}>{player.info}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Roster;
