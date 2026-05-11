import { defineStore } from 'pinia';
import { ref } from 'vue';
import { api } from 'boot/axios';

export const useEmployeeStore = defineStore('employee', () => {
  const employees = ref([]);
  const loading = ref(false);

  const fetchEmployees = async () => {
    loading.value = true;
    try {
      const { data } = await api.get('/employees');
      employees.value = data;
    } finally {
      loading.value = false;
    }
  };

  const prepareFormData = (employeeData: any, files: File[]): FormData => {
    const fd = new FormData();
    const forbiddenFields = ['id', 'created_at', 'updated_at', 'deleted_at'];
    Object.keys(employeeData).forEach((key) => {
      if (forbiddenFields.includes(key)) return;
      const val = employeeData[key];
      if (val !== null && val !== undefined && val !== '') {
        fd.append(key, String(val));
      }
    });

    files.forEach((file) => {
      fd.append('scans', file);
    });

    return fd;
  };

  const createEmployee = async (employeeData: any, files: File[]) => {
    const fd = prepareFormData(employeeData, files);
    await api.post('/employees', fd, {
    });
    await fetchEmployees();
  };

  const updateEmployee = async (id: number, employeeData: any, files: File[]) => {
    const fd = prepareFormData(employeeData, files);
    await api.patch(`/employees/${id}`, fd, {
    });
    await fetchEmployees();
  };

  const deleteEmployee = async (id: number) => {
    await api.delete(`/employees/${id}`);
    await fetchEmployees();
  };

  return { employees, loading, fetchEmployees, createEmployee, updateEmployee, deleteEmployee };
});