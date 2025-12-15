<template>
  <MainLayout>
    <v-container fluid class="pa-0 mw-1200">
      
      <!-- Заголовок -->
      <div class="mb-8">
        <h1 class="text-h4 font-weight-bold text-black mb-2">Добро пожаловать, {{ authStore.user?.name || authStore.user?.email }}!</h1>
        <p class="text-body-1 text-grey-darken-1">Панель управления вашим магазином.</p>
      </div>

      <v-row>
        <!-- Карточка создания сайта -->
        <v-col cols="12" md="6" lg="4">
          <v-card class="rounded-xl border pa-6 h-100 d-flex flex-column align-center justify-center text-center bg-grey-lighten-5 cursor-pointer" flat style="min-height: 240px; border-style: dashed !important; border-width: 2px;" @click="goToBuilder">
            <v-icon icon="mdi-plus-circle-outline" size="64" color="primary" class="mb-4"></v-icon>
            <h3 class="text-h6 font-weight-bold mb-1">Создать / Редактировать сайт</h3>
            <p class="text-caption text-grey">Перейти в конструктор магазина</p>
          </v-card>
        </v-col>

        <!-- Плейсхолдер для будущей аналитики -->
        <v-col cols="12" md="6" lg="8">
           <v-card class="rounded-xl border pa-6 h-100 d-flex flex-column align-center justify-center text-center bg-white" flat style="min-height: 240px;">
            <v-icon icon="mdi-chart-bar" size="64" color="grey-lighten-2" class="mb-4"></v-icon>
            <h3 class="text-h6 font-weight-bold mb-1 text-grey-darken-1">Аналитика пока не доступна</h3>
            <p class="text-caption text-grey">Здесь будет отображаться статистика продаж и заказов</p>
          </v-card>
        </v-col>
      </v-row>

    </v-container>
  </MainLayout>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const goToBuilder = () => {
  router.push('/builder')
}
</script>

<style scoped>
.mw-1200 {
  max-width: 1200px;
  margin: 0 auto;
}
.cursor-pointer {
    cursor: pointer;
    transition: background-color 0.2s;
}
.cursor-pointer:hover {
    background-color: #f0f0f0 !important;
}
</style>
