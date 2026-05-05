import { defineStore } from 'pinia';
import { api } from 'boot/axios';

export const useOrganizationStore = defineStore('organization', {
  state: () => ({
    organizations: [] as any[],
    loading: false,
  }),

  actions: {
    async fetchOrganizations() {
      this.loading = true;
      try {
        const res = await api.get('/organizations');
        this.organizations = res.data;
      } catch (error) {
        console.error('Ошибка при загрузке организаций:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async create(data: { name: string; comment?: string }) {
      try {
        const res = await api.post('/organizations', data);
        this.organizations.push(res.data);
        return res.data;
      } catch (error) {
        throw error;
      }
    },

    async update(id: number, data: any) {
      try {
        const res = await api.patch(`/organizations/${id}`, data);
        const index = this.organizations.findIndex((o) => o.id === id);
        if (index !== -1) {
          this.organizations[index] = res.data;
        }
        return res.data;
      } catch (error) {
        throw error;
      }
    },

    async remove(id: number) {
      try {
        await api.delete(`/organizations/${id}`);
        this.organizations = this.organizations.filter((o) => o.id !== id);
      } catch (error) {
        throw error;
      }
    },
  },
});