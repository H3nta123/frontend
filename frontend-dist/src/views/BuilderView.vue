<template>
  <MainLayout>
    <!-- Шапка конструктора -->
    <div class="d-flex justify-space-between align-center mb-4" style="height: 48px;">
      <div class="d-flex align-center">
        <v-btn icon="mdi-arrow-left" variant="text" to="/themes" class="mr-2"></v-btn>
        <h1 class="text-h6 font-weight-bold m-0">Редактор: {{ shopStore.currentTheme?.name }}</h1>
        <v-chip size="x-small" color="green" class="ml-3 font-weight-bold" label>Live</v-chip>
      </div>

      <div class="d-flex align-center gap-2">
        <v-btn
          variant="outlined"
          class="text-none font-weight-bold"
          rounded="lg"
          @click="openTemplatesDialog"
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
        <v-btn
          v-if="currentSiteId"
          color="blue"
          variant="flat"
          class="text-white text-none font-weight-bold px-6"
          rounded="lg"
          @click="publishSite"
          :loading="publishing"
        >
          Опубликовать
        </v-btn>
      </div>
    </div>

    <v-divider class="mb-0"></v-divider>

    <!-- Основная рабочая область -->
    <div class="d-flex h-100 bg-grey-lighten-4" style="margin: 0 -32px -32px -32px; height: calc(100vh - 112px);">

      <!-- ЛЕВАЯ ПАНЕЛЬ: НАСТРОЙКИ -->
      <div class="bg-white border-r d-flex flex-column" style="width: 340px; overflow-y: auto;">

        <v-expansion-panels flat variant="accordion" multiple v-model="openedPanels">

          <!-- Секция: Товары (Новое!) -->
          <v-expansion-panel value="products">
            <v-expansion-panel-title class="font-weight-bold">Товары</v-expansion-panel-title>
            <v-expansion-panel-text>
               <v-btn
                 block
                 color="#2A1A8E"
                 class="text-none text-white mb-4"
                 prepend-icon="mdi-plus"
                 @click="navigateToNewProduct"
               >
                 Добавить товар
               </v-btn>

               <div v-for="product in builderProducts" :key="product.id" @click="navigateToProduct(product.id)" class="d-flex align-center pa-2 border rounded mb-2 hover-bg cursor-pointer">
                 <v-avatar size="40" color="grey-lighten-2" rounded>
                   <v-icon icon="mdi-tshirt-crew" color="grey"></v-icon>
                 </v-avatar>
                 <div class="ml-3">
                   <div class="text-body-2 font-weight-bold text-truncate" style="max-width: 140px;">{{ product.name }}</div>
                   <div class="text-caption text-grey">{{ product.price }} ₽</div>
                 </div>
                 <v-spacer></v-spacer>
                 <v-btn icon variant="text" size="x-small" color="grey"><v-icon>mdi-pencil</v-icon></v-btn>
               </div>

               <v-btn variant="text" size="small" block class="text-none text-grey mt-2" @click="resetIframe">
                 Вернуться к просмотру сайта
               </v-btn>
            </v-expansion-panel-text>
          </v-expansion-panel>

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

              <label class="text-caption font-weight-bold text-grey-darken-1 mb-1 d-block">Поддомен (URL сайта)</label>
              <v-text-field
                v-model="shopStore.settings.subdomain"
                variant="outlined"
                density="compact"
                hide-details="auto"
                class="mb-4"
                suffix=".myshop.com"
                placeholder="example"
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

          <!-- Секция: Внешний вид каталога (Новое!) -->
          <v-expansion-panel value="catalog">
            <v-expansion-panel-title class="font-weight-bold">Каталог и Карточки</v-expansion-panel-title>
            <v-expansion-panel-text>
              <label class="text-caption font-weight-bold text-grey-darken-1 mb-1 d-block">Стиль карточек товара</label>
              <v-radio-group v-model="shopStore.settings.cardLayout" hide-details class="mb-2">
                <v-radio value="grid-standard" label="Стандартная сетка" density="compact"></v-radio>
                <v-radio value="grid-compact" label="Компактная сетка" density="compact"></v-radio>
                <v-radio value="list-view" label="Список (в строку)" density="compact"></v-radio>
              </v-radio-group>
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
            :src="iframeSrc"
            frameborder="0"
            class="w-100 h-100"
            ref="previewFrame"
          ></iframe>
        </div>

      </div>
    </div>

    <!-- Диалог выбора шаблона -->
    <v-dialog v-model="templatesDialog" max-width="1200" scrollable>
      <v-card class="rounded-xl h-100" style="max-height: 90vh;">
        <v-card-title class="d-flex align-center pa-4 text-h5 font-weight-bold">
          Выберите шаблон
          <v-spacer></v-spacer>
          <v-btn icon="mdi-close" variant="text" @click="templatesDialog = false"></v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pa-6 bg-grey-lighten-5">
           <!-- Фильтры -->
            <div class="d-flex gap-2 mb-6">
              <v-chip
                v-for="filter in filters"
                :key="filter.value"
                :color="activeFilter === filter.value ? '#4527A0' : 'grey-lighten-3'"
                :class="activeFilter === filter.value ? 'text-white' : 'text-grey-darken-2'"
                class="font-weight-bold cursor-pointer"
                @click="activeFilter = filter.value"
              >
                {{ filter.label }}
              </v-chip>
            </div>

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
                  class="rounded-xl h-100 template-card cursor-pointer"
                  :class="{ 'selected': shopStore.currentThemeId === theme.id }"
                  flat
                  @click="selectTheme(theme.id)"
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
                  <v-card-text class="pa-4">
                    <div class="d-flex align-center mb-1">
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
                    <p class="text-caption text-grey-darken-1">{{ theme.description }}</p>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>

  </MainLayout>
</template>

<script setup lang="ts">
import { ref, defineComponent, h, computed } from 'vue'
import MainLayout from '@/layouts/MainLayout.vue'
import { useShopStore, THEME_TEMPLATES, type ShopTheme } from '@/stores/shop'
import { sitesService } from '@/services/sites'

const shopStore = useShopStore()
const saving = ref(false)
const publishing = ref(false)
const currentSiteId = ref<string>('') // ID сохраненного сайта
const viewMode = ref('desktop')
const openedPanels = ref(['general', 'products']) // Start with products open by default for this task
const previewFrame = ref<HTMLIFrameElement | null>(null)
const iframeSrc = ref('/shop/preview')

// Templates Logic
const templatesDialog = ref(false)
const activeFilter = ref('all')

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

const openTemplatesDialog = () => {
  templatesDialog.value = true
}

const selectTheme = (themeId: string) => {
  shopStore.applyTheme(themeId)
  templatesDialog.value = false
  refreshPreview()
}

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

const getPreviewStyles = (theme: ShopTheme) => ({
  backgroundColor: theme.settings.backgroundColor,
})


// Mock Products for Builder Demo (In real app, fetch from store)
const builderProducts = ref([
 { id: 1, name: 'Футболка Basic', price: 1200, image: '' },
 { id: 2, name: 'Кепка Brand', price: 800, image: '' },
 { id: 3, name: 'Худи Oversize', price: 3500, image: '' },
])

const navigateToProduct = (id: number) => {
 iframeSrc.value = `/products/${id}?iframe=true`
}

const navigateToNewProduct = () => {
 iframeSrc.value = `/products/new?iframe=true`
}

const resetIframe = () => {
 iframeSrc.value = '/shop/preview'
}

// Сохранение
// Сохранение

  // Сохранение
  const saveChanges = async () => {
    saving.value = true
    try {

      const payload = {
        subdomain: shopStore.settings.subdomain?.toLowerCase().replace(/\s+/g, '-') || shopStore.settings.name.toLowerCase().replace(/\s+/g, '-') || 'myshop',
        pattern: shopStore.currentThemeId, // Mapping theme_id to pattern
        config: shopStore.settings
      }
      
      const response = await sitesService.saveSite(payload)
      if (response && response.id) {
        currentSiteId.value = response.id
        // Можно показать уведомление "Черновик сохранен"
      }
    } catch (e) {
      console.error(e)
      // Показать ошибку
    } finally {
      saving.value = false
    }
  }

  // Публикация
  const publishSite = async () => {
    if (!currentSiteId.value) return
    publishing.value = true
    try {
      await sitesService.publishSite(currentSiteId.value)
      // Уведомление об успехе
      alert('Сайт успешно опубликован!')
    } catch (e) {
      console.error(e)
      alert('Ошибка публикации')
    } finally {
      publishing.value = false
    }
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

/* Template Card Styles */
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
  height: 200px;
  position: relative;
  border-radius: 12px 12px 0 0;
  overflow: hidden;
}

.preview-header {
  height: 24px;
}

.preview-logo {
  width: 30px;
  height: 12px;
  background: rgba(255,255,255,0.3);
  border-radius: 4px;
}

.preview-nav-item {
  width: 20px;
  height: 6px;
  background: rgba(255,255,255,0.4);
  border-radius: 4px;
}

.preview-title {
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 4px;
}

.preview-subtitle {
  font-size: 8px;
  max-width: 160px;
}

.preview-button {
  width: 40px;
  height: 14px;
  border-radius: 10px;
}

.preview-product {
  width: 40px;
  height: 40px;
  background: rgba(128,128,128,0.2);
  border-radius: 8px;
}

.selected-badge {
  position: absolute;
  top: 10px;
  right: 10px;
}

</style>
