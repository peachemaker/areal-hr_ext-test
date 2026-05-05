import { defineStore } from 'pinia';
import { api } from 'boot/axios';

export const useDepartmentStore = defineStore('department', {
  state: () => ({
    departments: [] as any[],
    loading: false,
  }),

  actions: {
    async fetchDepartments() {
      this.loading = true;
      try {
        const res = await api.get(`/departments`);
        this.departments = res.data;
      } catch (error) {
        console.error('Ошибка загрузки отделов:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async createDepartment(data: any) {
      try {
        const res = await api.post(`/departments`, data);
        this.departments.push(res.data);
        return res.data;
      } catch (error) {
        throw error;
      }
    },

    async updateDepartment(id: number, data: any) {
      try {
        const res = await api.patch(`/departments/${id}`, data);
        const index = this.departments.findIndex((d) => d.id === id);
        if (index !== -1) {
          this.departments[index] = res.data;
        }
        return res.data;
      } catch (error) {
        throw error;
      }
    },

    async deleteDepartment(id: number) {
      try {
        await api.delete(`/departments/${id}`);
        this.departments = this.departments.filter((d) => d.id !== id);
      } catch (error) {
        throw error;
      }
    },
  },
});