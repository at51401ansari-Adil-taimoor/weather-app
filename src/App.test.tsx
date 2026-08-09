import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders auth view when user is not logged in', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /weather app/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
});
