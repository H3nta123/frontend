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
    // --- INTERNAL ROUTES ---
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

// --- NAVIGATION GUARD ---
router.beforeEach((to, from, next) => {
  // === TODO: UNCOMMENT WHEN BACKEND IS READY ===

  /*
  const isAuthenticated = localStorage.getItem('is_authenticated') === 'true';

  // 1. If route requires auth and user is not logged in -> redirect to login
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
    return;
  }

  // 2. If user is logged in and tries to access login -> redirect to dashboard
  if (to.path === '/login' && isAuthenticated) {
    next('/dashboard');
    return;
  }
  */

  // Temporarily allow everything
  next();
});

export default router
