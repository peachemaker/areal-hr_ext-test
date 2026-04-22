<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />
        <q-toolbar-title>HR Management System</q-toolbar-title>
        
        <q-btn flat icon="logout" label="Выйти" @click="logout" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header>Меню</q-item-label>
        
        <q-item clickable v-ripple to="/">
          <q-item-section avatar><q-icon name="dashboard" /></q-item-section>
          <q-item-section>Главная</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/organizations">
          <q-item-section avatar><q-icon name="apartment" /></q-item-section>
          <q-item-section>Организации</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/employees">
          <q-item-section avatar><q-icon name="people" /></q-item-section>
          <q-item-section>Сотрудники</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'stores/auth'

const leftDrawerOpen = ref(false)
const router = useRouter()

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const logout = () => {
  const authStore = useAuthStore()
  authStore.logout()
  router.push('/login')
}
</script>