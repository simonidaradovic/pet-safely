import { create } from 'zustand';
import { apiFetch } from '../lib/api';

export const useAuthStore = create((set, get) => ({
  user: null,
  loading: false,
  error: null,

  isAuthed: () => !!get().user,

  clearError: () => set({ error: null }),

  me: async () => {
    set({ loading: true, error: null });
    try {
      const data = await apiFetch('/api/auth/me', { method: 'GET' });
      set({ user: data.user, loading: false });
      return data.user;
    } catch (e) {
      set({ user: null, loading: false, error: e.message });
      return null;
    }
  },

  register: async ({ email, password, name }) => {
    set({ loading: true, error: null });
    try {
      const data = await apiFetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password, name }),
      });
      set({ user: data.user, loading: false });
      return data.user;
    } catch (e) {
      set({ loading: false, error: e.message });
      throw e;
    }
  },

  login: async ({ email, password }) => {
    set({ loading: true, error: null });
    try {
      const data = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      set({ user: data.user, loading: false });
      return data.user;
    } catch (e) {
      set({ loading: false, error: e.message });
      throw e;
    }
  },

  logout: async () => {
    set({ loading: true, error: null });
    try {
      await apiFetch('/api/auth/logout', { method: 'POST' });
      set({ user: null, loading: false });
    } catch (e) {
      set({ loading: false, error: e.message });
      throw e;
    }
  },
}));
