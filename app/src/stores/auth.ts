import { defineStore } from 'pinia';
import { api } from 'boot/axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as any | null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.user,
    isAdmin: (state) => state.user?.role === 'admin',
    isHR: (state) => state.user?.role === 'hr',
  },
  actions: {
    async login(login: string, pass: string) {
      const response = await api.post('/auth/login', { login, password: pass });
      this.user = response.data;
    },

    async fetchProfile() {
      try {
        const response = await api.get('/auth/profile');
        this.user = response.data;
      } catch (error) {
        this.user = null;
      }
    },

    async logout() {
      try {
        await api.post('/auth/logout');
      } finally {
        this.user = null;
      }
    },
  },
});
