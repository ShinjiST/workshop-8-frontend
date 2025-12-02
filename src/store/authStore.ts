import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/features/auth/types';

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  setToken: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      login: (token, user) => { set({ token, user, isAuthenticated: true }); },
      
      setToken: (token) => { set({ token, isAuthenticated: true }); },

      logout: () => { set({ token: null, user: null, isAuthenticated: false }); },
    }),
    {
      name: 'auth-storage',
    }
  )
);