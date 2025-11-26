import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: false }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { requiresAuth: false }
    },
    // --- ВНУТРЕННИЙ КОНТУР ---
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/catalog',
      name: 'catalog',
      component: () => import('../views/CatalogView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/builder',
      name: 'builder',
      component: () => import('../views/BuilderView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
})

// --- NAVIGATION GUARD (ЗАЩИТА РОУТОВ) ---
router.beforeEach((to, from, next) => {
  // ВРЕМЕННО: Отключаем проверку токена для разработки
  // Чтобы вернуть защиту, раскомментируй код ниже и удали "next()"

  next();

  /*
  const token = localStorage.getItem('auth_token');
  const isAuthenticated = !!token;

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
  } else if (to.path === '/login' && isAuthenticated) {
    next('/dashboard');
  } else {
    next();
  }
  */
});

export default router
