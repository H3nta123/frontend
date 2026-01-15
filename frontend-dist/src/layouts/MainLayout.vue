<template>
  <v-app>
    <!-- === ШАПКА (Header) === -->
    <v-app-bar color="white" height="64" flat class="px-4 border-b">
      <!-- Логотип -->
      <div class="d-flex align-center mr-8">
        <div class="d-flex align-center justify-center rounded-lg bg-indigo-lighten-5 pa-2">
          <v-icon icon="mdi-store" color="#2A1A8E" size="24"></v-icon>
        </div>
        <span class="ml-3 text-h6 font-weight-bold text-grey-darken-4">Quickstart</span>
      </div>

      <!-- Поиск (Removed) -->
      <v-spacer></v-spacer>



      <!-- Меню профиля и Баланс -->
      <div class="d-flex align-center gap-2">
        
        <!-- Баланс -->
        <div 
            class="d-flex align-center mr-4 px-3 py-1 bg-grey-lighten-4 rounded-pill border cursor-pointer hover-opacity" 
            v-if="authStore.isAuthenticated"
            @click="router.push('/finance')"
        >
            <v-icon icon="mdi-wallet-outline" color="#2A1A8E" size="small" class="mr-2"></v-icon>
            <div class="d-flex flex-column" style="line-height: 1.1;">
                <span class="text-caption font-weight-bold text-grey-darken-1">Баланс</span>
                <span class="text-subtitle-2 font-weight-bold text-grey-darken-3">{{ authStore.user?.balance || 0 }} ₽</span>
            </div>
        </div>

        <v-btn icon color="grey-darken-1" variant="text">
          <v-icon>mdi-bell-outline</v-icon>
        </v-btn>
        
        <v-divider vertical class="mx-2 h-50"></v-divider>

        <v-menu v-if="authStore.isAuthenticated">
          <template v-slot:activator="{ props }">
            <v-btn variant="text" class="text-none pl-2 pr-4" rounded="pill" v-bind="props">
               <v-avatar color="#E8EAF6" size="32" class="mr-2">
                 <span class="text-indigo-darken-3 text-subtitle-2 font-weight-bold">{{ (authStore.user?.name || authStore.user?.email || 'U').charAt(0).toUpperCase() }}</span>
               </v-avatar>
               <div class="d-flex flex-column align-start">
                 <span class="text-body-2 font-weight-bold text-grey-darken-3 line-height-1">{{ authStore.user?.name || 'User' }}</span>
                 <span class="text-caption text-grey">Владелец</span>
               </div>
               <v-icon icon="mdi-chevron-down" size="small" class="ml-2 text-grey"></v-icon>
            </v-btn>
          </template>
          <v-list width="200" class="rounded-lg elevation-4">
            <v-list-item @click="handleLogout" class="text-red">
              <template v-slot:prepend>
                <v-icon icon="mdi-logout" size="small"></v-icon>
              </template>
              <v-list-item-title>Выйти</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </v-app-bar>

    <!-- === БОКОВОЕ МЕНЮ === -->

    <v-navigation-drawer
      v-if="authStore.isAuthenticated"
      permanent
      color="#F8F9FA"
      width="280"
      class="border-r px-4 d-flex flex-column justify-center"
    >
      <v-list class="bg-transparent w-100" density="comfortable" nav>

        <!-- ГЛАВНАЯ -->
        <v-list-item class="pa-0 mb-4" :ripple="false">
          <router-link to="/" custom v-slot="{ navigate, isActive }">
            <div @click="navigate" class="sidebar-item d-flex align-center px-8 py-5 rounded-xl cursor-pointer" :class="{ 'active': isActive && route.path === '/' }">
              <v-icon icon="mdi-home-variant-outline" size="28" class="mr-4"></v-icon>
              <span class="font-weight-bold text-h6">Главная</span>
            </div>
          </router-link>
        </v-list-item>

        <!-- ЗАКАЗЫ -->
        <v-list-item class="pa-0 mb-4" :ripple="false">
          <router-link to="/orders" custom v-slot="{ navigate, isActive }">
            <div @click="navigate" class="sidebar-item d-flex align-center px-8 py-5 rounded-xl cursor-pointer" :class="{ 'active': isActive }">
              <v-icon icon="mdi-package-variant" size="28" class="mr-4"></v-icon>
              <span class="font-weight-bold text-h6">Заказы</span>
            </div>
          </router-link>
        </v-list-item>




        <!-- МАГАЗИНЫ -->
        <v-list-item class="pa-0 mb-4" :ripple="false">
          <router-link to="/stores" custom v-slot="{ navigate, isActive }">
            <div @click="navigate" class="sidebar-item d-flex align-center px-8 py-5 rounded-xl cursor-pointer" :class="{ 'active': isActive }">
              <v-icon icon="mdi-store-cog-outline" size="28" class="mr-4"></v-icon>
              <span class="font-weight-bold text-h6">Магазины</span>
            </div>
          </router-link>
        </v-list-item>

        <!-- ФИНАНСЫ -->
        <v-list-item class="pa-0 mb-4" :ripple="false">
          <router-link to="/finance" custom v-slot="{ navigate, isActive }">
            <div @click="navigate" class="sidebar-item d-flex align-center px-8 py-5 rounded-xl cursor-pointer" :class="{ 'active': isActive }">
              <v-icon icon="mdi-wallet-outline" size="28" class="mr-4"></v-icon>
              <span class="font-weight-bold text-h6">Финансы</span>
            </div>
          </router-link>
        </v-list-item>







      </v-list>

        <!-- Settings Removed -->
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
import { useShopStore } from '@/stores/shop';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const shopStore = useShopStore();

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
  transition: all 0.2s ease;
  color: #555;
  border-radius: 12px;
  margin-bottom: 4px;

  &.active {
    background-color: #EDE7F6; /* Very light purple */
    color: #4527A0 !important; /* Deep Purple */
    font-weight: 700 !important;

    .v-icon {
      color: #4527A0 !important;
    }
  }

  &:hover:not(.active) {
    background-color: rgba(0,0,0,0.03);
    color: #000;
  }
}
.cursor-pointer { cursor: pointer; }
</style>
