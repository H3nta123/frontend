<template>
  <component :is="layoutComponent">
    <v-app v-if="isIframe" class="bg-white">
      <v-main>
        <div class="pa-4">
          <ProductForm />
        </div>
      </v-main>
    </v-app>
    <ProductForm v-else />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import BaseLayout from '@/layouts/MainLayout.vue'
import ProductForm from '@/components/ProductForm.vue'

const route = useRoute()

const isIframe = computed(() => route.query.iframe === 'true')
const layoutComponent = computed(() => isIframe.value ? 'div' : BaseLayout)
</script>
