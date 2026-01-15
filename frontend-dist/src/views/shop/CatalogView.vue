<template>
  <ShopLayout>
    <v-container class="py-8 mw-1200">
      <!-- Заголовок -->
      <div class="d-flex justify-space-between align-center mb-8">
        <div>
          <h1 
            class="text-h4 font-weight-bold"
            :style="{ color: settings.textColor }"
          >
            Каталог
          </h1>
          <p class="text-body-2 mt-1" :style="{ color: settings.textColor, opacity: 0.7 }">
            {{ filteredProducts.length }} товаров
          </p>
        </div>

        <!-- Сортировка -->
        <v-select
          v-model="sortBy"
          :items="sortOptions"
          item-title="title"
          item-value="value"
          variant="outlined"
          density="compact"
          hide-details
          style="max-width: 200px;"
        ></v-select>
      </div>

      <v-row>
        <!-- Сайдбар с фильтрами -->
        <v-col cols="12" md="3">
          <v-card class="rounded-xl pa-4" flat :color="isDark ? 'grey-darken-4' : 'grey-lighten-5'">
            <h3 class="text-body-1 font-weight-bold mb-4" :style="{ color: settings.textColor }">Фильтры</h3>

            <!-- Поиск -->
            <v-text-field
              v-model="searchQuery"
              placeholder="Поиск..."
              variant="outlined"
              density="compact"
              hide-details
              prepend-inner-icon="mdi-magnify"
              class="mb-4"
            ></v-text-field>

            <!-- Цена -->
            <div class="mb-4">
              <label class="text-caption font-weight-bold mb-2 d-block" :style="{ color: settings.textColor }">
                Цена
              </label>
              <div class="d-flex gap-2">
                <v-text-field
                  v-model.number="priceFrom"
                  placeholder="От"
                  type="number"
                  variant="outlined"
                  density="compact"
                  hide-details
                ></v-text-field>
                <v-text-field
                  v-model.number="priceTo"
                  placeholder="До"
                  type="number"
                  variant="outlined"
                  density="compact"
                  hide-details
                ></v-text-field>
              </div>
            </div>



            <v-btn
              block
              variant="text"
              class="text-none mt-4"
              @click="resetFilters"
            >
              Сбросить фильтры
            </v-btn>
          </v-card>
        </v-col>

        <!-- Сетка товаров -->
        <v-col cols="12" md="9">
          <!-- Загрузка -->
          <div v-if="loading" class="d-flex justify-center py-16">
            <v-progress-circular indeterminate :color="settings.primaryColor" size="48"></v-progress-circular>
          </div>

          <!-- Пустой результат -->
          <v-card 
            v-else-if="filteredProducts.length === 0" 
            class="rounded-xl pa-12 text-center" 
            flat 
            :color="isDark ? 'grey-darken-4' : 'grey-lighten-5'"
          >
            <v-icon icon="mdi-magnify-close" size="64" color="grey" class="mb-4"></v-icon>
            <h3 class="text-h6 font-weight-bold mb-2" :style="{ color: settings.textColor }">
              Ничего не найдено
            </h3>
            <p class="text-body-2" :style="{ color: settings.textColor, opacity: 0.7 }">
              Попробуйте изменить параметры поиска
            </p>
          </v-card>

          <!-- Товары -->
          <v-row v-else>
            <v-col
              v-for="product in filteredProducts"
              :key="product.id"
              :cols="gridCols.cols"
              :sm="gridCols.sm"
              :lg="gridCols.lg"
            >
              <!-- GRID VIEW CARD -->
              <v-card 
                v-if="settings.cardLayout !== 'list-view'"
                class="rounded-xl product-card h-100 d-flex flex-column" 
                flat
              >
                <!-- Изображение -->
                <router-link :to="`/shop/product/${product.id}`" class="text-decoration-none">
                  <v-sheet
                    :color="isDark ? 'grey-darken-3' : 'grey-lighten-4'"
                    :height="settings.cardLayout === 'grid-compact' ? 180 : 220"
                    class="rounded-xl d-flex align-center justify-center position-relative"
                  >
                    <v-img 
                      v-if="product.images && product.images.length > 0" 
                      :src="product.images[0]" 
                      :height="settings.cardLayout === 'grid-compact' ? 180 : 220" 
                      cover 
                      class="rounded-xl"
                    ></v-img>
                    <v-icon v-else size="64" :color="isDark ? 'grey-darken-1' : 'grey-lighten-2'">
                      mdi-tshirt-crew-outline
                    </v-icon>

                    <!-- Скидка -->
                    <v-chip
                      v-if="product.compareAtPrice && product.compareAtPrice > product.price"
                      color="red"
                      size="small"
                      class="position-absolute"
                      style="top: 8px; right: 8px;"
                    >
                      -{{ Math.round((1 - product.price / product.compareAtPrice) * 100) }}%
                    </v-chip>
                  </v-sheet>
                </router-link>

                <v-card-text class="flex-grow-1 pa-4">
                  <router-link :to="`/shop/product/${product.id}`" class="text-decoration-none">
                    <h3 
                      class="text-body-1 font-weight-bold mb-2"
                      :style="{ color: settings.textColor }"
                    >
                      {{ product.name }}
                    </h3>
                  </router-link>
                  <div class="d-flex align-center">
                    <span 
                      class="text-h6 font-weight-bold"
                      :style="{ color: settings.primaryColor }"
                    >
                      {{ formatPrice(product.price) }}
                    </span>
                    <span
                      v-if="product.compareAtPrice && product.compareAtPrice > product.price"
                      class="text-body-2 text-decoration-line-through text-grey ml-2"
                    >
                      {{ formatPrice(product.compareAtPrice) }}
                    </span>
                  </div>
                </v-card-text>

                <v-card-actions class="pa-4 pt-0">
                  <v-btn
                    block
                    :color="settings.primaryColor"
                    variant="flat"
                    class="text-white text-none font-weight-bold"
                    rounded="lg"
                    :disabled="product.status !== 'active'"
                    @click="addToCart(product)"
                  >
                    <v-icon icon="mdi-cart-plus" class="mr-2"></v-icon>
                    В корзину
                  </v-btn>
                </v-card-actions>
              </v-card>

              <!-- LIST VIEW CARD -->
              <v-card 
                v-else
                class="rounded-xl product-card w-100 d-flex flex-row align-center" 
                flat
                style="height: 160px;"
              >
                  <!-- Картинка слева -->
                  <router-link :to="`/shop/product/${product.id}`" class="text-decoration-none h-100">
                      <v-sheet
                        :color="isDark ? 'grey-darken-3' : 'grey-lighten-4'"
                        height="100%"
                        width="160"
                        class="rounded-l-xl d-flex align-center justify-center position-relative"
                      >
                         <v-img 
                            v-if="product.images && product.images.length > 0" 
                            :src="product.images[0]" 
                            height="100%" 
                            cover 
                            class="rounded-l-xl"
                          ></v-img>
                         <v-icon v-else size="48" :color="isDark ? 'grey-darken-1' : 'grey-lighten-2'">
                            mdi-tshirt-crew-outline
                         </v-icon>
                      </v-sheet>
                  </router-link>

                  <div class="d-flex flex-column flex-grow-1 px-6 py-4 h-100 justify-center">
                      <router-link :to="`/shop/product/${product.id}`" class="text-decoration-none">
                        <h3 
                          class="text-h6 font-weight-bold mb-2"
                          :style="{ color: settings.textColor }"
                        >
                          {{ product.name }}
                        </h3>
                      </router-link>
                      <p class="text-body-2 text-grey mb-4 text-truncate" style="max-width: 400px;">
                          {{ product.description || 'Описание отсутствует' }}
                      </p>
                      
                       <div class="d-flex align-center">
                        <span 
                          class="text-h6 font-weight-bold"
                          :style="{ color: settings.primaryColor }"
                        >
                          {{ formatPrice(product.price) }}
                        </span>
                         <span
                          v-if="product.compareAtPrice && product.compareAtPrice > product.price"
                          class="text-body-2 text-decoration-line-through text-grey ml-2"
                        >
                          {{ formatPrice(product.compareAtPrice) }}
                        </span>
                      </div>
                  </div>

                   <div class="pa-4 d-flex align-center h-100">
                      <v-btn
                        :color="settings.primaryColor"
                        variant="flat"
                        class="text-white text-none font-weight-bold"
                        rounded="lg"
                        height="48"
                        width="160"
                        :disabled="product.status !== 'active'"
                        @click="addToCart(product)"
                      >
                        <v-icon icon="mdi-cart-plus" class="mr-2"></v-icon>
                        В корзину
                      </v-btn>
                   </div>
              </v-card>

            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </ShopLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import ShopLayout from '@/layouts/ShopLayout.vue'
import { useShopStore } from '@/stores/shop'
import { useProductsStore, type Product } from '@/stores/products'
import { useCartStore } from '@/stores/cart'

const shopStore = useShopStore()
const productsStore = useProductsStore()
const cartStore = useCartStore()

const settings = computed(() => shopStore.settings)
const isDark = computed(() => shopStore.isDarkTheme)

const loading = ref(true)

// Фильтры
const searchQuery = ref('')
const priceFrom = ref<number | null>(null)
const priceTo = ref<number | null>(null)
const sortBy = ref('default')

const sortOptions = [
  { title: 'По умолчанию', value: 'default' },
  { title: 'Сначала дешёвые', value: 'price_asc' },
  { title: 'Сначала дорогие', value: 'price_desc' },
  { title: 'По названию', value: 'name' },
]

// Вычисление размеров сетки
const gridCols = computed(() => {
    switch (settings.value.cardLayout) {
        case 'grid-compact':
            return { cols: 6, sm: 4, lg: 3 }
        case 'list-view':
            return { cols: 12, sm: 12, lg: 12 }
        default: // grid-standard
            return { cols: 12, sm: 6, lg: 4 }
    }
})

// Загрузка
onMounted(() => {
  loading.value = true
  // Товары уже загружены в productsStore из конфига
  loading.value = false
})

// Фильтрация и сортировка
const filteredProducts = computed(() => {
  let result = [...productsStore.products]

  // Поиск
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(p => 
      p.name.toLowerCase().includes(query) ||
      p.description?.toLowerCase().includes(query)
    )
  }

  // Цена от
  if (priceFrom.value) {
    result = result.filter(p => p.price >= priceFrom.value!)
  }

  // Цена до
  if (priceTo.value) {
    result = result.filter(p => p.price <= priceTo.value!)
  }



  // Сортировка
  switch (sortBy.value) {
    case 'price_asc':
      result.sort((a, b) => a.price - b.price)
      break
    case 'price_desc':
      result.sort((a, b) => b.price - a.price)
      break
    case 'name':
      result.sort((a, b) => a.name.localeCompare(b.name))
      break
  }

  return result
})

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('ru-RU').format(price) + ' ₽'
}

const addToCart = (product: Product) => {
  cartStore.addItem({
    id: product.id,
    name: product.name,
    price: product.price,
    image: product.images?.[0]
  })
}

const resetFilters = () => {
  searchQuery.value = ''
  priceTo.value = null
  sortBy.value = 'default'
}
</script>

<style scoped>
.mw-1200 {
  max-width: 1200px;
  margin: 0 auto;
}

.product-card {
  transition: transform 0.2s ease;
}

.product-card:hover {
  transform: translateY(-4px);
}

.position-relative {
  position: relative;
}

.position-absolute {
  position: absolute;
}
</style>
