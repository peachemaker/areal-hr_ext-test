<template>
  <q-page padding>
    <div class="text-h4 q-mb-xl text-primary">Добро пожаловать в Панель управления</div>
    
    <div class="row q-col-gutter-md">
      <div v-if="userRole === 1" class="col-12 col-md-4">
        <q-card class="bg-primary text-white">
          <q-card-section>
            <div class="text-h6">Пользователи</div>
            <div class="text-subtitle2">Управление доступом</div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Перейти" to="/users" />
          </q-card-actions>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card class="bg-secondary text-white">
          <q-card-section>
            <div class="text-h6">Сотрудники</div>
            <div class="text-subtitle2">База персонала</div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Перейти" to="/employees" />
          </q-card-actions>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card class="bg-accent text-white">
          <q-card-section>
            <div class="text-h6">Отделы</div>
            <div class="text-subtitle2">Структура организации</div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Перейти" to="/departments" />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { api } from 'boot/axios';

const userRole = ref<number | null>(null);

onMounted(async () => {
  try {
    const res = await api.get('/auth/profile');
    userRole.value = res.data.role_id;
  } catch (error) {
    console.error('Ошибка при получении профиля');
  }
});
</script>