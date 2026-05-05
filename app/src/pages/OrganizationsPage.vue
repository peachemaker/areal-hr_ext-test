<template>
  <q-page padding>
    <div class="text-h5 q-mb-md">Организации</div>

    <q-table 
      :rows="orgStore.organizations" 
      :columns="columns" 
      row-key="id" 
      :loading="orgStore.loading"
    >
      <template v-slot:top-right>
        <q-btn color="primary" label="Добавить организацию" @click="openDialog()" />
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td :props="props" class="text-right">
          <q-btn flat round color="primary" icon="edit" @click="openDialog(props.row)" />
          <q-btn flat round color="negative" icon="delete" @click="confirmDelete(props.row.id)" />
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="dialogVisible" persistent>
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">{{ isEdit ? 'Редактировать' : 'Новая организация' }}</div>
        </q-card-section>

        <q-card-section>
          <q-form @submit.prevent="saveData">
            <q-input
              v-model="formData.name"
              label="Наименование"
              outlined
              class="q-mb-sm"
              :rules="[(val) => !!val || 'Обязательно']"
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
import { ref, onMounted } from 'vue';
import { useOrganizationStore } from 'src/stores/organization';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const orgStore = useOrganizationStore();

const dialogVisible = ref(false);
const isEdit = ref(false);
const currentId = ref<number | null>(null);
const formData = ref({ name: '', comment: '' });

const columns = [
  { name: 'id', label: 'ID', field: 'id', align: 'left' as const, sortable: true },
  { name: 'name', label: 'Наименование', field: 'name', align: 'left' as const, sortable: true },
  { name: 'comment', label: 'Комментарий', field: 'comment', align: 'left' as const },
  { name: 'actions', label: 'Действия', field: 'actions', align: 'right' as const },
];

const openDialog = (row: any = null) => {
  isEdit.value = !!row;
  currentId.value = row ? row.id : null;
  formData.value = row ? { name: row.name, comment: row.comment } : { name: '', comment: '' };
  dialogVisible.value = true;
};

const saveData = async () => {
  try {
    if (isEdit.value && currentId.value) {
      await orgStore.update(currentId.value, formData.value);
    } else {
      await orgStore.create(formData.value);
    }
    $q.notify({ type: 'positive', message: 'Сохранено успешно' });
    dialogVisible.value = false;
  } catch (error: any) {
    $q.notify({ 
      type: 'negative', 
      message: error.response?.data?.message || 'Ошибка сохранения' 
    });
  }
};

const confirmDelete = (id: number) => {
  $q.dialog({
    title: 'Подтверждение',
    message: 'Удалить организацию?',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await orgStore.remove(id);
      $q.notify({ type: 'positive', message: 'Удалено' });
    } catch (error) {
      $q.notify({ type: 'negative', message: 'Ошибка удаления' });
    }
  });
};

onMounted(() => {
  orgStore.fetchOrganizations();
});
</script>