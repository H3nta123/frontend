<template>
  <div class="store-preview-container rounded-lg overflow-hidden border shadow-sm" :style="{ backgroundColor: backgroundColor }">
    <!-- Browser Mock Header -->
    <div class="browser-header bg-grey-lighten-3 px-3 py-2 d-flex align-center border-b">
        <div class="d-flex gap-1 mr-4">
            <div class="rounded-circle bg-red-lighten-2" style="width: 8px; height: 8px;"></div>
            <div class="rounded-circle bg-orange-lighten-2" style="width: 8px; height: 8px;"></div>
            <div class="rounded-circle bg-green-lighten-2" style="width: 8px; height: 8px;"></div>
        </div>
        <div class="flex-grow-1 bg-white rounded px-2 py-0 text-caption text-grey text-center text-truncate" style="font-size: 10px; height: 18px; line-height: 18px;">
            {{ subdomain }}.localhost
        </div>
    </div>

    <!-- Store Content Mock -->
    <div class="store-content" :style="{ color: textColor }">
        <!-- Navbar -->
        <div class="preview-navbar px-4 py-3 d-flex align-center justify-space-between" :style="{ backgroundColor: primaryColor, color: '#FFFFFF' }">
            <div class="font-weight-bold">{{ name || 'My Store' }}</div>
            <v-icon icon="mdi-cart-outline" size="small" color="white"></v-icon>
        </div>

        <!-- Hero/Banner Area -->
        <div class="pa-4 text-center border-b" :style="{ borderColor: borderColor }">
            <div class="text-h6 font-weight-bold mb-1">Welcome</div>
            <p class="text-caption opacity-70">Best products for you</p>
        </div>

        <!-- Product Grid Mock -->
        <div class="pa-4">
            <div class="d-flex gap-3 overflow-hidden">
                <!-- Mock Product 1 -->
                <div class="rounded border pa-2 mb-2" style="width: 120px;" :style="{ borderColor: borderColor, backgroundColor: cardBg }">
                    <div class="bg-grey-lighten-2 rounded mb-2" style="height: 80px;"></div>
                    <div class="text-caption font-weight-bold mb-1" style="line-height: 1.2;">Cool Item</div>
                    <div class="text-caption mb-2">999 ₽</div>
                    <div class="rounded text-center text-white py-1" :style="{ backgroundColor: secondaryColor, fontSize: '10px' }">
                        Buy
                    </div>
                </div>
                <!-- Mock Product 2 -->
                 <div class="rounded border pa-2 mb-2" style="width: 120px;" :style="{ borderColor: borderColor, backgroundColor: cardBg }">
                    <div class="bg-grey-lighten-2 rounded mb-2" style="height: 80px;"></div>
                    <div class="text-caption font-weight-bold mb-1" style="line-height: 1.2;">Nice thing</div>
                    <div class="text-caption mb-2">1500 ₽</div>
                    <div class="rounded text-center text-white py-1" :style="{ backgroundColor: secondaryColor, fontSize: '10px' }">
                        Buy
                    </div>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
    name: string
    subdomain: string
    primaryColor: string
    secondaryColor: string
    backgroundColor: string
    textColor: string
}>()

const borderColor = computed(() => {
    return props.textColor === '#FFFFFF' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'
})

const cardBg = computed(() => {
    return props.backgroundColor === '#FFFFFF' ? '#F5F5F5' : 
           props.backgroundColor === '#121212' ? '#1E1E1E' : '#FFFFFF'
})
</script>

<style scoped>
.store-preview-container {
    width: 100%;
    /* Aspect ratio for mobile/tablet feel */
    aspect-ratio: 9/16; 
    max-height: 500px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
}
.store-content {
    flex-grow: 1;
    overflow-y: auto;
}
</style>
