import { defineStore } from 'pinia';
import { api } from 'boot/axios';

export const usePositionStore = defineStore('positions', {
  state: () => ({
    positions: [],
    loading: false,
  }),

  actions: {
    async fetchPositions() {
      this.loading = true;
      try {
        const res = await api.get('/positions');
        this.positions = res.data;
      } finally {
        this.loading = false;
      }
    },

    async createPosition(payload: any) {
      await api.post('/positions', payload);
      await this.fetchPositions();
    },

    async updatePosition(id: number, payload: any) {
      await api.patch(`/positions/${id}`, payload);
      await this.fetchPositions();
    },

    async deletePosition(id: number) {
      await api.delete(`/positions/${id}`);
      await this.fetchPositions();
    },
  },
});