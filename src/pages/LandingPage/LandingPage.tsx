import React from 'react';

import About from '../../components/About/About';
import CTA from '../../components/CTA/CTA';
import Features from '../../components/Features/Features';
import Footer from '../../components/Footer/Footer';
import Header from '../../components/Header/Header';
import Hero from '../../components/Hero/Hero';
import Roster from '../../components/Roster/Roster';

import styles from './LandingPage.module.css';

const LandingPage: React.FC = () => {
  return (
    <div className={styles.landingPage}>
      <Header />

      <main>
        <Hero />
        <Features />
        <About />
        <Roster />
        <CTA />
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
