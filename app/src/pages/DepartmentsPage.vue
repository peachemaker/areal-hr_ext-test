<template>
  <q-page padding>
    <div class="text-h5 text-weight-bold">Отделы</div>

    <q-table
      :rows="deptStore.departments"
      :columns="columns"
      row-key="id"
      :loading="deptStore.loading"
    >
      <template v-slot:top-right>
        <q-btn color="primary" icon="add" label="Добавить отдел" @click="openDialog()" />
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td :props="props" class="text-right">
          <q-btn flat round color="primary" icon="edit" @click="openDialog(props.row)" />
          <q-btn flat round color="negative" icon="delete" @click="confirmDelete(props.row.id)" />
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="dialogVisible" persistent>
      <q-card style="min-width: 500px">
        <q-card-section
          ><div class="text-h6">{{ isEdit ? 'Редактировать' : 'Новый отдел' }}</div></q-card-section
        >

        <q-card-section>
          <q-form @submit.prevent="saveData">
            <q-input
              v-model="formData.name"
              label="Наименование"
              outlined
              class="q-mb-sm"
              :rules="[(val) => !!val || 'Обязательно']"
            />

            <q-select
              v-model="formData.organization_id"
              :options="orgStore.organizations"
              emit-value
              map-options
              option-value="id"
              option-label="name"
              label="Организация"
              outlined
              class="q-mb-sm"
              :rules="[(val) => !!val || 'Выберите организацию']"
            />

            <q-select
              v-model="formData.parent_department_id"
              :options="availableParents"
              emit-value
              map-options
              option-value="id"
              option-label="name"
              label="Родительский отдел (необязательно)"
              outlined
              class="q-mb-sm"
              clearable
            />

            <q-input
              v-model="formData.comment"
              label="Комментарий"
              outlined
              type="textarea"
              class="q-mb-sm"
              autogrow
            />

            <div class="flex justify-end q-mt-md">
              <q-btn flat label="Отмена" color="grey" v-close-popup />
              <q-btn type="submit" label="Сохранить" color="primary" class="q-ml-sm" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useDepartmentStore } from 'src/stores/departments';
import { useOrganizationStore } from 'src/stores/organization';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const rows = ref<any[]>([]);
const deptStore = useDepartmentStore();
const orgStore = useOrganizationStore();
const dialogVisible = ref(false);
const isEdit = ref(false);
const currentId = ref<number | null>(null);

const formData = ref({ name: '', organization_id: null, parent_department_id: null, comment: '' });

const columns = [
  { name: 'id', label: 'ID', field: 'id', align: 'left' as const },
  { name: 'name', label: 'Наименование', field: 'name', align: 'left' as const },
  {
    name: 'organization_name',
    label: 'Организация',
    field: 'organization_name',
    align: 'left' as const,
  },
  {
    name: 'parent_name',
    label: 'Родительский отдел',
    field: 'parent_name',
    align: 'left' as const,
  },
  { name: 'actions', label: 'Действия', field: 'actions', align: 'right' as const },
];

const availableParents = computed(() => {
  if (!currentId.value) return deptStore.departments;
  return deptStore.departments.filter((d) => d.id !== currentId.value);
});

const openDialog = (row: any = null) => {
  isEdit.value = !!row;
  currentId.value = row ? row.id : null;
  formData.value = row
    ? {
        name: row.name,
        organization_id: row.organization_id,
        parent_department_id: row.parent_department_id,
        comment: row.comment,
      }
    : { name: '', organization_id: null, parent_department_id: null, comment: '' };

  dialogVisible.value = true;
};

const saveData = async () => {
  try {
    if (isEdit.value && currentId.value) {
      await deptStore.updateDepartment(currentId.value, formData.value);
    } else {
      await deptStore.createDepartment(formData.value);
    }
    $q.notify({ type: 'positive', message: 'Сохранено' });
    dialogVisible.value = false;
  } catch (error: any) {
    $q.notify({ type: 'negative', message: error.response?.data?.message || 'Ошибка сохранения' });
  }
};

const confirmDelete = (id: number) => {
  $q.dialog({ title: 'Подтверждение', message: 'Удалить отдел?', cancel: true }).onOk(async () => {
    try {
      await deptStore.deleteDepartment(id);
      $q.notify({ type: 'positive', message: 'Удалено' });
    } catch (error) {
      $q.notify({ type: 'negative', message: 'Ошибка удаления' });
    }
  });
};

onMounted(async () => {
  await deptStore.fetchDepartments();
  if (orgStore.organizations.length === 0) {
    await orgStore.fetchOrganizations();
  }
});
</script>
