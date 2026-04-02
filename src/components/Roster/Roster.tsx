import React from 'react';

import styles from './Roster.module.css';

const malePlayers = [
  { name: 'Comming soon', role: 'Roamer', info: 'Shotcaller' },
  { name: 'GS JOKER', role: 'Jungler', info: 'Tempo control' },
  { name: 'Comming soon', role: 'Mid Lane', info: 'Map control' },
  { name: 'BigPapaJone', role: 'Gold Lane', info: 'Damage dealer' },
  { name: "GUJIN'", role: 'EXP Lane', info: 'Frontliner' },
];

const femalePlayers = [
  { name: 'Comming soon', role: 'Roamer', info: 'Shotcaller' },
  { name: 'Nagasaki', role: 'Jungler', info: 'Tempo control' },
  { name: '爱|•Ⲩυⲕⲓ', role: 'Mid Lane', info: 'Map control' },
  { name: 'Comming soon', role: 'Gold Lane', info: 'Damage dealer' },
  { name: 'Lavanda', role: 'EXP Lane', info: 'Frontliner' },
];

const Roster: React.FC = () => {
  return (
    <section id="roster" className={styles.roster}>
      <div className={styles.container}>
        <h2 className={styles.rosterTitle}>Наш мужской состав</h2>
        <div className={styles.rosterGrid}>
          {malePlayers.map(player => (
            <div key={player.name} className={styles.playerCard}>
              <div className={styles.playerRole}>{player.role}</div>
              <div className={styles.playerName}>{player.name}</div>
              <div className={styles.playerInfo}>{player.info}</div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.container}>
        <h2 className={styles.rosterTitle}>Наш женский состав</h2>
        <div className={styles.rosterGrid}>
          {femalePlayers.map(player => (
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
