<template>
  <!-- Используем v-app внутри view, чтобы layout работал корректно -->
  <v-app>
    <!-- === ШАПКА === -->
    <!-- Цвет #2A1A8E подобран пипеткой с макета -->
    <v-app-bar color="#2A1A8E" height="64" flat class="px-4">
      <!-- Иконка корзины (логотип) -->
      <v-avatar color="white" size="40" class="mr-4">
        <v-icon icon="mdi-cart-outline" color="black" size="24"></v-icon>
      </v-avatar>

      <v-spacer></v-spacer>

      <!-- Поиск по центру -->
      <v-responsive max-width="600" class="mx-4">
        <v-text-field
          density="compact"
          variant="solo"
          placeholder="введите запрос"
          append-inner-icon="mdi-magnify"
          single-line
          hide-details
          rounded="lg"
          bg-color="white"
          class="custom-search"
        ></v-text-field>
      </v-responsive>

      <v-spacer></v-spacer>

      <!-- Кнопка "Мои заказы" -->
      <v-btn
        class="text-none mr-3 px-4 font-weight-medium"
        color="#7C84D4"
        variant="flat"
        rounded="pill"
        height="32"
      >
        мои заказы
      </v-btn>

      <!-- Аватар N -->
      <v-avatar color="#7C84D4" size="40">
        <span class="text-white text-h6">N</span>
      </v-avatar>
    </v-app-bar>

    <!-- === БОКОВОЕ МЕНЮ === -->
    <!-- Цвет фона #E0E0E0 -->
    <v-navigation-drawer
      permanent
      color="#E0E0E0"
      width="260"
      class="border-none"
    >
      <v-list class="pt-4 bg-transparent px-2">
        <!-- Пункт 1: Главное (Активный) -->
        <!-- Добавил иконку mdi-store -->
        <v-list-item
          to="/"
          rounded="0"
          class="mb-1 pl-4"
          active-class="active-sidebar-item"
        >
          <!-- Эмуляция активного состояния как на макете (синяя полоска, белый текст) -->
          <v-sheet
            v-if="true"
            color="#5C6BC0"
            class="pa-2 rounded d-flex align-center w-100"
            height="40"
          >
            <span class="font-weight-bold text-body-2 text-white mr-auto">главное</span>
            <v-icon icon="mdi-store" color="white" size="small"></v-icon>
          </v-sheet>
        </v-list-item>

        <v-divider class="my-2 border-opacity-75"></v-divider>

        <!-- Пункт 2: Каталог -->
        <v-list-item to="/catalog" rounded="lg" class="mb-1 pl-4">
          <div class="d-flex align-center w-100 py-1">
            <span class="font-weight-bold text-body-2 text-black mr-auto">каталог товаров</span>
            <v-icon icon="mdi-storefront-outline" color="black" size="small"></v-icon>
          </div>
        </v-list-item>

        <v-divider class="my-2 border-opacity-75"></v-divider>

        <!-- Пункт 3: Конструктор -->
        <v-list-item to="/builder" rounded="lg" class="mb-1 pl-4">
          <div class="d-flex align-center w-100 py-1">
            <span class="font-weight-bold text-body-2 text-black">конструктор магазина</span>
          </div>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- === ОСНОВНОЙ КОНТЕНТ === -->
    <v-main class="bg-white">
      <v-container fluid class="pa-10 mw-1200">

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
            </v-card>
          </v-col>
        </v-row>

        <!-- 4. ПРЕИМУЩЕСТВА -->
        <h2 class="text-h4 font-weight-bold text-center mb-10 text-black">преимущества платформы</h2>

        <v-row>
          <!-- Большая карточка (номер 1) -->
          <v-col cols="12">
            <v-card color="#303F9F" height="140" class="rounded-xl d-flex align-center px-4" flat>
              <v-sheet
                color="#37E23F"
                width="70"
                height="90"
                class="rounded-lg ml-4 d-flex align-center justify-center"
              >
                <span class="text-h3 font-weight-bold text-black">1</span>
              </v-sheet>
            </v-card>
          </v-col>

          <!-- Маленькие карточки (2, 3, 4) -->
          <v-col cols="12" md="4" v-for="n in 3" :key="n">
            <v-card color="#303F9F" height="220" class="rounded-xl pa-5" flat>
              <v-sheet
                color="#37E23F"
                width="60"
                height="60"
                class="rounded-lg d-flex align-center justify-center"
              >
                <span class="text-h4 font-weight-bold text-black">{{ n + 1 }}</span>
              </v-sheet>
            </v-card>
          </v-col>
        </v-row>

      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
// Логика не требуется для статической верстки
</script>

<style scoped>
/* Ограничиваем ширину контента, чтобы на больших экранах не разъезжалось */
.mw-1200 {
  max-width: 1200px;
  margin: 0 auto;
}

/* Убираем лишние тени у поиска */
.custom-search :deep(.v-field) {
  box-shadow: none !important;
}

/* Скрываем скроллбар у страницы, если нужно */
html {
  overflow-y: auto;
}
</style>
