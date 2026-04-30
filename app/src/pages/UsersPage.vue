<template>
  <q-page padding>
    <div class="text-h5 q-mb-md">Управление пользователями</div>

    <q-table :rows="users" :columns="columns" row-key="id" :loading="loading">
      <template v-slot:top-right>
        <q-btn color="primary" label="Добавить пользователя" @click="openDialog()" />
      </template>

      <template v-slot:body-cell-role="props">
        <q-td :props="props">
          <q-chip
            :color="props.row.role === 'admin' ? 'negative' : 'primary'"
            text-color="white"
            size="sm"
          >
            {{ props.value }}
          </q-chip>
        </q-td>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td :props="props" class="text-right">
          <q-btn flat round color="primary" icon="edit" @click="openDialog(props.row)" />
          <q-btn
            flat
            round
            icon="delete"
            :color="currentUser && props.row.id === currentUser.id ? 'grey' : 'negative'"
            :disable="currentUser && props.row.id === currentUser.id"
            @click="confirmDelete(props.row.id)"
          >
            <q-tooltip v-if="currentUser && props.row.id === currentUser.id">
              Вы не можете удалить свою учетную запись
            </q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="dialogVisible" persistent>
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">{{ isEdit ? 'Редактировать' : 'Новый пользователь' }}</div>
        </q-card-section>

        <q-card-section>
          <q-form @submit.prevent="saveUser">
            <q-input
              v-model="formData.last_name"
              label="Фамилия"
              outlined
              class="q-mb-sm"
              :rules="[(val) => !!val || 'Обязательно']"
            />
            <q-input
              v-model="formData.first_name"
              label="Имя"
              outlined
              class="q-mb-sm"
              :rules="[(val) => !!val || 'Обязательно']"
            />
            <q-input
              v-model="formData.patronymic"
              label="Отчество (необязательно)"
              outlined
              class="q-mb-sm"
            />

            <q-input
              v-model="formData.login"
              label="Логин"
              outlined
              class="q-mb-sm"
              :rules="[(val) => !!val || 'Обязательно']"
            />

            <q-input
              v-model="formData.password"
              label="Пароль"
              type="password"
              outlined
              class="q-mb-sm"
              :hint="isEdit ? 'Оставьте пустым, чтобы не менять' : ''"
              :rules="isEdit ? [] : [(val) => !!val || 'Обязательно']"
            />

            <q-select
              v-model="formData.role_id"
              :options="roleOptions"
              emit-value
              map-options
              label="Роль"
              outlined
              class="q-mb-sm"
              :rules="[(val) => !!val || 'Выберите роль']"
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
import { api } from 'boot/axios';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const users = ref<any[]>([]);
const loading = ref(false);
const dialogVisible = ref(false);
const isEdit = ref(false);
const currentId = ref<number | null>(null);

const roleOptions = [
  { label: 'Администратор', value: 1 },
  { label: 'Менеджер по персоналу', value: 2 },
];

const formData = ref({
  first_name: '',
  last_name: '',
  patronymic: '',
  login: '',
  password: '',
  role_id: 2,
});

const columns = [
  { name: 'id', label: 'ID', field: 'id', align: 'left' as const, sortable: true },
  {
    name: 'last_name',
    label: 'Фамилия',
    field: 'last_name',
    align: 'left' as const,
    sortable: true,
  },
  { name: 'first_name', label: 'Имя', field: 'first_name', align: 'left' as const },
  { name: 'login', label: 'Логин', field: 'login', align: 'left' as const },
  { name: 'role', label: 'Роль', field: 'role', align: 'center' as const },
  { name: 'actions', label: 'Действия', field: 'actions', align: 'right' as const },
];

const fetchUsers = async () => {
  loading.value = true;
  try {
    const res = await api.get('/users');
    users.value = res.data;
  } catch (error) {
    $q.notify({ type: 'negative', message: 'Ошибка при загрузке пользователей' });
  } finally {
    loading.value = false;
  }
};

const openDialog = (user: any = null) => {
  if (user) {
    isEdit.value = true;
    currentId.value = user.id;
    formData.value = {
      first_name: user.first_name,
      last_name: user.last_name,
      patronymic: user.patronymic || '',
      login: user.login,
      password: '',
      role_id: user.role_id,
    };
  } else {
    isEdit.value = false;
    currentId.value = null;
    formData.value = {
      first_name: '',
      last_name: '',
      patronymic: '',
      login: '',
      password: '',
      role_id: 2,
    };
  }
  dialogVisible.value = true;
};

const saveUser = async () => {
  try {
    const payload: any = {
      last_name: formData.value.last_name,
      first_name: formData.value.first_name,
      patronymic: formData.value.patronymic,
      login: formData.value.login,
      role_id: formData.value.role_id,
    };
    if (formData.value.password) {
      payload.password = formData.value.password;
    }

    if (isEdit.value) {
      await api.put(`/users/${currentId.value}`, payload);
      $q.notify({ type: 'positive', message: 'Пользователь обновлен' });
    } else {
      await api.post('/users', payload);
      $q.notify({ type: 'positive', message: 'Пользователь создан' });
    }

    dialogVisible.value = false;
    fetchUsers();
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
    message: 'Вы уверены, что хотите удалить этого пользователя?',
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    try {
      await api.delete(`/users/${id}`);
      $q.notify({ type: 'positive', message: 'Пользователь удален' });
      fetchUsers();
    } catch (error) {
      $q.notify({ type: 'negative', message: 'Ошибка удаления' });
    }
  });
};

const currentUser = ref<any>(null);

const fetchProfile = async () => {
  try {
    const res = await api.get('/auth/profile');
    currentUser.value = res.data;
  } catch (e) {
    console.error('Не удалось загрузить профиль');
  }
};

onMounted(() => {
  fetchUsers();
  fetchProfile();
});
</script>
