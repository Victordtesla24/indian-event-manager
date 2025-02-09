import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import LoginForm from '../../../components/auth/LoginForm';
import * as AuthContextModule from '../../../contexts/AuthContext';
import { mockLogin } from '../../mocks/mockAuthData';
import { MockAuthProvider } from "../../mocks/AuthContext";
import userEvent from '@testing-library/user-event';

// Create a wrapper component that provides the mocked auth context
const renderWithAuthProvider = (ui: React.ReactElement) => {
  return render(
    <MockAuthProvider>
      {ui}
    </MockAuthProvider>
  );
};

describe('LoginForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render login form', () => {
    const { getByLabelText, getByRole } = renderWithAuthProvider(<LoginForm />);

    expect(getByLabelText(/email/i)).toBeInTheDocument();
    expect(getByLabelText(/password/i)).toBeInTheDocument();
    expect(getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('should handle form submission', async () => {
    // Setup the mock before rendering
    mockLogin.mockResolvedValueOnce(undefined);

    const { getByLabelText, getByRole } = renderWithAuthProvider(<LoginForm />);

    const emailInput = getByLabelText(/email/i);
    const passwordInput = getByLabelText(/password/i);
    const submitButton = getByRole('button', { name: /login/i });

    const user = userEvent.setup();
    await act(async () => { await user.clear(emailInput); });
    await act(async () => { await user.type(emailInput, 'test@example.com'); });
    await waitFor(() => expect(emailInput).toHaveValue('test@example.com'));

    await act(async () => { await user.clear(passwordInput); });
    await act(async () => { await user.type(passwordInput, 'password123'); });
    await waitFor(() => expect(passwordInput).toHaveValue('password123'));

    await act(async () => { await user.click(submitButton); });
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
    }, { timeout: 1000 });
  });
});
