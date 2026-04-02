import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import Footer from '../../components/Footer/Footer';
import Header from '../../components/Header/Header';

import styles from './SignUpPage.module.css';

const SignUpPage: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Имя пользователя обязательно';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Имя должно быть минимум 3 символа';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email обязателен';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Некорректный email';
    }

    if (!formData.password) {
      newErrors.password = 'Пароль обязателен';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Пароль должен быть минимум 6 символов';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // TODO: Implement sign up logic
      console.info('Sign up attempt:', {
        username: formData.username,
        email: formData.email,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value,
    }));
    if (field in errors && (errors[field] ?? '').length > 0) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <div className={styles.signUpPage}>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.formWrapper}>
            <div className={styles.content}>
              <h1 className={styles.title}>Регистрация</h1>
              <p className={styles.subtitle}>
                Присоединись к SALO ESPORTS сообществу
              </p>

              <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                  <label htmlFor="username" className={styles.label}>
                    Имя пользователя
                  </label>
                  <input
                    id="username"
                    type="text"
                    className={`${styles.input} ${(errors.username ?? '').length > 0 ? styles.inputError : ''}`}
                    placeholder="your_username"
                    value={formData.username}
                    onChange={e => handleChange(e, 'username')}
                    required
                  />
                  {(errors.username ?? '').length > 0 && (
                    <span className={styles.errorMessage}>
                      {errors.username}
                    </span>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email" className={styles.label}>
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    className={`${styles.input} ${(errors.email ?? '').length > 0 ? styles.inputError : ''}`}
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={e => handleChange(e, 'email')}
                    required
                  />
                  {(errors.email ?? '').length > 0 && (
                    <span className={styles.errorMessage}>{errors.email}</span>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="password" className={styles.label}>
                    Пароль
                  </label>
                  <input
                    id="password"
                    type="password"
                    className={`${styles.input} ${(errors.password ?? '').length > 0 ? styles.inputError : ''}`}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={e => handleChange(e, 'password')}
                    required
                  />
                  {(errors.password ?? '').length > 0 && (
                    <span className={styles.errorMessage}>
                      {errors.password}
                    </span>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="confirmPassword" className={styles.label}>
                    Подтвердить пароль
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    className={`${styles.input} ${(errors.confirmPassword ?? '').length > 0 ? styles.inputError : ''}`}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={e => handleChange(e, 'confirmPassword')}
                    required
                  />
                  {(errors.confirmPassword ?? '').length > 0 && (
                    <span className={styles.errorMessage}>
                      {errors.confirmPassword}
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={isLoading}
                >
                  {isLoading ? 'Загрузка...' : 'Зарегестрироваться'}
                </button>
              </form>

              <div className={styles.divider}></div>

              <p className={styles.switchText}>
                Уже есть аккаунт?{' '}
                <Link to="/login" className={styles.link}>
                  Войти
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

export default SignUpPage;
