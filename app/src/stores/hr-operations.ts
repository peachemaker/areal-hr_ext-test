import { defineStore } from 'pinia';
import { api } from 'boot/axios';

export const useHrOperationStore = defineStore('hrOperations', {
  state: () => ({
    operations: [],
    loading: false,
  }),

  actions: {
    async fetchOperations() {
      this.loading = true;

      try {
        const response = await api.get('/hr-operations');
        this.operations = response.data;
      } finally {
        this.loading = false;
      }
    },

    async createOperation(payload: any) {
      const response = await api.post('/hr-operations', payload);

      await this.fetchOperations();

      return response.data;
    },

    async deleteOperation(id: number) {
      await api.delete(`/hr-operations/${id}`);

      await this.fetchOperations();
    },
  },
});