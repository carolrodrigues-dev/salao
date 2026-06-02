import React from 'react';
import { render, screen } from '@testing-library/react';
import Login from './Login';

test('renders login form', () => {
  render(<Login />);
  const emailInput = screen.getByPlaceholderText('Email');
  const passwordInput = screen.getByPlaceholderText('Senha');

  expect(emailInput).toBeInTheDocument();
  expect(passwordInput).toBeInTheDocument();
});