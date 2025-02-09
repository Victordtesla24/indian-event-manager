import { User, LoginCredentials, RegisterData } from '../services/authService';

export const mockLogin = jest.fn((credentials: LoginCredentials) => Promise.resolve());
export const mockRegister = jest.fn((data: RegisterData) => Promise.resolve());
export const mockLogout = jest.fn(() => Promise.resolve());

export const mockUser: User = {
  id: 1,
  email: 'test@example.com',
  name: 'Test User',
  role: 'USER',
  isEmailVerified: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

export const mockAuthContextValue = {
  user: mockUser,
  isAuthenticated: true,
  isLoading: false,
  hasRole: (role: string) => mockUser.role === role,
  login: async (credentials: LoginCredentials) => {
    await mockLogin(credentials);
  },
  register: async (data: RegisterData) => {
    await mockRegister(data);
  },
  logout: async () => {
    await mockLogout();
  },
};
