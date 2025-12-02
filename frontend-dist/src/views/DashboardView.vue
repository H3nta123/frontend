<template>
  <MainLayout>
    <v-container fluid class="pa-0 mw-1200">

      <!-- Заголовок и дата -->
      <div class="d-flex justify-space-between align-center mb-6">
        <div>
          <h1 class="text-h5 font-weight-black text-black">Главная</h1>
          <p class="text-body-2 text-grey-darken-1">Добро пожаловать обратно, Никита!</p>
        </div>
        <v-btn variant="text" color="grey" prepend-icon="mdi-calendar">
          Сегодня, 2 Дек
        </v-btn>
      </div>

      <!-- Виджет: Гид по запуску (Setup Guide) -->
      <v-card class="rounded-xl border mb-8" flat>
        <div class="pa-6 d-flex justify-space-between align-start">
          <div style="max-width: 600px;">
            <h3 class="text-h6 font-weight-bold mb-2">Настройте свой магазин</h3>
            <p class="text-body-2 text-grey-darken-2 mb-4">
              Выполнили 1 из 4 шагов. Завершите настройку, чтобы начать продажи.
            </p>
            <v-progress-linear
              model-value="25"
              color="#37E23F"
              height="8"
              rounded
              class="mb-4"
            ></v-progress-linear>
          </div>
          <v-avatar color="grey-lighten-4" rounded="lg" size="48">
            <v-icon icon="mdi-rocket-launch-outline" color="#2A1A8E"></v-icon>
          </v-avatar>
        </div>

        <v-divider></v-divider>

        <!-- Список шагов -->
        <v-list class="py-0">
          <!-- Шаг 1 (Выполнен) -->
          <v-list-item class="py-3">
            <template v-slot:prepend>
              <v-icon icon="mdi-check-circle" color="#37E23F" class="mr-4"></v-icon>
            </template>
            <v-list-item-title class="text-decoration-line-through text-grey">
              Создать аккаунт
            </v-list-item-title>
          </v-list-item>

          <v-divider></v-divider>

          <!-- Шаг 2 -->
          <v-list-item class="py-3" to="/catalog" ripple>
            <template v-slot:prepend>
              <v-icon icon="mdi-circle-outline" color="grey" class="mr-4"></v-icon>
            </template>
            <v-list-item-title class="font-weight-bold">Добавить первый товар</v-list-item-title>
            <template v-slot:append>
              <v-btn size="small" color="#2A1A8E" variant="flat" rounded="lg" class="text-none font-weight-bold px-4" to="/catalog">
                Добавить
              </v-btn>
            </template>
          </v-list-item>

          <v-divider></v-divider>

          <!-- Шаг 3 -->
          <v-list-item class="py-3" to="/builder" ripple>
            <template v-slot:prepend>
              <v-icon icon="mdi-circle-outline" color="grey" class="mr-4"></v-icon>
            </template>
            <v-list-item-title class="font-weight-bold">Настроить тему магазина</v-list-item-title>
            <template v-slot:append>
              <v-btn size="small" variant="text" rounded="lg" class="text-none font-weight-bold text-grey-darken-3">
                Перейти
              </v-btn>
            </template>
          </v-list-item>
        </v-list>
      </v-card>

      <!-- Блок: Аналитика (Сегодня) -->
      <h3 class="text-body-1 font-weight-bold text-grey-darken-2 mb-4 text-uppercase ls-1">Обзор за сегодня</h3>

      <v-row class="mb-8">
        <!-- Карточка: Продажи -->
        <v-col cols="12" md="4">
          <v-card class="rounded-xl border pa-5 h-100 hover-card" flat>
            <div class="d-flex justify-space-between mb-4">
              <span class="text-caption font-weight-bold text-grey">ОБЩИЕ ПРОДАЖИ</span>
              <v-icon icon="mdi-dots-horizontal" color="grey" size="small"></v-icon>
            </div>
            <div class="text-h4 font-weight-black mb-2">0 ₽</div>
            <div class="d-flex align-center">
              <v-icon icon="mdi-arrow-right" size="small" color="grey" class="mr-1"></v-icon>
              <span class="text-caption text-grey">Нет данных за вчера</span>
            </div>
          </v-card>
        </v-col>

        <!-- Карточка: Посетители -->
        <v-col cols="12" md="4">
          <v-card class="rounded-xl border pa-5 h-100 hover-card" flat>
            <div class="d-flex justify-space-between mb-4">
              <span class="text-caption font-weight-bold text-grey">СЕССИИ</span>
              <v-icon icon="mdi-dots-horizontal" color="grey" size="small"></v-icon>
            </div>
            <div class="text-h4 font-weight-black mb-2">12</div>
            <div class="d-flex align-center">
              <v-icon icon="mdi-arrow-up" size="small" color="#37E23F" class="mr-1"></v-icon>
              <span class="text-caption text-green font-weight-bold">+20%</span>
            </div>
          </v-card>
        </v-col>

        <!-- Карточка: Заказы -->
        <v-col cols="12" md="4">
          <v-card class="rounded-xl border pa-5 h-100 hover-card" flat>
            <div class="d-flex justify-space-between mb-4">
              <span class="text-caption font-weight-bold text-grey">ЗАКАЗЫ</span>
              <v-icon icon="mdi-dots-horizontal" color="grey" size="small"></v-icon>
            </div>
            <div class="text-h4 font-weight-black mb-2">0</div>
            <div class="d-flex align-center">
              <v-btn
                variant="text"
                color="#4527A0"
                class="px-0 text-none font-weight-bold text-caption"
                height="auto"
                to="/orders"
              >
                Создать тестовый заказ
              </v-btn>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <!-- Блок: Что дальше -->
      <v-row>
        <v-col cols="12" md="8">
          <v-card class="rounded-xl border pa-0 overflow-hidden" flat>
            <v-card-title class="font-weight-bold py-4 px-6 bg-grey-lighten-5 border-b">
              Последние действия
            </v-card-title>
            <v-list>
              <v-list-item class="py-3">
                <template v-slot:prepend>
                  <v-avatar color="#2A1A8E" size="32" class="mr-3">
                    <span class="text-white text-caption font-weight-bold">N</span>
                  </v-avatar>
                </template>
                <v-list-item-title class="text-body-2 font-weight-bold">Вы вошли в систему</v-list-item-title>
                <v-list-item-subtitle class="text-caption">Только что</v-list-item-subtitle>
              </v-list-item>
              <v-divider></v-divider>
              <v-list-item class="py-3">
                <template v-slot:prepend>
                  <v-avatar color="grey-lighten-3" size="32" class="mr-3">
                    <v-icon icon="mdi-store-edit" size="16" color="black"></v-icon>
                  </v-avatar>
                </template>
                <v-list-item-title class="text-body-2 font-weight-bold">Магазин создан</v-list-item-title>
                <v-list-item-subtitle class="text-caption">20 минут назад</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <!-- Рекламный блок (как в Shopify) -->
          <v-card color="#2A1A8E" class="rounded-xl pa-6 h-100 d-flex flex-column justify-center" flat>
            <h3 class="text-white font-weight-bold mb-2">Тариф "Старт"</h3>
            <p class="text-white text-body-2 mb-6 opacity-80">
              Ваш пробный период заканчивается через 14 дней. Выберите план, чтобы не остановить продажи.
            </p>
            <v-btn color="#37E23F" class="text-white text-none font-weight-bold" rounded="lg" block>
              Выбрать тариф
            </v-btn>
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
  max-width: 1000px;
  margin: 0 auto;
}
.ls-1 {
  letter-spacing: 1px !important;
}
.hover-card {
  transition: box-shadow 0.2s;
}
.hover-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.08) !important;
}
</style>
