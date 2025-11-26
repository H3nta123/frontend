<template>
  <MainLayout>
    <v-container fluid class="pa-0 mw-1200">

      <!-- 1. HERO БЛОК -->
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
          >
            создать магазин
          </v-btn>
        </v-col>
      </v-row>

      <!-- Черная линия разделитель -->
      <v-divider class="mb-12 border-opacity-100" color="black"></v-divider>

      <!-- 2. ТАРИФЫ -->
      <h2 class="text-h4 font-weight-bold text-center mb-10 text-black">тарифы</h2>

      <v-row justify="center" class="mb-16 gap-4">
        <v-col cols="12" md="5" lg="4">
          <v-sheet color="grey-lighten-2" height="320" class="rounded-lg w-100"></v-sheet>
        </v-col>
        <v-col cols="12" md="5" lg="4">
          <v-sheet color="grey-lighten-2" height="320" class="rounded-lg w-100"></v-sheet>
        </v-col>
      </v-row>

      <!-- 3. ТРИ ШАГА ЗАПУСКА -->
      <h2 class="text-h4 font-weight-bold text-center mb-4 text-black">три шага запуска</h2>
      <p class="text-center text-grey-darken-2 text-caption font-weight-bold mb-10">
        Выберите шаблон, добавьте товары, опубликуйте.<br>
        Мгновенный запуск вашего интернет-магазина.
      </p>

      <v-row class="mb-16" justify="center" align="stretch">
        <v-col cols="12" md="4" v-for="n in 3" :key="n">
          <!-- Синие карточки #303F9F -->
          <v-card color="#303F9F" height="200" class="rounded-xl pa-5" flat>
            <v-avatar color="white" size="40" class="font-weight-black text-black elevation-0 text-h6">
              {{ n }}
            </v-avatar>
            <div class="mt-4 text-white font-weight-bold" v-if="n===1">Выберите шаблон</div>
            <div class="mt-4 text-white font-weight-bold" v-if="n===2">добавьте товары</div>
            <div class="mt-4 text-white font-weight-bold" v-if="n===3">опубликуйте</div>
          </v-card>
        </v-col>
      </v-row>

      <!-- 4. ПРЕИМУЩЕСТВА -->
      <h2 class="text-h4 font-weight-bold text-center mb-10 text-black">преимущества платформы</h2>

      <v-row>
        <!-- Большая карточка (номер 1) -->
        <v-col cols="12">
          <v-card color="#303F9F" height="140" class="rounded-xl d-flex align-center px-6" flat>
            <v-sheet
              color="#37E23F"
              width="70"
              height="90"
              class="rounded-lg d-flex align-center justify-center flex-shrink-0"
            >
              <span class="text-h3 font-weight-bold text-black">1</span>
            </v-sheet>
            <div class="ml-6 text-white text-h6 font-weight-bold">
              Главное преимущество — Запуск за 20–30 минут
            </div>
          </v-card>
        </v-col>

        <!-- Маленькие карточки (2, 3, 4) -->
        <v-col cols="12" md="4">
          <v-card color="#303F9F" height="220" class="rounded-xl pa-5" flat>
            <v-sheet
              color="#37E23F"
              width="60"
              height="60"
              class="rounded-lg d-flex align-center justify-center mb-4"
            >
              <span class="text-h4 font-weight-bold text-black">2</span>
            </v-sheet>
            <div class="text-white text-body-2 font-weight-bold">
              Простота и интуитивность «Интерфейс, который понятен с первого
            </div>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card color="#303F9F" height="220" class="rounded-xl pa-5" flat>
            <v-sheet
              color="#37E23F"
              width="60"
              height="60"
              class="rounded-lg d-flex align-center justify-center mb-4"
            >
              <span class="text-h4 font-weight-bold text-black">3</span>
            </v-sheet>
            <div class="text-white text-body-2 font-weight-bold">
              Прозрачная цена — никаких скрытых комиссий
            </div>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card color="#303F9F" height="220" class="rounded-xl pa-5" flat>
            <v-sheet
              color="#37E23F"
              width="60"
              height="60"
              class="rounded-lg d-flex align-center justify-center mb-4"
            >
              <span class="text-h4 font-weight-bold text-black">4</span>
            </v-sheet>
            <div class="text-white text-body-2 font-weight-bold">
              Умные шаблоны под вашу нишу
            </div>
          </v-card>
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
  max-width: 1000px; /* Чуть уменьшил ширину контента, чтобы было как на макете */
  margin: 0 auto;
}
</style>
