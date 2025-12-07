<template>
  <v-app :style="appStyles">
    <!-- Шапка магазина -->
    <v-app-bar :color="shopStore.settings.backgroundColor" flat class="border-b" height="80">
      <v-container class="d-flex align-center mw-1200 pa-0">
        <!-- Логотип / Название -->
        <router-link to="/shop/preview" class="text-decoration-none">
          <v-img 
            v-if="shopStore.settings.logoUrl" 
            :src="shopStore.settings.logoUrl" 
            height="48" 
            max-width="160"
            contain
          ></v-img>
          <h2 
            v-else 
            class="font-weight-bold text-h5" 
            :style="{ color: shopStore.settings.primaryColor }"
          >
            {{ shopStore.settings.name }}
          </h2>
        </router-link>

        <v-spacer></v-spacer>

        <!-- Меню -->
        <div class="hidden-sm-and-down mr-8">
          <v-btn 
            variant="text" 
            to="/shop/preview" 
            class="text-none"
            :style="{ color: shopStore.settings.textColor }"
          >
            Главная
          </v-btn>
          <v-btn 
            variant="text" 
            to="/shop/catalog" 
            class="text-none"
            :style="{ color: shopStore.settings.textColor }"
          >
            Каталог
          </v-btn>
        </div>

        <!-- Корзина -->
        <v-btn icon variant="text" @click="cartStore.openCart">
          <v-badge 
            :content="cartStore.totalItems" 
            :color="shopStore.settings.primaryColor" 
            floating
            :model-value="cartStore.totalItems > 0"
          >
            <v-icon :color="shopStore.settings.textColor">mdi-shopping-outline</v-icon>
          </v-badge>
        </v-btn>
      </v-container>
    </v-app-bar>

    <!-- Контент магазина -->
    <v-main>
      <slot></slot>
    </v-main>

    <!-- Drawer корзины -->
    <CartDrawer />
  </v-app>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useShopStore } from '@/stores/shop'
import { useCartStore } from '@/stores/cart'
import CartDrawer from '@/components/CartDrawer.vue'

const shopStore = useShopStore()
const cartStore = useCartStore()

const appStyles = computed(() => ({
  backgroundColor: shopStore.settings.backgroundColor,
  color: shopStore.settings.textColor,
}))
</script>

<style scoped>
.mw-1200 {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
