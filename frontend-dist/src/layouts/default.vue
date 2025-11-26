<template>
  <v-app>
    <v-app-bar color="#2A1A8E" height="64" flat class="px-4">
      <v-app-bar-nav-icon variant="text" color="white">
        <v-icon icon="mdi-cart-outline" size="32"></v-icon>
      </v-app-bar-nav-icon>

      <v-spacer></v-spacer>

      <v-text-field
        v-model="search"
        placeholder="введите запрос"
        variant="solo"
        density="compact"
        hide-details
        rounded="lg"
        class="search-input"
        bg-color="white"
      >
        <template v-slot:append-inner>
          <v-icon icon="mdi-magnify"></v-icon>
        </template>
      </v-text-field>

      <v-spacer></v-spacer>

      <v-btn
        class="text-none mr-2"
        color="#7C84D4"
        variant="flat"
        rounded="pill"
        height="32"
      >
        мои заказы
      </v-btn>

      <v-avatar color="#7C84D4" size="40">
        <span class="text-h6 text-white">N</span>
      </v-avatar>
    </v-app-bar>

    <v-navigation-drawer permanent width="260" color="#E0E0E0">
      <v-list class="pt-4 bg-transparent">
        <v-list-item
          to="/home"
          rounded="0"
          active-color="primary"
          class="mb-1"
        >
          <template v-slot:prepend>
            <span class="font-weight-bold mr-2">главное</span>
            <v-icon icon="mdi-store" size="small"></v-icon>
          </template>
        </v-list-item>

        <v-divider class="my-2 border-opacity-75"></v-divider>

        <v-list-item
          to="/catalog"
          rounded="md"
          class="mb-1 mx-2"
          :class="route.path === '/catalog' ? 'bg-indigo-darken-3 text-white' : ''"
        >
          <template v-slot:prepend>
            <span class="font-weight-bold mr-2">каталог товаров</span>
            <v-icon icon="mdi-storefront-outline" size="small"></v-icon>
          </template>
        </v-list-item>

        <v-divider class="my-2 border-opacity-75"></v-divider>

        <v-list-item to="/constructor" rounded="0" class="mb-1">
          <template v-slot:prepend>
            <span class="font-weight-bold">конструктор магазина</span>
          </template>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main class="bg-grey-lighten-4">
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const search = ref('')
const route = useRoute()
</script>

<style scoped>
.search-input {
  max-width: 600px;
  width: 100%;
}
</style>
