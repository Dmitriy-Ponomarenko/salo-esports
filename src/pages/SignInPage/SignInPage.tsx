import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import Footer from '../../components/Footer/Footer';
import Header from '../../components/Header/Header';

import styles from './SignInPage.module.css';

const SignInPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // TODO: Implement sign in logic
      console.info('Sign in attempt:', { email, password });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.signInPage}>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.formWrapper}>
            <div className={styles.content}>
              <h1 className={styles.title}>Вход</h1>
              <p className={styles.subtitle}>Добро пожаловать в SALO ESPORTS</p>

              <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                  <label htmlFor="email" className={styles.label}>
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    className={styles.input}
                    placeholder="your@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="password" className={styles.label}>
                    Пароль
                  </label>
                  <input
                    id="password"
                    type="password"
                    className={styles.input}
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={isLoading}
                >
                  {isLoading ? 'Загрузка...' : 'Войти'}
                </button>
              </form>

              <div className={styles.divider}></div>

              <p className={styles.switchText}>
                Нет аккаунта?{' '}
                <Link to="/register" className={styles.link}>
                  Зарегестрироваться
                </Link>
              </p>

              <Link to="/" className={styles.backLink}>
                ← Вернуться на главную
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SignInPage;
