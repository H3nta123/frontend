<template>
  <MainLayout>
    <!-- Заголовок как на скрине -->
    <div class="d-flex align-center mb-6">
      <h1 class="text-h5 font-weight-bold text-black">шаблоны магазинов</h1>
    </div>

    <!-- Пустое состояние или контент -->
    <v-row>
      <!-- Здесь можно разместить карточки шаблонов в будущем -->
      <v-col cols="12">
        <div class="text-grey text-body-1">
          Здесь будут доступны шаблоны для вашего магазина.
        </div>
      </v-col>
    </v-row>
  </MainLayout>
</template>

<script setup lang="ts">
import MainLayout from '@/layouts/MainLayout.vue';
</script>
