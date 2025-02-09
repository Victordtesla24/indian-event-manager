import React, { useState } from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AuthContext, AuthContextType } from '../../contexts/AuthContext';
import { mockUser, mockLogin, mockRegister, mockLogout } from './mockAuthData';
import { mockLogin as externalMockLogin } from '../../__mocks__/mockAuthData';
import { act } from 'react-dom/test-utils';

export const MockAuthProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthContext.Provider
      value={{
        user: { id: 1, email: 'test@example.com', name: 'Test User', role: 'user' },
        isAuthenticated: true,
        login: mockLogin,
        register: mockRegister,
        logout: mockLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

describe('MockAuthProvider', () => {
  it('should provide auth context to children', () => {
    let contextValue: AuthContextType | undefined;

    const TestComponent = () => {
      return (
        <AuthContext.Consumer>
          {(context: AuthContextType | undefined) => {
            contextValue = context;
            return null;
          }}
        </AuthContext.Consumer>
      );
    };

    render(
      <MockAuthProvider>
        <TestComponent />
      </MockAuthProvider>
    );

    expect(contextValue).toBeDefined();
    expect(contextValue?.user).toStrictEqual(mockUser);
    expect(contextValue?.isAuthenticated).toBe(true);
    expect(contextValue?.login).toBe(mockLogin);
    expect(contextValue?.register).toBe(mockRegister);
    expect(contextValue?.logout).toBe(mockLogout);
  });
});
