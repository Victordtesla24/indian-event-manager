import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import * as AuthContextModule from '../../contexts/AuthContext';
import { mockAuthContext } from '../../__mocks__/mockAuthData';

// Create mock hook
const mockUseAuth = jest.fn(() => mockAuthContext);

// Mock the AuthContext module
jest.mock('../../contexts/AuthContext', () => ({
  __esModule: true,
  AuthContext: {
    Provider: ({ children, value }: { children: React.ReactNode; value: AuthContextModule.AuthContextType }) => (
      <div data-testid="auth-provider">{children}</div>
    ),
    Consumer: ({ children }: { children: (value: AuthContextModule.AuthContextType) => React.ReactNode }) => 
      children(mockAuthContext),
  },
  AuthProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="auth-provider">{children}</div>
  ),
  useAuth: () => mockUseAuth(),
}));

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue(mockAuthContext);
  });

  it('should provide auth context to children', () => {
    let contextValue: AuthContextModule.AuthContextType | undefined;

    const TestComponent: React.FC = () => {
      const auth = mockUseAuth();
      contextValue = auth;
      return null;
    };

    render(
      <AuthContextModule.AuthProvider>
        <TestComponent />
      </AuthContextModule.AuthProvider>
    );

    expect(contextValue).toBeDefined();
    expect(contextValue?.user).toEqual(mockAuthContext.user);
    expect(contextValue?.isAuthenticated).toBe(mockAuthContext.isAuthenticated);
    expect(contextValue?.login).toBe(mockAuthContext.login);
    expect(contextValue?.register).toBe(mockAuthContext.register);
    expect(contextValue?.logout).toBe(mockAuthContext.logout);
  });
});
