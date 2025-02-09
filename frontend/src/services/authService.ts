import { API_URL, JWT_KEY, REFRESH_KEY, ROLES } from '../config';

export interface User {
  id: number;
  email: string;
  name: string;
  role: keyof typeof ROLES;
  avatar?: string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
  confirmPassword: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

class AuthService {
  private static instance: AuthService;
  private user: User | null = null;
  private tokens: AuthTokens | null = null;

  private constructor() {
    // Load tokens from storage
    const storedTokens = localStorage.getItem(JWT_KEY);
    if (storedTokens) {
      this.tokens = JSON.parse(storedTokens);
    }
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public async login(credentials: LoginCredentials): Promise<User> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();
    this.setTokens(data.tokens);
    this.user = data.user;
    return data.user;
  }

  public async register(data: RegisterData): Promise<User> {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Registration failed');
    }

    const responseData = await response.json();
    this.setTokens(responseData.tokens);
    this.user = responseData.user;
    return responseData.user;
  }

  public async logout(): Promise<void> {
    if (this.tokens?.refresh) {
      try {
        await fetch(`${API_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.tokens.access}`,
          },
          body: JSON.stringify({ refresh_token: this.tokens.refresh }),
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }

    this.clearAuth();
  }

  public async getCurrentUser(): Promise<User | null> {
    if (!this.tokens?.access) return null;

    if (this.user) return this.user;

    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${this.tokens.access}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired, try to refresh
          const refreshed = await this.refreshToken();
          if (!refreshed) {
            this.clearAuth();
            return null;
          }
          return this.getCurrentUser();
        }
        throw new Error('Failed to get current user');
      }

      const user = await response.json();
      this.user = user;
      return user;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  public async refreshToken(): Promise<boolean> {
    if (!this.tokens?.refresh) return false;

    try {
      const response = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: this.tokens.refresh }),
      });

      if (!response.ok) {
        this.clearAuth();
        return false;
      }

      const data = await response.json();
      this.setTokens(data.tokens);
      return true;
    } catch (error) {
      console.error('Token refresh error:', error);
      this.clearAuth();
      return false;
    }
  }

  public isAuthenticated(): boolean {
    return !!this.tokens?.access;
  }

  public hasRole(role: keyof typeof ROLES): boolean {
    return this.user?.role === role;
  }

  public getAccessToken(): string | null {
    return this.tokens?.access || null;
  }

  private setTokens(tokens: AuthTokens): void {
    this.tokens = tokens;
    localStorage.setItem(JWT_KEY, JSON.stringify(tokens));
  }

  private clearAuth(): void {
    this.tokens = null;
    this.user = null;
    localStorage.removeItem(JWT_KEY);
    localStorage.removeItem(REFRESH_KEY);
  }
}

export default AuthService.getInstance();
