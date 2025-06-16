// src/components/AuthForm.js
import React, { useState } from 'react';
import AuthLayout from './layout/AuthLayout';
import LoginForm from './forms/LoginForm';
import RegisterForm from './forms/RegisterForm';
import { mockUsers } from '../data/mockData';

const AuthForm = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');

  const handleLogin = (formData) => {
    setError('');
    const user = mockUsers.find(u => 
      u.email === formData.email && u.password === formData.password
    );
    if (user) {
      onLogin(user);
    } else {
      setError('Invalid credentials. Please check your email and password.');
    }
  };

  const handleRegister = (formData) => {
    setError('');
    if (formData.name && formData.email && formData.password && formData.role) {
      const newUser = {
        id: Date.now(),
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      };
      onLogin(newUser);
    } else {
      setError('Please fill in all required fields.');
    }
  };

  const switchToLogin = () => {
    setIsLogin(true);
    setError('');
  };

  const switchToRegister = () => {
    setIsLogin(false);
    setError('');
  };

  return (
    <AuthLayout
      title={isLogin ? 'Welcome Back' : 'Join TPA'}
      subtitle={isLogin ? 'Sign in to your account' : 'Create your account to get started'}
    >
      {isLogin ? (
        <LoginForm
          onSubmit={handleLogin}
          switchToRegister={switchToRegister}
          error={error}
        />
      ) : (
        <RegisterForm
          onSubmit={handleRegister}
          switchToLogin={switchToLogin}
          error={error}
        />
      )}
    </AuthLayout>
  );
};

export default AuthForm;