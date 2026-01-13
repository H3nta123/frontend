import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth' // Импортируем стор

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { requiresAuth: false }
    },
    // --- ADMIN PANEL ROUTES ---
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/DashboardView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/orders',
      name: 'orders',
      component: () => import('@/views/OrdersView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/catalog',
      name: 'catalog',
      component: () => import('@/views/CatalogView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/stores',
      name: 'stores',
      component: () => import('@/views/StoresView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/builder',
      name: 'builder',
      component: () => import('@/views/BuilderView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/themes',
      name: 'themes',
      component: () => import('@/views/ThemesView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/products/new',
      name: 'product-new',
      component: () => import('@/views/ProductFormView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/products/:id',
      name: 'product-edit',
      component: () => import('@/views/ProductFormView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/brands',
      name: 'brands',
      component: () => import('@/views/BrandsView.vue'),
      meta: { requiresAuth: true }
    },


    // --- STOREFRONT ROUTES ---
    {
      path: '/shop/preview',
      name: 'shop-home',
      component: () => import('@/views/shop/ShopHome.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/shop/catalog',
      name: 'shop-catalog',
      component: () => import('@/views/shop/CatalogView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/shop/product/:id',
      name: 'shop-product',
      component: () => import('@/views/shop/ProductView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/shop/checkout',
      name: 'shop-checkout',
      component: () => import('@/views/shop/CheckoutView.vue'),
      meta: { requiresAuth: false }
    },

    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
})

// === УМНАЯ ЗАЩИТА МАРШРУТОВ ===
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isAuthenticated = authStore.isAuthenticated;

  // 1. Если маршрут требует входа, а юзер НЕ вошел -> на Логин
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
    return;
  }

  // 2. Если юзер УЖЕ вошел и пытается открыть "Главную" или "Логин" -> в Дашборд
  if ((to.path === '/' || to.path === '/login') && isAuthenticated) {
    next('/dashboard');
    return;
  }

  // 3. Иначе пускаем куда шел
  next();
});

export default router
