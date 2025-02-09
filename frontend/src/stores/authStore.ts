import { create } from "zustand";
import { AuthState, User } from "../types/auth";

interface AuthStore extends AuthState {
  login: (user: User) => void;
  logout: () => void;
  setLoading: (isLoading: boolean) => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  login: (user) =>
    set({
      user,
      isAuthenticated: true,
      isLoading: false,
    }),

  logout: () =>
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    }),

  setLoading: (isLoading) =>
    set({
      isLoading,
    }),

  updateUser: (updatedUser) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...updatedUser } : null,
    })),
}));

// Initialize auth state from localStorage or session
const initializeAuth = async () => {
  const store = useAuthStore.getState();
  
  try {
    store.setLoading(true);
    // TODO: Add API call to verify token and get user data
    const token = localStorage.getItem("token");
    
    if (!token) {
      store.logout();
      return;
    }

    // Placeholder for API call
    // const user = await api.auth.me();
    // store.login(user);
  } catch (error) {
    store.logout();
  } finally {
    store.setLoading(false);
  }
};

// Initialize auth state when the store is imported
initializeAuth();
