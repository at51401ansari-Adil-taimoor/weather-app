import React, { FormEvent, useState } from 'react';
import { useAuthViewModel } from '../viewmodels/useAuthViewModel';
import './AuthView.css';

type AuthMode = 'login' | 'register';

export function AuthView() {
  const { submitting, error, register, login, clearError } = useAuthViewModel();
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (mode === 'login') {
      await login(email, password);
      return;
    }

    await register(email, password);
  };

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    clearError();
  };

  return (
    <main className="auth-view">
      <section className="auth-card">
        <h1 className="auth-card__title">Weather App</h1>
        <p className="auth-card__subtitle">
          {mode === 'login' ? 'Sign in to save favorite cities' : 'Create an account to get started'}
        </p>

        <div className="auth-card__toggle" role="tablist" aria-label="Authentication mode">
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'login'}
            className={mode === 'login' ? 'auth-card__toggle-button is-active' : 'auth-card__toggle-button'}
            onClick={() => switchMode('login')}
          >
            Login
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'register'}
            className={mode === 'register' ? 'auth-card__toggle-button is-active' : 'auth-card__toggle-button'}
            onClick={() => switchMode('register')}
          >
            Register
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-form__label" htmlFor="auth-email">
            Email
          </label>
          <input
            id="auth-email"
            className="auth-form__input"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
            disabled={submitting}
          />

          <label className="auth-form__label" htmlFor="auth-password">
            Password
          </label>
          <input
            id="auth-password"
            className="auth-form__input"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            minLength={6}
            required
            disabled={submitting}
          />

          {error && (
            <p className="auth-form__error" role="alert">
              {error}
            </p>
          )}

          <button className="auth-form__submit" type="submit" disabled={submitting}>
            {submitting ? 'Please wait...' : mode === 'login' ? 'Login' : 'Register'}
          </button>
        </form>
      </section>
    </main>
  );
}
