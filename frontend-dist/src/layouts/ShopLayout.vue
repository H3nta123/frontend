<template>
  <v-app :style="{ backgroundColor: shopStore.settings.backgroundColor }">
    <!-- Шапка магазина -->
    <v-app-bar :color="shopStore.settings.backgroundColor" flat class="border-b" height="80">
      <v-container class="d-flex align-center mw-1200 pa-0">
        <!-- Логотип / Название -->
        <router-link to="/shop/preview" class="text-decoration-none text-black">
          <h2 class="font-weight-bold text-h5" :style="{ color: shopStore.settings.primaryColor }">
            {{ shopStore.settings.name }}
          </h2>
        </router-link>

        <v-spacer></v-spacer>

        <!-- Меню -->
        <div class="hidden-sm-and-down mr-8">
          <v-btn variant="text" to="/shop/preview">Главная</v-btn>
          <v-btn variant="text">Каталог</v-btn>
          <v-btn variant="text">О нас</v-btn>
        </div>

        <!-- Корзина -->
        <v-btn icon variant="text">
          <v-badge content="0" color="black" floating>
            <v-icon>mdi-shopping-outline</v-icon>
          </v-badge>
        </v-btn>
      </v-container>
    </v-app-bar>

    <!-- Контент магазина -->
    <v-main>
      <slot></slot>
    </v-main>

    <!-- Футер -->
    <v-footer class="bg-grey-lighten-4 py-10 mt-16">
      <v-container class="text-center mw-1200">
        <div class="text-h6 font-weight-bold mb-4">{{ shopStore.settings.name }}</div>
        <div class="text-body-2 text-grey">© 2023 Все права защищены. Создано на платформе.</div>
      </v-container>
    </v-footer>
  </v-app>
</template>

<script setup lang="ts">
import { useShopStore } from '@/stores/shop';

const shopStore = useShopStore();
</script>

<style scoped>
.mw-1200 {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
