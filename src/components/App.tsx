import { Routes, Route } from 'react-router-dom';

import LandingPage from '../pages/LandingPage/LandingPage';
import NotFoundPage from '../pages/NotFoundPage/NotFoundPage';
import ProfilePage from '../pages/ProfilePage/ProfilePage';
import SignInPage from '../pages/SignInPage/SignInPage';
import SignUpPage from '../pages/SignUpPage/SignUpPage';
import './App.css';

export const App = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />

      {/* Authentication routes */}
      <Route path="/login" element={<SignInPage />} />
      <Route path="/register" element={<SignUpPage />} />

      {/* Protected routes */}
      <Route path="/profile/:id" element={<ProfilePage />} />

      {/* 404 route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
