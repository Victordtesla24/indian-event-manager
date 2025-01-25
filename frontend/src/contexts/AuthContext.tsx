import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

export interface User {
  id: string;
  email: string;
  full_name: string;
  is_active: boolean;
  is_superuser: boolean;
  role: 'user' | 'admin' | 'sponsor';
  created_at: string;
  updated_at: string;
  admin_level?: string;
  permissions?: string[];
  is_super_admin?: boolean;
  last_login?: string;
  last_active?: string;
  login_count?: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, refreshToken: string) => Promise<void>;
  logout: () => void;
  refreshAuth: () => Promise<boolean>;
  hasRole: (roles: string | string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(() => {
    // Development mode: Set initial user for testing
    if (import.meta.env.DEV) {
      return {
        id: 'test-admin-id',
        email: 'admin@example.com',
        full_name: 'Admin User',
        is_active: true,
        is_superuser: true,
        role: 'admin',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_super_admin: true
      };
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const logout = useCallback((): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('rememberMe');
    setUser(null);
    navigate('/login');
  }, [navigate]);

  const fetchUserProfile = useCallback(async (token: string): Promise<User> => {
    const response = await fetch('/api/v1/users/me', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }

    return response.json();
  }, []);

  const refreshAuth = useCallback(async (): Promise<boolean> => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      logout();
      return false;
    }

    try {
      const response = await fetch('/api/v1/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('refreshToken', data.refreshToken);
      const userProfile = await fetchUserProfile(data.token);
      setUser(userProfile);
      return true;
    } catch (error) {
      console.error('Token refresh error:', error);
      logout();
      return false;
    }
  }, [fetchUserProfile, logout]);

  const login = useCallback(async (token: string, refreshToken: string): Promise<void> => {
    try {
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      const userProfile = await fetchUserProfile(token);
      setUser(userProfile);
    } catch (error) {
      console.error('Login error:', error);
      logout();
      throw error;
    }
  }, [fetchUserProfile, logout]);

  // Initialize auth state
  useEffect(() => {
    // Skip auth initialization in development mode
    if (!import.meta.env.DEV) {
      const initializeAuth = async () => {
        try {
          const token = localStorage.getItem('token');
          const rememberMe = localStorage.getItem('rememberMe');

          if (!token) {
            setIsLoading(false);
            return;
          }

          if (rememberMe) {
            try {
              const userProfile = await fetchUserProfile(token);
              setUser(userProfile);
            } catch (error) {
              // Token might be expired, try to refresh
              await refreshAuth();
            }
          } else {
            // If no remember me, but token exists, verify it
            try {
              const userProfile = await fetchUserProfile(token);
              setUser(userProfile);
            } catch (error) {
              logout();
            }
          }
        } finally {
          setIsLoading(false);
        }
      };

      initializeAuth();
    }
  }, [fetchUserProfile, refreshAuth, logout]);

  // Set up automatic token refresh
  useEffect(() => {
    if (!user) return;

    const REFRESH_INTERVAL = 14 * 60 * 1000; // Refresh token 1 minute before expiry (assuming 15-min tokens)
    const intervalId = setInterval(() => {
      void refreshAuth();
    }, REFRESH_INTERVAL);

    return () => clearInterval(intervalId);
  }, [user, refreshAuth]);

  const hasRole = useCallback((roles: string | string[]): boolean => {
    if (!user) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(user.role) || user.is_superuser === true;
  }, [user]);

  const value = {
    user,
    token: localStorage.getItem('token'),
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    refreshAuth,
    hasRole,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Auth guard HOC
export const withAuth = <P extends object>(
  Component: React.ComponentType<P>,
  requireAdmin = false
): React.FC<P> => {
  return function WithAuthComponent(props: P): React.ReactNode {
    const { user, isAuthenticated, isLoading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
      const checkAuth = (): void => {
        if (!isLoading && !isAuthenticated) {
          navigate('/login');
        } else if (requireAdmin && user?.role !== 'admin') {
          navigate('/events');
        }
      };

      checkAuth();
    }, [isAuthenticated, isLoading, navigate, user?.role, requireAdmin]);

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
        </div>
      );
    }

    if (!isAuthenticated || (requireAdmin && user?.role !== 'admin')) {
      return null;
    }

    return <Component {...props} />;
  };
};

export default AuthContext;
