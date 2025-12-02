<template>
  <ShopLayout>
    <!-- Hero Баннер -->
    <v-sheet
      height="500"
      class="d-flex align-center justify-center text-center px-4"
      color="grey-lighten-3"
    >
      <div style="max-width: 700px;">
        <h1 class="text-h2 font-weight-black mb-4">{{ shopStore.settings.heroTitle }}</h1>
        <p class="text-h6 font-weight-regular text-grey-darken-2 mb-8">
          {{ shopStore.settings.heroSubtitle }}
        </p>
        <v-btn
          size="x-large"
          rounded="pill"
          elevation="0"
          class="text-white text-none font-weight-bold px-10"
          :color="shopStore.settings.primaryColor"
        >
          Смотреть каталог
        </v-btn>
      </div>
    </v-sheet>

    <v-container class="py-16 mw-1200">
      <h2 class="text-h4 font-weight-bold text-center mb-12">Популярные товары</h2>

      <v-row>
        <v-col
          v-for="product in shopStore.products"
          :key="product.id"
          cols="12"
          sm="6"
          md="4"
        >
          <v-card class="rounded-xl" flat :to="`/shop/product/${product.id}`">
            <!-- Изображение товара -->
            <v-sheet
              color="grey-lighten-4"
              height="300"
              class="rounded-xl mb-4 d-flex align-center justify-center"
            >
              <v-icon size="64" color="grey-lighten-2">mdi-tshirt-crew-outline</v-icon>
            </v-sheet>

            <div class="px-2">
              <h3 class="text-h6 font-weight-bold mb-1">{{ product.name }}</h3>
              <div class="text-body-1 font-weight-medium text-grey-darken-1">
                {{ product.price }} ₽
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </ShopLayout>
</template>

<script setup lang="ts">
import ShopLayout from '@/layouts/ShopLayout.vue';
import { useShopStore } from '@/stores/shop';

const shopStore = useShopStore();
</script>

<style scoped>
.mw-1200 {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
