<template>
  <q-page padding>
    <div class="text-h5 text-weight-bold">Кадровые операции</div>

    <q-table :rows="store.operations" :columns="columns" row-key="id" :loading="store.loading">
      <template v-slot:top-right>
        <q-btn color="primary" icon="add" label="Новая операция" @click="openDialog()" />
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn flat round color="negative" icon="delete" @click="confirmDelete(props.row.id)" />
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="dialogVisible" persistent>
      <q-card style="min-width: 600px; max-width: 90vw">
        <q-card-section>
          <div class="text-h6">Кадровая операция</div>
        </q-card-section>

        <q-card-section>
          <q-form @submit.prevent="saveOperation">
            <q-select
              v-model="formData.employee_id"
              :options="employeeOptions"
              option-label="label"
              option-value="value"
              emit-value
              map-options
              label="Сотрудник"
              outlined
              class="q-mb-md"
              :rules="[(val) => !!val || 'Обязательно']"
            />

            <q-select
              v-model="formData.action_type"
              :options="actionOptions"
              option-label="label"
              option-value="value"
              emit-value
              map-options
              label="Тип операции"
              outlined
              class="q-mb-md"
              :rules="[(val) => !!val || 'Обязательно']"
            />

            <div v-if="['приём на работу', 'перевод'].includes(formData.action_type)">
              <q-select
                v-model="formData.department_id"
                :options="departmentOptions"
                option-label="label"
                option-value="value"
                emit-value
                map-options
                label="Отдел"
                outlined
                class="q-mb-md"
              />

              <q-select
                v-model="formData.position_id"
                :options="positionOptions"
                option-label="label"
                option-value="value"
                emit-value
                map-options
                label="Должность"
                outlined
                class="q-mb-md"
              />
            </div>

            <div v-if="['приём на работу', 'изменение зарплаты'].includes(formData.action_type)">
              <q-input
                v-model="formData.salary"
                type="number"
                label="Зарплата"
                outlined
                class="q-mb-md"
              />
            </div>

            <div class="flex justify-end q-gutter-sm">
              <q-btn flat label="Отмена" color="grey" v-close-popup />

              <q-btn type="submit" label="Сохранить" color="primary" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';

import { useHrOperationStore } from 'src/stores/hr-operations';
import { useEmployeeStore } from 'src/stores/employees';
import { useDepartmentStore } from 'src/stores/departments';
import { usePositionStore } from 'src/stores/positions';

const $q = useQuasar();

const store = useHrOperationStore();
const employeeStore = useEmployeeStore();
const departmentStore = useDepartmentStore();
const positionStore = usePositionStore();

const dialogVisible = ref(false);

const columns = [
  {
    name: 'employee',
    label: 'Сотрудник',
    field: (row: any) =>
      row.employee ? `${row.employee.last_name} ${row.employee.first_name}` : '—',
    align: 'left' as const,
  },
  {
    name: 'action_type',
    label: 'Тип операции',
    field: 'action_type',
    align: 'left' as const,
  },
  {
    name: 'salary',
    label: 'Зарплата',
    field: 'salary',
    align: 'left' as const,
  },
  {
    name: 'operation_date',
    label: 'Дата',
    field: 'operation_date',
    align: 'left' as const,
  },
  {
    name: 'actions',
    label: 'Действия',
    field: 'actions',
    align: 'center' as const,
  },
];

const actionOptions = [
  {
    label: 'Прием на работу',
    value: 'прием на работу',
  },
  {
    label: 'Перевод',
    value: 'перевод',
  },
  {
    label: 'Изменение зарплаты',
    value: 'изменение зарплаты',
  },
  {
    label: 'Увольнение',
    value: 'увольнение',
  },
];

const formData = ref({
  employee_id: null,
  action_type: '',
  department_id: null,
  position_id: null,
  salary: null,
});

const employeeOptions = computed(() => {
  return employeeStore.employees.map((employee: any) => ({
    label: `${employee.last_name} ${employee.first_name}`,
    value: employee.id,
  }));
});

const departmentOptions = computed(() => {
  return departmentStore.departments.map((department: any) => ({
    label: department.name,
    value: department.id,
  }));
});

const positionOptions = computed(() => {
  return positionStore.positions.map((position: any) => ({
    label: position.name,
    value: position.id,
  }));
});

const openDialog = () => {
  formData.value = {
    employee_id: null,
    action_type: '',
    department_id: null,
    position_id: null,
    salary: null,
  };

  dialogVisible.value = true;
};

const saveOperation = async () => {
  try {
    const payload: any = { ...formData.value };

    Object.keys(payload).forEach((key) => {
      if (payload[key] === null || payload[key] === '') {
        delete payload[key];
      }
    });

    await store.createOperation(payload);
    await store.fetchOperations();

    $q.notify({
      type: 'positive',
      message: 'Операция сохранена',
    });

    dialogVisible.value = false;
  } catch (error: any) {
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Ошибка сохранения',
    });
  }
};

const confirmDelete = (id: number) => {
  $q.dialog({
    title: 'Подтверждение',
    message: 'Удалить операцию?',
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    try {
      await store.deleteOperation(id);

      $q.notify({
        type: 'positive',
        message: 'Удалено',
      });
    } catch {
      $q.notify({
        type: 'negative',
        message: 'Ошибка удаления',
      });
    }
  });
};

onMounted(async () => {
  await Promise.all([
    store.fetchOperations(),
    employeeStore.fetchEmployees(),
    departmentStore.fetchDepartments(),
    positionStore.fetchPositions(),
  ]);
});
</script>
