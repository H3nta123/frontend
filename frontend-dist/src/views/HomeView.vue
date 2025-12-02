<template>
  <MainLayout>
    <v-container fluid class="pa-0 mw-1200">

      <v-row class="mb-8 align-start">
        <v-col cols="12" md="5">
          <h1 class="text-h3 font-weight-black text-black mt-2" style="line-height: 1.1;">
            продавайте<br>быстрее
          </h1>
        </v-col>
        <v-col cols="12" md="7" class="pl-md-10">
          <p class="text-body-1 font-weight-bold mb-8 text-black" style="line-height: 1.5; max-width: 550px;">
            Запустите свой магазин за 20 минут. Выберите шаблон, добавьте товары
            и опубликуйте. Никаких сложных настроек. Прозрачная цена.
          </p>
          <v-btn
            color="#37E23F"
            class="text-white text-none px-10 font-weight-bold"
            rounded="pill"
            elevation="0"
            height="56"
            width="280"
            size="x-large"
            to="/login"
          >
            создать магазин
          </v-btn>
        </v-col>
      </v-row>

      <v-divider class="mb-12 border-opacity-100" color="black"></v-divider>

      <h2 class="text-h4 font-weight-bold text-center mb-10 text-black">тарифы</h2>

      <v-row justify="center" class="mb-16 gap-4">
        <v-col cols="12" md="5" lg="4">
          <v-sheet color="grey-lighten-2" height="320" class="rounded-lg w-100"></v-sheet>
        </v-col>
        <v-col cols="12" md="5" lg="4">
          <v-sheet color="grey-lighten-2" height="320" class="rounded-lg w-100"></v-sheet>
        </v-col>
      </v-row>

    </v-container>
  </MainLayout>
</template>

<script setup lang="ts">
import MainLayout from '@/layouts/MainLayout.vue';
</script>

<style scoped>
.mw-1200 {
  max-width: 1000px;
  margin: 0 auto;
}
</style>
