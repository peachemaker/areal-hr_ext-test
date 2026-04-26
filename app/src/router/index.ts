import { route } from 'quasar/wrappers';
import { createRouter, createWebHistory } from 'vue-router';
import routes from './routes';
import { useAuthStore } from 'stores/auth';

export default route(function ({ store }) {
  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createWebHistory(process.env.VUE_ROUTER_BASE),
  });

  Router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore();

    if (!authStore.user) {
      await authStore.fetchProfile();
    }
    const isAuthenticated = !!authStore.user;
    if (to.meta.requiresAuth && !isAuthenticated) {
      return next('/login');
    }
    if (to.path === '/login' && isAuthenticated) {
      return next('/');
    }
    if (to.path === '/users' && authStore.user?.role_id !== 1) {
      return next('/'); 
    }

    next();
  });

  return Router;
});
