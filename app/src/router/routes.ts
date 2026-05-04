import OrganizationsPage from 'src/pages/OrganizationsPage.vue';
import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { 
        path: '', 
        component: () => import('pages/IndexPage.vue'), 
        meta: { requiresAuth: true } },
      {
        path: 'employees',
        component: () => import('pages/EmployeesPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'users',
        component: () => import('pages/UsersPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'organizations',
        component: () => import('pages/OrganizationsPage.vue'),
        meta: { requiredAuth: true }
      },
      {
        path: 'departments',
        component: () => import('pages/DepartmentsPage.vue'),
        meta: { requiredAuth: true }
      }
    ],
  },
  {
    path: '/login',
    component: () => import('pages/LoginPage.vue'),
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
