<template>
  <ShopLayout>
    <!-- Hero Баннер -->
    <v-sheet
      :height="heroHeight"
      class="hero-section d-flex px-4 py-12"
      :class="heroAlignClass"
      :style="heroStyles"
    >
      <!-- Overlay -->
      <div v-if="settings.heroOverlay && settings.heroImage" class="hero-overlay"></div>
      
      <div :style="{ maxWidth: '800px', position: 'relative', zIndex: 1 }" :class="heroTextAlignClass">
        <h1 
          class="hero-title font-weight-black mb-4"
          :style="{ color: settings.textColor }"
        >
          {{ settings.heroTitle }}
        </h1>
        <p 
          class="hero-subtitle font-weight-regular mb-8"
          :style="{ color: settings.textColor, opacity: 0.85 }"
        >
          {{ settings.heroSubtitle }}
        </p>
        <v-btn
          size="x-large"
          rounded="pill"
          elevation="0"
          class="text-white text-none font-weight-bold px-10"
          :color="settings.primaryColor"
        >
          {{ settings.heroButtonText }}
        </v-btn>
      </div>
    </v-sheet>

    <!-- Секция товаров -->
    <v-container v-if="settings.showProductsSection" class="py-16 mw-1200">
      <h2 
        class="text-h4 font-weight-bold text-center mb-12"
        :style="{ color: settings.textColor }"
      >
        {{ settings.productsTitle }}
      </h2>

      <v-row>
        <v-col
          v-for="product in shopStore.products"
          :key="product.id"
          cols="12"
          sm="6"
          md="4"
        >
          <v-card class="rounded-xl product-card" flat :to="`/shop/product/${product.id}`">
            <!-- Изображение товара -->
            <v-sheet
              :color="isDark ? 'grey-darken-3' : 'grey-lighten-4'"
              height="280"
              class="rounded-xl mb-4 d-flex align-center justify-center"
            >
              <v-img v-if="product.image" :src="product.image" height="280" cover class="rounded-xl"></v-img>
              <v-icon v-else size="64" :color="isDark ? 'grey-darken-1' : 'grey-lighten-2'">mdi-tshirt-crew-outline</v-icon>
            </v-sheet>

            <div class="px-2">
              <h3 
                class="text-h6 font-weight-bold mb-1"
                :style="{ color: settings.textColor }"
              >
                {{ product.name }}
              </h3>
              <div 
                class="text-body-1 font-weight-medium"
                :style="{ color: settings.primaryColor }"
              >
                {{ formatPrice(product.price) }}
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Секция О нас -->
    <v-sheet 
      v-if="settings.showAboutSection && settings.aboutText"
      :color="isDark ? 'grey-darken-4' : 'grey-lighten-4'"
      class="py-16"
    >
      <v-container class="mw-900 text-center">
        <h2 
          class="text-h4 font-weight-bold mb-6"
          :style="{ color: settings.textColor }"
        >
          О нас
        </h2>
        <p 
          class="text-h6 font-weight-regular"
          :style="{ color: settings.textColor, opacity: 0.8 }"
        >
          {{ settings.aboutText }}
        </p>
      </v-container>
    </v-sheet>

    <!-- Футер -->
    <v-sheet 
      :color="isDark ? '#000000' : settings.primaryColor"
      class="py-8"
    >
      <v-container class="mw-1200">
        <div class="d-flex flex-column flex-md-row align-center justify-space-between">
          <div class="text-body-2 text-white mb-4 mb-md-0">
            {{ settings.footerText }}
          </div>
          <div class="d-flex gap-3">
            <v-btn
              v-if="settings.socialLinks?.telegram"
              icon
              variant="text"
              color="white"
              size="small"
              :href="getSocialLink('telegram', settings.socialLinks.telegram)"
              target="_blank"
            >
              <v-icon>mdi-send</v-icon>
            </v-btn>
            <v-btn
              v-if="settings.socialLinks?.instagram"
              icon
              variant="text"
              color="white"
              size="small"
              :href="getSocialLink('instagram', settings.socialLinks.instagram)"
              target="_blank"
            >
              <v-icon>mdi-instagram</v-icon>
            </v-btn>
            <v-btn
              v-if="settings.socialLinks?.vk"
              icon
              variant="text"
              color="white"
              size="small"
              :href="getSocialLink('vk', settings.socialLinks.vk)"
              target="_blank"
            >
              <v-icon>mdi-alpha-v-box</v-icon>
            </v-btn>
          </div>
        </div>
      </v-container>
    </v-sheet>
  </ShopLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ShopLayout from '@/layouts/ShopLayout.vue'
import { useShopStore } from '@/stores/shop'

const shopStore = useShopStore()
const settings = computed(() => shopStore.settings)

const isDark = computed(() => shopStore.isDarkTheme)

const heroHeight = computed(() => settings.value.heroImage ? 600 : 500)

const heroStyles = computed(() => {
  const styles: Record<string, string> = {
    backgroundColor: settings.value.heroImage ? 'transparent' : (isDark.value ? '#1a1a1a' : '#f5f5f5'),
  }
  
  if (settings.value.heroImage) {
    styles.backgroundImage = `url(${settings.value.heroImage})`
    styles.backgroundSize = 'cover'
    styles.backgroundPosition = 'center'
  }
  
  return styles
})

const heroAlignClass = computed(() => {
  switch (settings.value.heroStyle) {
    case 'left': return 'align-center justify-start'
    case 'right': return 'align-center justify-end'
    default: return 'align-center justify-center text-center'
  }
})

const heroTextAlignClass = computed(() => {
  switch (settings.value.heroStyle) {
    case 'left': return 'text-left'
    case 'right': return 'text-right'
    default: return 'text-center'
  }
})

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('ru-RU').format(price) + ' ₽'
}

const getSocialLink = (platform: string, value: string) => {
  if (value.startsWith('http')) return value
  
  switch (platform) {
    case 'telegram':
      return value.startsWith('@') ? `https://t.me/${value.slice(1)}` : `https://t.me/${value}`
    case 'instagram':
      return value.startsWith('@') ? `https://instagram.com/${value.slice(1)}` : `https://instagram.com/${value}`
    case 'vk':
      return value.startsWith('@') ? `https://vk.com/${value.slice(1)}` : `https://vk.com/${value}`
    default:
      return value
  }
}
</script>

<style scoped>
.mw-1200 {
  max-width: 1200px;
  margin: 0 auto;
}

.mw-900 {
  max-width: 900px;
  margin: 0 auto;
}

.hero-section {
  position: relative;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 0;
}

.hero-title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  line-height: 1.1;
}

.hero-subtitle {
  font-size: clamp(1rem, 2vw, 1.5rem);
}

.product-card {
  transition: transform 0.2s ease;
}

.product-card:hover {
  transform: translateY(-4px);
}
</style>
