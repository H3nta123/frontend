<template>
  <MainLayout>
    <h2 class="text-h6 text-grey mb-6 font-weight-bold text-lowercase">конструктор магазина</h2>

    <v-row>
      <v-col cols="12" md="8">
        <v-card class="pa-6" elevation="1">
          <h3 class="text-subtitle-1 font-weight-bold mb-4">Основные настройки</h3>

          <v-text-field label="Название магазина" variant="outlined" density="comfortable"></v-text-field>
          <v-textarea label="Описание магазина" variant="outlined" rows="3"></v-textarea>

          <h3 class="text-subtitle-1 font-weight-bold mb-2 mt-4">Цветовая схема</h3>
          <div class="d-flex gap-4 mb-6">
            <v-btn color="red" size="x-small" icon="mdi-check"></v-btn>
            <v-btn color="blue" size="x-small" icon></v-btn>
            <v-btn color="green" size="x-small" icon></v-btn>
            <v-btn color="black" size="x-small" icon></v-btn>
          </div>

          <v-btn color="#311b92" class="text-white" size="large">Сохранить изменения</v-btn>
        </v-card>
      </v-col>
    </v-row>
  </MainLayout>
</template>

<script setup lang="ts">
import MainLayout from '@/layouts/MainLayout.vue';
</script>
