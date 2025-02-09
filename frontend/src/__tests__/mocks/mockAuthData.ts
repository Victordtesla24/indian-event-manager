import { User, AuthContextType } from '../../contexts/AuthContext';
import '@testing-library/jest-dom';
import { jest } from '@jest/globals';

export const mockUser: User = {
  id: 1,
  email: 'test@example.com',
  name: 'Test User',
  role: 'user',
};

export const mockLogin = jest.fn((_email: string, _password: string) => Promise.resolve());
export const mockRegister = jest.fn((_email: string, _password: string, _name: string) => Promise.resolve());
export const mockLogout = jest.fn(() => Promise.resolve());
export const mockSetUser = jest.fn();
export const mockSetIsAuthenticated = jest.fn();

export const mockAuthContext: AuthContextType = {
  user: mockUser,
  isAuthenticated: true,
  login: mockLogin,
  register: mockRegister,
  logout: mockLogout,
};

describe('Mock Auth Data', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should have valid user data', () => {
    expect(mockUser).toHaveProperty('id');
    expect(mockUser).toHaveProperty('email');
    expect(mockUser).toHaveProperty('name');
    expect(mockUser).toHaveProperty('role');
  });

  it('should have valid auth context', () => {
    expect(mockAuthContext).toHaveProperty('user');
    expect(mockAuthContext).toHaveProperty('isAuthenticated');
    expect(mockAuthContext).toHaveProperty('login');
    expect(mockAuthContext).toHaveProperty('register');
    expect(mockAuthContext).toHaveProperty('logout');
  });

  it('should provide mock functions', () => {
    expect(typeof mockLogin).toBe('function');
    expect(typeof mockRegister).toBe('function');
    expect(typeof mockLogout).toBe('function');
    expect(typeof mockSetUser).toBe('function');
    expect(typeof mockSetIsAuthenticated).toBe('function');
  });

  it('should mock login function correctly', async () => {
    await mockAuthContext.login('test@example.com', 'password');
    expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password');
  });

  it('should mock register function correctly', async () => {
    await mockAuthContext.register('test@example.com', 'password', 'Test User');
    expect(mockRegister).toHaveBeenCalledWith('test@example.com', 'password', 'Test User');
  });

  it('should mock logout function correctly', async () => {
    await mockAuthContext.logout();
    expect(mockLogout).toHaveBeenCalled();
  });
});
