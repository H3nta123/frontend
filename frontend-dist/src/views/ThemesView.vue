<template>
  <MainLayout>
    <!-- Заголовок -->
    <div class="d-flex justify-space-between align-center mb-8">
      <div>
        <h1 class="text-h5 font-weight-bold text-black">Шаблоны магазина</h1>
        <p class="text-body-2 text-grey-darken-1 mt-1">Выберите готовый дизайн для вашего магазина</p>
      </div>
    </div>

    <!-- Фильтры -->
    <div class="d-flex gap-2 mb-6">
      <v-chip
        v-for="filter in filters"
        :key="filter.value"
        :color="activeFilter === filter.value ? '#4527A0' : 'grey-lighten-3'"
        :class="activeFilter === filter.value ? 'text-white' : 'text-grey-darken-2'"
        class="font-weight-bold"
        @click="activeFilter = filter.value"
      >
        {{ filter.label }}
      </v-chip>
    </div>

    <!-- Текущая тема -->
    <v-alert color="deep-purple-lighten-5" border="start" border-color="#4527A0" class="mb-6">
      <div class="d-flex align-center">
        <v-icon icon="mdi-palette" color="#4527A0" class="mr-3"></v-icon>
        <div>
          <span class="font-weight-bold">Текущий шаблон:</span> {{ shopStore.currentTheme.name }}
        </div>
        <v-spacer></v-spacer>
        <v-btn
          variant="flat"
          color="#4527A0"
          class="text-white text-none font-weight-bold"
          rounded="lg"
          to="/builder"
        >
          Редактировать
        </v-btn>
      </div>
    </v-alert>

    <!-- Сетка шаблонов -->
    <v-row>
      <v-col
        v-for="theme in filteredThemes"
        :key="theme.id"
        cols="12"
        sm="6"
        lg="4"
      >
        <v-card
          class="rounded-xl h-100 template-card"
          :class="{ 'selected': shopStore.currentThemeId === theme.id }"
          flat
        >
          <!-- Превью -->
          <div
            class="template-preview d-flex flex-column"
            :style="getPreviewStyles(theme)"
          >
            <!-- Мини-хедер -->
            <div class="preview-header d-flex align-center px-4 py-2" :style="{ backgroundColor: theme.settings.primaryColor }">
              <div class="preview-logo"></div>
              <v-spacer></v-spacer>
              <div class="preview-nav d-flex gap-2">
                <div class="preview-nav-item"></div>
                <div class="preview-nav-item"></div>
                <div class="preview-nav-item"></div>
              </div>
            </div>
            
            <!-- Hero секция -->
            <div class="flex-grow-1 d-flex flex-column align-center justify-center text-center px-4">
              <div class="preview-title" :style="{ color: theme.settings.textColor }">
                {{ theme.settings.heroTitle }}
              </div>
              <div class="preview-subtitle" :style="{ color: theme.settings.textColor, opacity: 0.7 }">
                {{ theme.settings.heroSubtitle }}
              </div>
              <div
                class="preview-button mt-3"
                :style="{ backgroundColor: theme.settings.primaryColor }"
              ></div>
            </div>

            <!-- Мини-товары -->
            <div class="preview-products d-flex justify-center gap-2 px-4 pb-3">
              <div class="preview-product" v-for="n in 3" :key="n"></div>
            </div>

            <!-- Бейдж выбрано -->
            <v-chip
              v-if="shopStore.currentThemeId === theme.id"
              color="green"
              size="small"
              class="selected-badge"
              prepend-icon="mdi-check"
            >
              Активен
            </v-chip>
          </div>

          <!-- Информация -->
          <v-card-text class="pa-5">
            <div class="d-flex align-center mb-2">
              <h3 class="text-body-1 font-weight-bold">{{ theme.name }}</h3>
              <v-chip
                size="x-small"
                :color="getCategoryColor(theme.category)"
                class="ml-2"
                label
              >
                {{ getCategoryLabel(theme.category) }}
              </v-chip>
            </div>
            <p class="text-body-2 text-grey-darken-1 mb-4">{{ theme.description }}</p>

            <div class="d-flex gap-2">
              <v-btn
                v-if="shopStore.currentThemeId !== theme.id"
                variant="flat"
                color="#4527A0"
                class="flex-grow-1 text-white text-none font-weight-bold"
                rounded="lg"
                @click="selectTheme(theme.id)"
              >
                Выбрать
              </v-btn>
              <v-btn
                v-else
                variant="flat"
                color="grey-lighten-3"
                class="flex-grow-1 text-none font-weight-bold text-grey-darken-2"
                rounded="lg"
                to="/builder"
              >
                Настроить
              </v-btn>
              <v-btn
                variant="outlined"
                color="grey"
                class="text-none"
                rounded="lg"
                icon="mdi-eye-outline"
                @click="previewTheme(theme)"
              ></v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Диалог превью -->
    <v-dialog v-model="previewDialog" max-width="900">
      <v-card class="rounded-xl">
        <v-card-title class="d-flex align-center pa-4">
          <span class="text-h6 font-weight-bold">{{ previewingTheme?.name }}</span>
          <v-spacer></v-spacer>
          <v-btn icon="mdi-close" variant="text" @click="previewDialog = false"></v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pa-0" v-if="previewingTheme">
          <div
            class="theme-full-preview"
            :style="getPreviewStyles(previewingTheme)"
          >
            <!-- Hero -->
            <div class="hero-section d-flex flex-column align-center justify-center text-center pa-12" :style="{ minHeight: '300px' }">
              <h1 class="text-h4 font-weight-black mb-4" :style="{ color: previewingTheme.settings.textColor }">
                {{ previewingTheme.settings.heroTitle }}
              </h1>
              <p class="text-h6 mb-6" :style="{ color: previewingTheme.settings.textColor, opacity: 0.8 }">
                {{ previewingTheme.settings.heroSubtitle }}
              </p>
              <v-btn
                size="large"
                rounded="pill"
                :color="previewingTheme.settings.primaryColor"
                class="text-white text-none font-weight-bold px-8"
              >
                {{ previewingTheme.settings.heroButtonText }}
              </v-btn>
            </div>

            <!-- Товары -->
            <div class="products-section pa-8">
              <h2 class="text-h5 font-weight-bold text-center mb-6" :style="{ color: previewingTheme.settings.textColor }">
                Популярные товары
              </h2>
              <div class="d-flex justify-center gap-4 flex-wrap">
                <v-card v-for="n in 3" :key="n" width="180" class="rounded-lg" flat>
                  <v-sheet color="grey-lighten-3" height="140" class="d-flex align-center justify-center rounded-lg mb-3">
                    <v-icon size="40" color="grey-lighten-1">mdi-tshirt-crew-outline</v-icon>
                  </v-sheet>
                  <div class="px-2 pb-2">
                    <div class="font-weight-bold text-body-2">Товар {{ n }}</div>
                    <div class="text-body-2 text-grey">{{ (n * 1500) }} ₽</div>
                  </div>
                </v-card>
              </div>
            </div>
          </div>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn variant="text" class="text-none" @click="previewDialog = false">Закрыть</v-btn>
          <v-btn
            color="#4527A0"
            variant="flat"
            class="text-white text-none font-weight-bold"
            rounded="lg"
            @click="selectTheme(previewingTheme!.id); previewDialog = false"
          >
            Выбрать этот шаблон
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </MainLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import { useShopStore, THEME_TEMPLATES, type ShopTheme } from '@/stores/shop'

const router = useRouter()
const shopStore = useShopStore()

const activeFilter = ref('all')
const previewDialog = ref(false)
const previewingTheme = ref<ShopTheme | null>(null)

const filters = [
  { label: 'Все шаблоны', value: 'all' },
  { label: 'Минимализм', value: 'minimal' },
  { label: 'Современные', value: 'modern' },
  { label: 'Классика', value: 'classic' },
  { label: 'Тёмные', value: 'dark' },
]

const filteredThemes = computed(() => {
  if (activeFilter.value === 'all') return THEME_TEMPLATES
  return THEME_TEMPLATES.filter(t => t.category === activeFilter.value)
})

const getPreviewStyles = (theme: ShopTheme) => ({
  backgroundColor: theme.settings.backgroundColor,
})

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'minimal': return 'grey'
    case 'modern': return 'purple'
    case 'classic': return 'blue'
    case 'dark': return 'black'
    default: return 'grey'
  }
}

const getCategoryLabel = (category: string) => {
  switch (category) {
    case 'minimal': return 'Минимализм'
    case 'modern': return 'Модерн'
    case 'classic': return 'Классика'
    case 'dark': return 'Тёмная'
    default: return category
  }
}

const selectTheme = (themeId: string) => {
  shopStore.applyTheme(themeId)
  router.push('/builder')
}

const previewTheme = (theme: ShopTheme) => {
  previewingTheme.value = theme
  previewDialog.value = true
}
</script>

<style scoped>
.template-card {
  border: 2px solid transparent;
  transition: all 0.2s ease;
}

.template-card:hover {
  border-color: #E0E0E0;
  transform: translateY(-4px);
}

.template-card.selected {
  border-color: #4527A0;
}

.template-preview {
  height: 240px;
  position: relative;
  border-radius: 12px 12px 0 0;
  overflow: hidden;
}

.preview-header {
  height: 32px;
}

.preview-logo {
  width: 40px;
  height: 16px;
  background: rgba(255,255,255,0.3);
  border-radius: 4px;
}

.preview-nav-item {
  width: 30px;
  height: 8px;
  background: rgba(255,255,255,0.4);
  border-radius: 4px;
}

.preview-title {
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 4px;
}

.preview-subtitle {
  font-size: 10px;
  max-width: 200px;
}

.preview-button {
  width: 60px;
  height: 20px;
  border-radius: 10px;
}

.preview-product {
  width: 50px;
  height: 50px;
  background: rgba(128,128,128,0.2);
  border-radius: 8px;
}

.selected-badge {
  position: absolute;
  top: 44px;
  right: 8px;
}

.theme-full-preview {
  min-height: 500px;
}
</style>
