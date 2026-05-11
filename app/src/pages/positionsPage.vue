<template>
  <q-page padding>
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h5 text-weight-bold">Должности</div>
    </div>

    <q-table
      :rows="store.positions"
      :columns="columns"
      row-key="id"
      :loading="store.loading"
      flat
      bordered
    >
      <template v-slot:top-right>
        <q-btn color="primary" icon="add" label="Добавить должность" @click="openDialog()" />
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
          <div class="text-h6">
            {{ isEdit ? 'Редактирование должности' : 'Новая должность' }}
          </div>
        </q-card-section>

        <q-card-section>
          <q-form @submit.prevent="saveData">
            <q-input
              v-model="formData.name"
              label="Название должности *"
              outlined
              :rules="[(val) => !!val || 'Обязательно']"
              class="q-mb-md"
            />

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
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { usePositionStore } from 'src/stores/positions';

const $q = useQuasar();
const store = usePositionStore();

const dialogVisible = ref(false);
const isEdit = ref(false);
const currentId = ref<number | null>(null);

const columns = [
  {
    name: 'name',
    label: 'Название',
    field: 'name',
    align: 'left' as const,
  },
  {
    name: 'actions',
    label: 'Действия',
    field: 'actions',
    align: 'center' as const,
  },
];

const formData = ref({
  name: '',
});

const openDialog = (row: any = null) => {
  isEdit.value = !!row;
  currentId.value = row ? row.id : null;

  formData.value = row ? { name: row.name || '' } : { name: '' };

  dialogVisible.value = true;
};

const saveData = async () => {
  try {
    if (isEdit.value && currentId.value) {
      await store.updatePosition(currentId.value, formData.value);
    } else {
      await store.createPosition(formData.value);
    }

    $q.notify({
      type: 'positive',
      message: 'Сохранено',
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
    message: 'Удалить должность?',
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    try {
      await store.deletePosition(id);

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

onMounted(() => {
  store.fetchPositions();
});
</script>
