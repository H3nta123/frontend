<template>
  <v-app>
    <!-- ШАПКА -->
    <v-app-bar color="#2A2359" height="60" flat class="px-2">
      <div class="d-flex align-center ml-2">
        <!-- Логотип-заглушка -->
        <div style="background-color: black; width: 50px; height: 24px; border-radius: 12px;"></div>
      </div>

      <v-spacer></v-spacer>

      <!-- Поиск -->
      <v-responsive max-width="400" class="mx-4">
        <v-text-field
          density="compact"
          variant="solo"
          label="поиск"
          append-inner-icon="mdi-magnify"
          single-line
          hide-details
          rounded="xl"
          bg-color="white"
          class="custom-search"
        ></v-text-field>
      </v-responsive>

      <!-- Профиль -->
      <v-avatar color="#5C54A4" size="40" class="mr-2 cursor-pointer">
        <span class="text-white text-h6">N</span>
      </v-avatar>
    </v-app-bar>

    <!-- БОКОВОЕ МЕНЮ -->
    <v-navigation-drawer
      permanent
      color="#E0E0E0"
      width="220"
      class="border-none"
    >
      <v-list class="pt-4 px-3">
        <!-- Главное -->
        <v-list-item
          to="/dashboard"
          class="mb-2 rounded-pill"
          active-class="bg-deep-purple-lighten-1 text-white"
          density="compact"
        >
          <v-list-item-title class="font-weight-bold text-caption pl-1">
            главное
          </v-list-item-title>
        </v-list-item>

        <!-- Каталог -->
        <v-list-item
          to="/catalog"
          class="mb-2 rounded-pill"
          active-class="bg-deep-purple-lighten-1 text-white"
          density="compact"
        >
          <v-list-item-title class="font-weight-bold text-caption pl-1">
            каталог товаров
          </v-list-item-title>
        </v-list-item>

        <!-- Конструктор -->
        <v-list-item
          to="/builder"
          class="mb-2 rounded-pill"
          active-class="bg-deep-purple-lighten-1 text-white"
          density="compact"
        >
          <v-list-item-title class="font-weight-bold text-caption pl-1">
            конструктор магазина
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- ОСНОВНОЙ КОНТЕНТ (Сюда подставляются страницы) -->
    <v-main class="bg-white">
      <v-container fluid class="pa-8 mw-900">
        <slot></slot>
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
.mw-900 {
  max-width: 900px;
  margin: 0 auto;
}
.custom-search :deep(.v-field) {
  box-shadow: none !important;
}
.cursor-pointer {
  cursor: pointer;
}
</style>
