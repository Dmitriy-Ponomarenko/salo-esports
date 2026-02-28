import React from 'react';
import { Autoplay, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';

import styles from './Features.module.css';

const featuresData = [
  {
    icon: '📊',
    title: 'Аналитика VOD',
    desc: 'Краткие сборники сыгранных игр для разбора ключевых моментов, ошибок и таймингов',
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

        <div className={styles.swiperWrapper}>
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={20}
            slidesPerView={1}
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            breakpoints={{
              480: {
                slidesPerView: 2,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 30,
              },
            }}
          >
            {featuresData.map((feature, index) => (
              <SwiperSlide key={index}>
                <div className={styles.featureCard}>
                  <div className={styles.featureIcon}>{feature.icon}</div>
                  <h3>{feature.title}</h3>
                  <p>{feature.desc}</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

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
