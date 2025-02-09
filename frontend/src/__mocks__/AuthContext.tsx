import React, { createContext } from 'react';
import { AuthContextType } from '../contexts/AuthContext';
import { mockAuthContextValue } from './mockAuthData';

const MockAuthContext = createContext<AuthContextType>(mockAuthContextValue);

export const MockAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <MockAuthContext.Provider value={mockAuthContextValue}>
      {children}
    </MockAuthContext.Provider>
  );
};

export const mockAuthContext = mockAuthContextValue;
