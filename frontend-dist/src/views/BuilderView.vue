<template>
  <MainLayout>
    <!-- Шапка конструктора -->
    <div class="d-flex justify-space-between align-center mb-4" style="height: 48px;">
      <div class="d-flex align-center">
        <v-btn icon="mdi-arrow-left" variant="text" to="/themes" class="mr-2"></v-btn>
        <h1 class="text-h6 font-weight-bold m-0">Редактор: {{ shopStore.currentTheme.name }}</h1>
        <v-chip size="x-small" color="green" class="ml-3 font-weight-bold" label>Live</v-chip>
      </div>

      <div class="d-flex align-center gap-2">
        <v-btn
          variant="outlined"
          class="text-none font-weight-bold"
          rounded="lg"
          to="/themes"
        >
          Шаблоны
        </v-btn>
        <v-btn
          color="#37E23F"
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

      <!-- ЛЕВАЯ ПАНЕЛЬ: НАСТРОЙКИ -->
      <div class="bg-white border-r d-flex flex-column" style="width: 340px; overflow-y: auto;">

        <v-expansion-panels flat variant="accordion" multiple v-model="openedPanels">

          <!-- Секция: Общие настройки -->
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

              <label class="text-caption font-weight-bold text-grey-darken-1 mb-1 d-block">URL логотипа</label>
              <v-text-field
                v-model="shopStore.settings.logoUrl"
                placeholder="https://..."
                variant="outlined"
                density="compact"
                hide-details="auto"
                class="mb-4"
              ></v-text-field>
            </v-expansion-panel-text>
          </v-expansion-panel>

          <!-- Секция: Цвета -->
          <v-expansion-panel value="colors">
            <v-expansion-panel-title class="font-weight-bold">Цвета</v-expansion-panel-title>
            <v-expansion-panel-text>
              <!-- Основной цвет -->
              <label class="text-caption font-weight-bold text-grey-darken-1 mb-1 d-block">Основной цвет</label>
              <ColorPicker v-model="shopStore.settings.primaryColor" class="mb-4" />

              <!-- Вторичный цвет -->
              <label class="text-caption font-weight-bold text-grey-darken-1 mb-1 d-block">Вторичный цвет</label>
              <ColorPicker v-model="shopStore.settings.secondaryColor" class="mb-4" />

              <!-- Фон -->
              <label class="text-caption font-weight-bold text-grey-darken-1 mb-1 d-block">Цвет фона</label>
              <v-btn-toggle v-model="shopStore.settings.backgroundColor" mandatory class="flex-wrap mb-4">
                <v-btn value="#FFFFFF" size="small" class="rounded-lg">
                  <v-sheet width="20" height="20" color="#FFFFFF" rounded="circle" class="border mr-1"></v-sheet>
                  Белый
                </v-btn>
                <v-btn value="#FAFAFA" size="small" class="rounded-lg">
                  <v-sheet width="20" height="20" color="#FAFAFA" rounded="circle" class="border mr-1"></v-sheet>
                  Серый
                </v-btn>
                <v-btn value="#121212" size="small" class="rounded-lg">
                  <v-sheet width="20" height="20" color="#121212" rounded="circle" class="border mr-1"></v-sheet>
                  Тёмный
                </v-btn>
              </v-btn-toggle>

              <!-- Цвет текста -->
              <label class="text-caption font-weight-bold text-grey-darken-1 mb-1 d-block">Цвет текста</label>
              <v-btn-toggle v-model="shopStore.settings.textColor" mandatory>
                <v-btn value="#212121" size="small">Тёмный</v-btn>
                <v-btn value="#FFFFFF" size="small">Светлый</v-btn>
              </v-btn-toggle>
            </v-expansion-panel-text>
          </v-expansion-panel>

          <!-- Секция: Hero баннер -->
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
                rows="2"
                auto-grow
                hide-details="auto"
                class="mb-4"
              ></v-textarea>

              <label class="text-caption font-weight-bold text-grey-darken-1 mb-1 d-block">Текст кнопки</label>
              <v-text-field
                v-model="shopStore.settings.heroButtonText"
                variant="outlined"
                density="compact"
                hide-details="auto"
                class="mb-4"
              ></v-text-field>

              <label class="text-caption font-weight-bold text-grey-darken-1 mb-1 d-block">Расположение</label>
              <v-btn-toggle v-model="shopStore.settings.heroStyle" mandatory class="mb-4">
                <v-btn value="left" size="small">Слева</v-btn>
                <v-btn value="centered" size="small">Центр</v-btn>
                <v-btn value="right" size="small">Справа</v-btn>
              </v-btn-toggle>

              <label class="text-caption font-weight-bold text-grey-darken-1 mb-1 d-block">Фоновое изображение (URL)</label>
              <v-text-field
                v-model="shopStore.settings.heroImage"
                placeholder="https://..."
                variant="outlined"
                density="compact"
                hide-details="auto"
                class="mb-4"
              ></v-text-field>

              <v-switch
                v-model="shopStore.settings.heroOverlay"
                label="Затемнение поверх фото"
                color="#4527A0"
                density="compact"
                hide-details
              ></v-switch>
            </v-expansion-panel-text>
          </v-expansion-panel>

          <!-- Секция: Секции страницы -->
          <v-expansion-panel value="sections">
            <v-expansion-panel-title class="font-weight-bold">Секции страницы</v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-switch
                v-model="shopStore.settings.showProductsSection"
                label="Показывать товары"
                color="#4527A0"
                density="compact"
                hide-details
                class="mb-2"
              ></v-switch>

              <v-text-field
                v-if="shopStore.settings.showProductsSection"
                v-model="shopStore.settings.productsTitle"
                label="Заголовок секции товаров"
                variant="outlined"
                density="compact"
                hide-details="auto"
                class="mb-4"
              ></v-text-field>

              <v-switch
                v-model="shopStore.settings.showAboutSection"
                label="Секция 'О нас'"
                color="#4527A0"
                density="compact"
                hide-details
                class="mb-2"
              ></v-switch>

              <v-textarea
                v-if="shopStore.settings.showAboutSection"
                v-model="shopStore.settings.aboutText"
                label="Текст о магазине"
                variant="outlined"
                density="compact"
                rows="3"
                hide-details
              ></v-textarea>
            </v-expansion-panel-text>
          </v-expansion-panel>

          <!-- Секция: Футер -->
          <v-expansion-panel value="footer">
            <v-expansion-panel-title class="font-weight-bold">Футер</v-expansion-panel-title>
            <v-expansion-panel-text>
              <label class="text-caption font-weight-bold text-grey-darken-1 mb-1 d-block">Текст футера</label>
              <v-text-field
                v-model="shopStore.settings.footerText"
                variant="outlined"
                density="compact"
                hide-details="auto"
                class="mb-4"
              ></v-text-field>

              <label class="text-caption font-weight-bold text-grey-darken-1 mb-1 d-block">Telegram</label>
              <v-text-field
                v-model="shopStore.settings.socialLinks.telegram"
                placeholder="@username или ссылка"
                variant="outlined"
                density="compact"
                hide-details="auto"
                class="mb-4"
                prepend-inner-icon="mdi-send"
              ></v-text-field>

              <label class="text-caption font-weight-bold text-grey-darken-1 mb-1 d-block">Instagram</label>
              <v-text-field
                v-model="shopStore.settings.socialLinks.instagram"
                placeholder="@username"
                variant="outlined"
                density="compact"
                hide-details="auto"
                prepend-inner-icon="mdi-instagram"
              ></v-text-field>
            </v-expansion-panel-text>
          </v-expansion-panel>

        </v-expansion-panels>
      </div>

      <!-- ПРАВАЯ ЧАСТЬ: ПРЕДПРОСМОТР -->
      <div class="flex-grow-1 d-flex flex-column align-center justify-center bg-grey-lighten-3 pa-8 overflow-hidden relative">

        <!-- Панель управления видом -->
        <v-sheet
          elevation="2"
          rounded="pill"
          height="48"
          class="d-flex align-center px-2 mb-4"
          style="position: absolute; top: 16px; z-index: 10;"
        >
          <v-btn variant="text" size="small" icon="mdi-monitor" :color="viewMode === 'desktop' ? 'black' : 'grey'" @click="viewMode = 'desktop'"></v-btn>
          <v-btn variant="text" size="small" icon="mdi-cellphone" :color="viewMode === 'mobile' ? 'black' : 'grey'" @click="viewMode = 'mobile'"></v-btn>
          <v-divider vertical class="mx-2 my-2"></v-divider>
          <v-btn variant="text" size="small" icon="mdi-refresh" color="grey-darken-2" @click="refreshPreview"></v-btn>
          <v-divider vertical class="mx-2 my-2"></v-divider>
          <v-btn variant="text" size="small" icon="mdi-open-in-new" color="grey-darken-2" href="/shop/preview" target="_blank"></v-btn>
        </v-sheet>

        <!-- Рамка устройства -->
        <div
          class="preview-container bg-white elevation-5 transition-all"
          :class="viewMode === 'mobile' ? 'mobile-view rounded-xl' : 'desktop-view rounded-lg'"
        >
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
import { ref, defineComponent, h } from 'vue'
import MainLayout from '@/layouts/MainLayout.vue'
import { useShopStore } from '@/stores/shop'

const shopStore = useShopStore()
const saving = ref(false)
const viewMode = ref('desktop')
const openedPanels = ref(['general', 'colors', 'hero'])
const previewFrame = ref<HTMLIFrameElement | null>(null)

// Сохранение
const saveChanges = () => {
  saving.value = true
  shopStore.saveSettings()
  setTimeout(() => {
    saving.value = false
  }, 600)
}

// Обновить превью
const refreshPreview = () => {
  if (previewFrame.value) {
    previewFrame.value.src = previewFrame.value.src
  }
}

// Компонент выбора цвета
const ColorPicker = defineComponent({
  props: {
    modelValue: { type: String, default: '#000000' }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () => h('div', { class: 'd-flex align-center border rounded pa-2 cursor-pointer' }, [
      h('input', {
        type: 'color',
        value: props.modelValue,
        onInput: (e: Event) => emit('update:modelValue', (e.target as HTMLInputElement).value),
        style: 'width: 32px; height: 32px; border: none; cursor: pointer; border-radius: 4px;'
      }),
      h('span', { class: 'text-body-2 ml-3' }, props.modelValue.toUpperCase())
    ])
  }
})
</script>

<style scoped>
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
  width: 375px;
  height: 100%;
  max-height: 812px;
  border: 8px solid #333;
}
</style>
