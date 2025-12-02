import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useShopStore = defineStore('shop', () => {

  // Пытаемся загрузить настройки из LocalStorage, если они там есть
  const savedSettings = localStorage.getItem('shop_settings');
  const defaultSettings = {
    name: 'Мой Крутой Магазин',
    logoUrl: '',
    primaryColor: '#4527A0',
    backgroundColor: '#FFFFFF',
    heroTitle: 'Новая коллекция',
    heroSubtitle: 'Лучшие товары этого сезона уже в продаже',
    heroImage: ''
  };

  const settings = ref(savedSettings ? JSON.parse(savedSettings) : defaultSettings)

  // Список товаров
  const products = ref([
    { id: 1, name: 'Футболка Oversize', price: 2500 },
    { id: 2, name: 'Кепка Brand', price: 1200 },
    { id: 3, name: 'Худи Streetwear', price: 4500 }
  ])

  // Действия
  const updateSettings = (newSettings: any) => {
    settings.value = { ...settings.value, ...newSettings }
  }

  // === МАГИЯ: Авто-сохранение при изменениях ===
  watch(settings, (newVal) => {
    localStorage.setItem('shop_settings', JSON.stringify(newVal));
  }, { deep: true });

  // === МАГИЯ 2: Слушаем изменения из других вкладок/iframe ===
  window.addEventListener('storage', (event) => {
    if (event.key === 'shop_settings' && event.newValue) {
      settings.value = JSON.parse(event.newValue);
    }
  });

  return {
    settings,
    products,
    updateSettings
  }
})
