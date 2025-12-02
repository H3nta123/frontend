<template>
  <MainLayout>
    <!-- Шапка конструктора -->
    <div class="d-flex justify-space-between align-center mb-4" style="height: 48px;">
      <div class="d-flex align-center">
        <v-btn icon="mdi-arrow-left" variant="text" to="/dashboard" class="mr-2"></v-btn>
        <h1 class="text-h6 font-weight-bold m-0">Редактор темы: {{ currentTheme.name }}</h1>
        <v-chip size="x-small" color="green" class="ml-3 font-weight-bold" label>Live</v-chip>
      </div>

      <div class="d-flex align-center gap-2">
        <span class="text-caption text-grey mr-2" v-if="saving">Сохранение...</span>
        <v-btn
          color="black"
          variant="flat"
          class="text-white text-none font-weight-bold px-6"
          rounded="lg"
          @click="saveChanges"
          :loading="saving"
        >
          Сохранить
        </v-btn>
      </div>
    </div>

    <v-divider class="mb-0"></v-divider>

    <!-- Основная рабочая область -->
    <div class="d-flex h-100 bg-grey-lighten-4" style="margin: 0 -32px -32px -32px; height: calc(100vh - 112px);">

      <!-- ЛЕВАЯ ПАНЕЛЬ: НАСТРОЙКИ (Sidebar) -->
      <div class="bg-white border-r d-flex flex-column" style="width: 320px; overflow-y: auto;">

        <!-- Секции настроек -->
        <v-expansion-panels flat variant="accordion" multiple v-model="openedPanels">

          <!-- Секция 1: Основное -->
          <v-expansion-panel value="general">
            <v-expansion-panel-title class="font-weight-bold">Общие настройки</v-expansion-panel-title>
            <v-expansion-panel-text>
              <label class="text-caption font-weight-bold text-grey-darken-1 mb-1 d-block">Название магазина</label>
              <v-text-field
                v-model="shopStore.settings.name"
                variant="outlined"
                density="compact"
                hide-details="auto"
                class="mb-4"
              ></v-text-field>

              <label class="text-caption font-weight-bold text-grey-darken-1 mb-1 d-block">Цвет акцента</label>
              <v-menu :close-on-content-click="false" location="end">
                <template v-slot:activator="{ props }">
                  <div v-bind="props" class="d-flex align-center border rounded pa-2 cursor-pointer hover-bg">
                    <v-sheet
                      width="24"
                      height="24"
                      rounded="circle"
                      class="mr-2 border"
                      :color="shopStore.settings.primaryColor"
                    ></v-sheet>
                    <span class="text-body-2">{{ shopStore.settings.primaryColor }}</span>
                  </div>
                </template>
                <v-card min-width="300" class="pa-2">
                  <v-color-picker v-model="shopStore.settings.primaryColor" mode="hex" hide-inputs></v-color-picker>
                </v-card>
              </v-menu>
            </v-expansion-panel-text>
          </v-expansion-panel>

          <!-- Секция 2: Баннер (Hero) -->
          <v-expansion-panel value="hero">
            <v-expansion-panel-title class="font-weight-bold">Баннер на главной</v-expansion-panel-title>
            <v-expansion-panel-text>
              <label class="text-caption font-weight-bold text-grey-darken-1 mb-1 d-block">Заголовок</label>
              <v-textarea
                v-model="shopStore.settings.heroTitle"
                variant="outlined"
                density="compact"
                rows="2"
                auto-grow
                hide-details="auto"
                class="mb-4"
              ></v-textarea>

              <label class="text-caption font-weight-bold text-grey-darken-1 mb-1 d-block">Подзаголовок</label>
              <v-textarea
                v-model="shopStore.settings.heroSubtitle"
                variant="outlined"
                density="compact"
                rows="3"
                auto-grow
                hide-details="auto"
                class="mb-4"
              ></v-textarea>
            </v-expansion-panel-text>
          </v-expansion-panel>

          <!-- Секция 3: Цвета фона -->
          <v-expansion-panel value="colors">
            <v-expansion-panel-title class="font-weight-bold">Фон страницы</v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-radio-group v-model="shopStore.settings.backgroundColor" hide-details>
                <v-radio label="Белый" value="#FFFFFF"></v-radio>
                <v-radio label="Светло-серый" value="#F5F5F5"></v-radio>
                <v-radio label="Кремовый" value="#FFFDD0"></v-radio>
                <v-radio label="Темный" value="#121212"></v-radio>
              </v-radio-group>
            </v-expansion-panel-text>
          </v-expansion-panel>

        </v-expansion-panels>
      </div>

      <!-- ПРАВАЯ ЧАСТЬ: ПРЕДПРОСМОТР (Iframe) -->
      <div class="flex-grow-1 d-flex flex-column align-center justify-center bg-grey-lighten-3 pa-8 overflow-hidden relative">

        <!-- Панель управления видом (Desktop/Mobile) -->
        <v-sheet
          elevation="2"
          rounded="pill"
          height="48"
          class="d-flex align-center px-2 mb-4 absolute-top-center"
          style="position: absolute; top: 16px; z-index: 10;"
        >
          <v-btn
            variant="text"
            size="small"
            icon="mdi-monitor"
            :color="viewMode === 'desktop' ? 'black' : 'grey'"
            @click="viewMode = 'desktop'"
          ></v-btn>
          <v-btn
            variant="text"
            size="small"
            icon="mdi-cellphone"
            :color="viewMode === 'mobile' ? 'black' : 'grey'"
            @click="viewMode = 'mobile'"
          ></v-btn>
          <v-divider vertical class="mx-2 my-2"></v-divider>
          <v-btn
            variant="text"
            size="small"
            icon="mdi-refresh"
            color="grey-darken-2"
            @click="refreshPreview"
          ></v-btn>
        </v-sheet>

        <!-- Рамка устройства -->
        <div
          class="preview-container bg-white elevation-5 transition-all"
          :class="viewMode === 'mobile' ? 'mobile-view rounded-xl' : 'desktop-view rounded-lg'"
        >
          <!-- САМ IFRAME С МАГАЗИНОМ -->
          <iframe
            id="store-preview"
            src="/shop/preview"
            frameborder="0"
            class="w-100 h-100"
            ref="previewFrame"
          ></iframe>
        </div>

      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import MainLayout from '@/layouts/MainLayout.vue';
import { useShopStore } from '@/stores/shop';

const shopStore = useShopStore();
const saving = ref(false);
const viewMode = ref('desktop'); // desktop | mobile
const openedPanels = ref(['general', 'hero']);
const previewFrame = ref<HTMLIFrameElement | null>(null);

const currentTheme = { name: 'Minimal Start' };

// Имитация сохранения
const saveChanges = () => {
  saving.value = true;
  // Здесь мы могли бы отправлять данные на бэкенд
  setTimeout(() => {
    saving.value = false;
  }, 800);
};

// ХАК: Чтобы Iframe обновлялся, нам нужно передавать данные
// В реальном SPA Pinia общая, изменения должны быть видны сразу
// Если Iframe не обновляется, можно форсировать обновление ключа
const refreshPreview = () => {
  if (previewFrame.value) {
    previewFrame.value.src = previewFrame.value.src;
  }
};

</script>

<style scoped>
.hover-bg:hover {
  background-color: #f5f5f5;
}

/* Стили для рамки предпросмотра */
.preview-container {
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid #e0e0e0;
}

.desktop-view {
  width: 100%;
  height: 100%;
  max-width: 100%;
}

.mobile-view {
  width: 375px; /* Ширина iPhone */
  height: 100%; /* Высота */
  max-height: 812px;
  border: 8px solid #333; /* Рамка "телефона" */
}
</style>
