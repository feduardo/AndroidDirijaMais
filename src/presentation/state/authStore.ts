import { create } from 'zustand';
import { User } from '../../domain/entities/User.entity';
import SecureStorage from '../../infrastructure/storage/SecureStorage';

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authMessage: string | null;

  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setRefreshToken: (refreshToken: string | null) => void;
  setLoading: (loading: boolean) => void;
  setAuthMessage: (msg: string | null) => void;

  login: (user: User, token: string, refreshToken: string) => Promise<void>;
  logout: (message?: string) => Promise<void>;
  loadStoredAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,
  authMessage: null,

  setUser: user =>
    set({
      user,
      isAuthenticated: !!user,
    }),

  setToken: token => set({ token }),

  setRefreshToken: refreshToken => set({ refreshToken }),

  setLoading: isLoading => set({ isLoading }),

  setAuthMessage: msg => set({ authMessage: msg }),

  login: async (user: User, token: string, refreshToken: string) => {
    await SecureStorage.setItem('@app:token', token);
    await SecureStorage.setItem('@app:refresh_token', refreshToken);
    await SecureStorage.setItem('@app:user', JSON.stringify(user));

    set({
      user,
      token,
      refreshToken,
      isAuthenticated: true,
      authMessage: null,
    });
  },

  logout: async (message?: string) => {
    await SecureStorage.removeItem('@app:token');
    await SecureStorage.removeItem('@app:refresh_token');
    await SecureStorage.removeItem('@app:user');

    set({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      authMessage: message ?? null,
    });
  },

  loadStoredAuth: async () => {
    set({ isLoading: true });

    try {
      const [token, refreshToken, userJson] = await Promise.all([
        SecureStorage.getItem('@app:token'),
        SecureStorage.getItem('@app:refresh_token'),
        SecureStorage.getItem('@app:user'),
      ]);

      if (token && userJson) {
        const user = JSON.parse(userJson) as User;
        set({
          user,
          token,
          refreshToken,
          isAuthenticated: true,
        });
      }
    } catch {
      await get().logout();
    } finally {
      set({ isLoading: false });
    }
  },
}));
