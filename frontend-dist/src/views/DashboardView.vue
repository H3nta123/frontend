<template>
  <MainLayout>
    <h2 class="text-h6 text-grey mb-6 font-weight-bold text-lowercase">главное</h2>
    <v-row>
      <v-col cols="12" md="4">
        <v-card class="pa-4 text-center" color="blue-lighten-5" elevation="0">
          <div class="text-h2 font-weight-bold text-blue mb-2">0</div>
          <div class="text-caption text-uppercase font-weight-bold">Заказов сегодня</div>
        </v-card>
      </v-col>
    </v-row>
  </MainLayout>
</template>

<script setup lang="ts">
import MainLayout from '@/layouts/MainLayout.vue';
</script>
