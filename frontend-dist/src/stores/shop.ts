import { defineStore } from 'pinia'
import { ref, watch, computed } from 'vue'

// Интерфейс темы/шаблона
export interface ShopTheme {
  id: string
  name: string
  description: string
  preview: string // URL превью или base64
  category: 'minimal' | 'modern' | 'classic' | 'dark'
  settings: ShopSettings
}

// Настройки магазина
export interface ShopSettings {
  // Общие
  name: string
  logoUrl: string

  // Цвета
  primaryColor: string
  secondaryColor: string
  backgroundColor: string
  textColor: string

  // Hero баннер
  heroTitle: string
  heroSubtitle: string
  heroImage: string
  heroButtonText: string
  heroStyle: 'centered' | 'left' | 'right'
  heroOverlay: boolean

  // Шрифты
  fontFamily: string

  // Секции
  showProductsSection: boolean
  productsTitle: string
  showAboutSection: boolean
  aboutText: string

  // Футер
  footerText: string
  socialLinks: {
    telegram?: string
    instagram?: string
    vk?: string
  }
}

// Дефолтные настройки
const DEFAULT_SETTINGS: ShopSettings = {
  name: 'Мой Магазин',
  logoUrl: '',
  primaryColor: '#4527A0',
  secondaryColor: '#7C4DFF',
  backgroundColor: '#FFFFFF',
  textColor: '#212121',
  heroTitle: 'Добро пожаловать в наш магазин',
  heroSubtitle: 'Лучшие товары по лучшим ценам',
  heroImage: '',
  heroButtonText: 'Смотреть каталог',
  heroStyle: 'centered',
  heroOverlay: false,
  fontFamily: "'Inter', sans-serif",
  showProductsSection: true,
  productsTitle: 'Популярные товары',
  showAboutSection: false,
  aboutText: '',
  footerText: '© 2024 Все права защищены',
  socialLinks: {}
}

// Готовые шаблоны
export const THEME_TEMPLATES: ShopTheme[] = [
  {
    id: 'minimal-light',
    name: 'Минимализм',
    description: 'Чистый светлый дизайн с акцентом на товары',
    preview: '',
    category: 'minimal',
    settings: {
      ...DEFAULT_SETTINGS,
      primaryColor: '#000000',
      secondaryColor: '#666666',
      backgroundColor: '#FFFFFF',
      textColor: '#212121',
      heroTitle: 'Новая коллекция',
      heroSubtitle: 'Откройте для себя стильные новинки сезона',
      heroButtonText: 'Смотреть',
      heroStyle: 'centered',
    }
  },
  {
    id: 'modern-purple',
    name: 'Модерн',
    description: 'Современный фиолетовый стиль с градиентами',
    preview: '',
    category: 'modern',
    settings: {
      ...DEFAULT_SETTINGS,
      primaryColor: '#7C4DFF',
      secondaryColor: '#E040FB',
      backgroundColor: '#FAFAFA',
      textColor: '#212121',
      heroTitle: 'Будь в тренде',
      heroSubtitle: 'Эксклюзивные товары для тех, кто ценит стиль',
      heroButtonText: 'Исследовать',
      heroStyle: 'left',
    }
  },
  {
    id: 'dark-elegant',
    name: 'Тёмная элегантность',
    description: 'Премиальный тёмный дизайн для люксовых брендов',
    preview: '',
    category: 'dark',
    settings: {
      ...DEFAULT_SETTINGS,
      primaryColor: '#FFD700',
      secondaryColor: '#FFA500',
      backgroundColor: '#121212',
      textColor: '#FFFFFF',
      heroTitle: 'Эксклюзив',
      heroSubtitle: 'Премиальные товары для взыскательных клиентов',
      heroButtonText: 'Открыть каталог',
      heroStyle: 'centered',
      heroOverlay: true,
    }
  },
  {
    id: 'classic-blue',
    name: 'Классика',
    description: 'Классический синий дизайн, вызывающий доверие',
    preview: '',
    category: 'classic',
    settings: {
      ...DEFAULT_SETTINGS,
      primaryColor: '#1976D2',
      secondaryColor: '#42A5F5',
      backgroundColor: '#FFFFFF',
      textColor: '#37474F',
      heroTitle: 'Качество и надёжность',
      heroSubtitle: 'Проверенные товары с гарантией качества',
      heroButtonText: 'В каталог',
      heroStyle: 'right',
    }
  },
  {
    id: 'eco-green',
    name: 'Эко-стиль',
    description: 'Природные оттенки для экологичных брендов',
    preview: '',
    category: 'modern',
    settings: {
      ...DEFAULT_SETTINGS,
      primaryColor: '#4CAF50',
      secondaryColor: '#8BC34A',
      backgroundColor: '#F1F8E9',
      textColor: '#33691E',
      heroTitle: 'Товары от природы',
      heroSubtitle: 'Экологически чистые продукты для вашего дома',
      heroButtonText: 'Выбрать',
      heroStyle: 'centered',
    }
  },
  {
    id: 'coral-fresh',
    name: 'Свежий коралл',
    description: 'Яркий и свежий стиль для молодежных брендов',
    preview: '',
    category: 'modern',
    settings: {
      ...DEFAULT_SETTINGS,
      primaryColor: '#FF6B6B',
      secondaryColor: '#FFA726',
      backgroundColor: '#FFFBF5',
      textColor: '#2D3436',
      heroTitle: 'Стиль без границ',
      heroSubtitle: 'Яркие вещи для ярких людей',
      heroButtonText: 'Вперёд!',
      heroStyle: 'left',
    }
  },
]

export const useShopStore = defineStore('shop', () => {
  // Загрузка из localStorage
  const savedSettings = localStorage.getItem('shop_settings')
  const savedThemeId = localStorage.getItem('shop_theme_id')

  // Текущий выбранный шаблон
  const currentThemeId = ref(savedThemeId || 'minimal-light')

  // Настройки магазина
  const settings = ref<ShopSettings>(
    savedSettings ? JSON.parse(savedSettings) : { ...DEFAULT_SETTINGS }
  )

  // Моковые товары магазина
  const products = ref([
    { id: 1, name: 'Футболка Oversize', price: 2500, image: '' },
    { id: 2, name: 'Кепка Brand', price: 1200, image: '' },
    { id: 3, name: 'Худи Streetwear', price: 4500, image: '' },
    { id: 4, name: 'Джинсы Regular', price: 3800, image: '' },
    { id: 5, name: 'Кроссовки Classic', price: 7200, image: '' },
    { id: 6, name: 'Сумка Urban', price: 2900, image: '' },
  ])

  // Является ли тема тёмной
  const isDarkTheme = computed(() => {
    const bg = settings.value.backgroundColor.toLowerCase()
    // Простая проверка: если фон тёмный
    return bg === '#121212' || bg === '#000000' || bg === '#1a1a1a'
  })

  // Получить текущую тему
  const currentTheme = computed(() => {
    return THEME_TEMPLATES.find(t => t.id === currentThemeId.value) || THEME_TEMPLATES[0]
  })

  // Применить шаблон
  const applyTheme = (themeId: string) => {
    const theme = THEME_TEMPLATES.find(t => t.id === themeId)
    if (theme) {
      currentThemeId.value = themeId
      settings.value = { ...theme.settings }
      localStorage.setItem('shop_theme_id', themeId)
    }
  }

  // Обновить настройки
  const updateSettings = (newSettings: Partial<ShopSettings>) => {
    settings.value = { ...settings.value, ...newSettings }
  }

  // Сохранить все настройки
  const saveSettings = () => {
    localStorage.setItem('shop_settings', JSON.stringify(settings.value))
    localStorage.setItem('shop_theme_id', currentThemeId.value)
  }

  // Авто-сохранение при изменениях
  watch(settings, (newVal) => {
    localStorage.setItem('shop_settings', JSON.stringify(newVal))
  }, { deep: true })

  // Синхронизация между вкладками/iframe
  window.addEventListener('storage', (event) => {
    if (event.key === 'shop_settings' && event.newValue) {
      settings.value = JSON.parse(event.newValue)
    }
    if (event.key === 'shop_theme_id' && event.newValue) {
      currentThemeId.value = event.newValue
    }
  })

  return {
    // State
    settings,
    products,
    currentThemeId,
    // Computed
    isDarkTheme,
    currentTheme,
    // Actions
    applyTheme,
    updateSettings,
    saveSettings,
  }
})
