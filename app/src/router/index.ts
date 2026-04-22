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

  Router.beforeEach(async (to) => {
    if (!store) return true;
    const authStore = useAuthStore(store);
    if (to.path === '/login') return true;
    if (!authStore.user) {
      try {
        await authStore.fetchProfile();
      } catch {}
    }

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
      return { path: '/login' };
    }

    return true;
  });

  return Router;
});
