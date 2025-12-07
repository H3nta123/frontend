<template>
  <v-app>
    <!-- === ШАПКА (Header) === -->
    <v-app-bar color="#2A1A8E" height="64" flat class="px-4">
      <!-- Логотип -->
      <div class="d-flex align-center mr-6">
        <v-avatar color="white" size="40">
          <v-icon icon="mdi-cart-outline" color="black" size="24"></v-icon>
        </v-avatar>
      </div>

      <v-spacer></v-spacer>

      <!-- Поиск -->
      <v-responsive max-width="600" class="mx-4 w-100">
        <v-text-field
          density="compact"
          variant="solo"
          placeholder="Поиск по заказам, товарам..."
          single-line
          hide-details
          rounded="lg"
          bg-color="white"
          class="custom-search"
          height="40"
        >
          <template v-slot:append-inner>
            <div class="d-flex align-center justify-center ml-2" style="height: 100%;">
              <v-icon icon="mdi-magnify" color="black" size="24"></v-icon>
            </div>
          </template>
        </v-text-field>
      </v-responsive>

      <v-spacer></v-spacer>

      <!-- Меню профиля -->
      <div class="d-flex align-center">
        <!-- Кнопка "Мои заказы" (Видна всегда) -->
        <v-btn
          class="text-none mr-4 px-6 font-weight-medium text-body-2"
          color="#7C84D4"
          variant="flat"
          rounded="pill"
          height="36"
        >
          мои заказы
        </v-btn>

        <v-menu v-if="authStore.isAuthenticated" min-width="200px" rounded offset-y>
          <template v-slot:activator="{ props }">
            <v-btn icon v-bind="props">
              <v-avatar color="#7C84D4" size="42" class="cursor-pointer">
                <span class="text-white text-h6 font-weight-medium">N</span>
              </v-avatar>
            </v-btn>
          </template>
          <v-card>
            <v-card-text>
              <div class="mx-auto text-center">
                <v-avatar color="#7C84D4" class="mb-3">
                  <span class="text-white text-h6">N</span>
                </v-avatar>
                <h3>Никита</h3>
                <p class="text-caption text-grey">Владелец</p>
                <v-divider class="my-3"></v-divider>
                <v-btn rounded variant="text" block color="red" @click="handleLogout">
                  Выйти
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-menu>

        <v-btn v-else icon to="/login">
          <v-avatar color="#7C84D4" size="42" class="cursor-pointer">
            <span class="text-white text-h6 font-weight-medium">N</span>
          </v-avatar>
        </v-btn>
      </div>
    </v-app-bar>

    <!-- === БОКОВОЕ МЕНЮ === -->
    <v-navigation-drawer
      v-if="authStore.isAuthenticated"
      permanent
      color="#E0E0E0"
      width="260"
      class="border-none pt-4 px-3"
    >
      <v-list class="bg-transparent" density="compact">

        <!-- ГЛАВНАЯ -->
        <v-list-item class="pa-0 mb-1" :ripple="false">
          <router-link to="/" custom v-slot="{ navigate, isActive }">
            <div @click="navigate" class="sidebar-item d-flex align-center px-4 py-2 rounded-lg cursor-pointer" :class="{ 'active': isActive && route.path === '/' }">
              <v-icon icon="mdi-home-variant-outline" size="small" class="mr-3"></v-icon>
              <span class="font-weight-bold text-body-2">Главная</span>
            </div>
          </router-link>
        </v-list-item>

        <!-- ЗАКАЗЫ -->
        <v-list-item class="pa-0 mb-1" :ripple="false">
          <router-link to="/orders" custom v-slot="{ navigate, isActive }">
            <div @click="navigate" class="sidebar-item d-flex align-center px-4 py-2 rounded-lg cursor-pointer" :class="{ 'active': isActive }">
              <v-icon icon="mdi-package-variant" size="small" class="mr-3"></v-icon>
              <span class="font-weight-bold text-body-2">Заказы</span>
              <v-chip size="x-small" color="red" class="ml-auto font-weight-bold text-white" variant="flat">4</v-chip>
            </div>
          </router-link>
        </v-list-item>

        <!-- ТОВАРЫ -->
        <v-list-item class="pa-0 mb-1" :ripple="false">
          <router-link to="/catalog" custom v-slot="{ navigate, isActive }">
            <div @click="navigate" class="sidebar-item d-flex align-center px-4 py-2 rounded-lg cursor-pointer" :class="{ 'active': isActive }">
              <v-icon icon="mdi-tag-outline" size="small" class="mr-3"></v-icon>
              <span class="font-weight-bold text-body-2">Товары</span>
            </div>
          </router-link>
        </v-list-item>

        <!-- КАТЕГОРИИ -->
        <v-list-item class="pa-0 mb-1" :ripple="false">
          <router-link to="/categories" custom v-slot="{ navigate, isActive }">
            <div @click="navigate" class="sidebar-item d-flex align-center px-4 py-2 rounded-lg cursor-pointer" :class="{ 'active': isActive }">
              <v-icon icon="mdi-folder-outline" size="small" class="mr-3"></v-icon>
              <span class="font-weight-bold text-body-2">Категории</span>
            </div>
          </router-link>
        </v-list-item>

        <!-- БРЕНДЫ -->
        <v-list-item class="pa-0 mb-1" :ripple="false">
          <router-link to="/brands" custom v-slot="{ navigate, isActive }">
            <div @click="navigate" class="sidebar-item d-flex align-center px-4 py-2 rounded-lg cursor-pointer" :class="{ 'active': isActive }">
              <v-icon icon="mdi-tag-multiple-outline" size="small" class="mr-3"></v-icon>
              <span class="font-weight-bold text-body-2">Бренды</span>
            </div>
          </router-link>
        </v-list-item>

        <!-- НОВОСТИ -->
        <v-list-item class="pa-0 mb-1" :ripple="false">
          <router-link to="/news" custom v-slot="{ navigate, isActive }">
            <div @click="navigate" class="sidebar-item d-flex align-center px-4 py-2 rounded-lg cursor-pointer" :class="{ 'active': isActive }">
              <v-icon icon="mdi-newspaper-variant-outline" size="small" class="mr-3"></v-icon>
              <span class="font-weight-bold text-body-2">Новости</span>
            </div>
          </router-link>
        </v-list-item>

        <!-- ПОЛЬЗОВАТЕЛИ -->
        <v-list-item class="pa-0 mb-1" :ripple="false">
          <router-link to="/users" custom v-slot="{ navigate, isActive }">
            <div @click="navigate" class="sidebar-item d-flex align-center px-4 py-2 rounded-lg cursor-pointer" :class="{ 'active': isActive }">
              <v-icon icon="mdi-account-group-outline" size="small" class="mr-3"></v-icon>
              <span class="font-weight-bold text-body-2">Пользователи</span>
            </div>
          </router-link>
        </v-list-item>

        <div class="my-4 px-2 text-caption font-weight-bold text-grey">КАНАЛЫ ПРОДАЖ</div>

        <!-- ШАБЛОНЫ -->
        <v-list-item class="pa-0 mb-1" :ripple="false">
          <router-link to="/themes" custom v-slot="{ navigate, isActive }">
            <div @click="navigate" class="sidebar-item d-flex align-center px-4 py-2 rounded-lg cursor-pointer" :class="{ 'active': isActive }">
              <v-icon icon="mdi-palette-outline" size="small" class="mr-3"></v-icon>
              <span class="font-weight-bold text-body-2">Шаблоны</span>
            </div>
          </router-link>
        </v-list-item>

        <!-- КОНСТРУКТОР -->
        <v-list-item class="pa-0 mb-1" :ripple="false">
          <router-link to="/builder" custom v-slot="{ navigate, isActive }">
            <div @click="navigate" class="sidebar-item d-flex align-center px-4 py-2 rounded-lg cursor-pointer" :class="{ 'active': isActive }">
              <v-icon icon="mdi-pencil-ruler" size="small" class="mr-3"></v-icon>
              <span class="font-weight-bold text-body-2">Конструктор</span>
            </div>
          </router-link>
        </v-list-item>

        <!-- МАГАЗИН (превью) -->
        <v-list-item class="pa-0 mb-1" :ripple="false">
          <a href="/shop/preview" target="_blank" class="text-decoration-none">
            <div class="sidebar-item d-flex align-center px-4 py-2 rounded-lg cursor-pointer">
              <v-icon icon="mdi-store-outline" size="small" class="mr-3"></v-icon>
              <span class="font-weight-bold text-body-2">Открыть магазин</span>
              <v-icon icon="mdi-open-in-new" size="14" class="ml-auto text-grey"></v-icon>
            </div>
          </a>
        </v-list-item>

      </v-list>

      <!-- Настройки внизу -->
      <template v-slot:append>
        <div class="pa-4">
          <div class="sidebar-item d-flex align-center px-4 py-2 rounded-lg cursor-pointer text-grey-darken-3">
            <v-icon icon="mdi-cog-outline" size="small" class="mr-3"></v-icon>
            <span class="font-weight-bold text-body-2">Настройки</span>
          </div>
        </div>
      </template>
    </v-navigation-drawer>

    <!-- === ОСНОВНОЙ КОНТЕНТ === -->
    <v-main class="bg-white">
      <div class="pa-8 h-100">
        <slot></slot>
      </div>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>

<style scoped lang="scss">
.custom-search :deep(.v-field) {
  box-shadow: none !important;
  padding-right: 0 !important;
}
.custom-search :deep(.v-field__append-inner) {
  padding-top: 0;
  align-items: center;
}
.hover-opacity {
  transition: opacity 0.2s;
  &:hover { opacity: 0.8; }
}
.sidebar-item {
  transition: all 0.1s ease;
  color: #333;

  &.active {
    background-color: #e8eaf6; /* Светло-фиолетовый фон для активного */
    color: #2A1A8E !important; /* Твой фирменный цвет */

    .v-icon {
      color: #2A1A8E !important;
    }
  }

  &:hover:not(.active) {
    background-color: rgba(0,0,0,0.04);
  }
}
.cursor-pointer { cursor: pointer; }
</style>
