<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex flex-center">
        <q-card style="width: 400px; max-width: 90vw">
          <q-card-section>
            <div class="text-h6 text-center">Вход в систему</div>
          </q-card-section>

          <q-card-section>
            <q-form @submit.prevent="onSubmit">
              <q-input
                v-model="form.login"
                label="Логин"
                outlined
                class="q-mb-md"
                :rules="[(val) => !!val || 'Обязательное поле']"
              />
              <q-input
                v-model="form.password"
                type="password"
                label="Пароль"
                outlined
                class="q-mb-md"
                :rules="[(val) => !!val || 'Обязательное поле']"
              />
              <q-btn
                type="submit"
                color="primary"
                label="Войти"
                class="full-width"
                :loading="loading"
              />
            </q-form>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from 'stores/auth';
import { useQuasar } from 'quasar';

const router = useRouter();
const authStore = useAuthStore();
const $q = useQuasar();

const form = ref({
  login: '',
  password: '',
});
const loading = ref(false);

const onSubmit = async () => {
  loading.value = true;
  try {
    await authStore.login(form.value.login, form.value.password);
    if (authStore.isAdmin) {
      router.push('/users');
    } else {
      router.push('/');
    }
    $q.notify({ type: 'positive', message: 'Успешный вход' });
  } catch (error) {
    $q.notify({ type: 'negative', message: 'Неверный логин или пароль' });
  } finally {
    loading.value = false;
  }
};
</script>
