<template>
  <ShopLayout>
    <v-container class="py-8 mw-1200">
      <!-- Хлебные крошки -->
      <v-breadcrumbs :items="breadcrumbs" class="pa-0 mb-6">
        <template v-slot:divider>
          <v-icon icon="mdi-chevron-right" size="small"></v-icon>
        </template>
      </v-breadcrumbs>

      <!-- Загрузка -->
      <div v-if="loading" class="d-flex justify-center py-16">
        <v-progress-circular indeterminate :color="settings.primaryColor" size="48"></v-progress-circular>
      </div>

      <!-- Товар не найден -->
      <v-alert v-else-if="!product" type="warning" class="mb-4">
        Товар не найден
      </v-alert>

      <!-- Карточка товара -->
      <template v-else>
        <v-row>
          <!-- Изображение -->
          <v-col cols="12" md="6">
            <v-card class="rounded-xl" flat>
              <v-sheet
                :color="isDark ? 'grey-darken-3' : 'grey-lighten-4'"
                height="500"
                class="rounded-xl d-flex align-center justify-center"
              >
                <v-img 
                  v-if="product.images && product.images.length > 0" 
                  :src="product.images[0]" 
                  height="500" 
                  cover 
                  class="rounded-xl"
                ></v-img>
                <v-icon v-else size="120" :color="isDark ? 'grey-darken-1' : 'grey-lighten-2'">
                  mdi-image-outline
                </v-icon>
              </v-sheet>
            </v-card>
          </v-col>

          <!-- Информация -->
          <v-col cols="12" md="6">
            <div class="d-flex flex-column h-100">
              <!-- Рейтинг -->
              <div class="d-flex align-center mb-3">
                <v-rating
                  :model-value="reviewsStore.getAverageRating(productId)"
                  color="amber"
                  half-increments
                  readonly
                  density="compact"
                  size="small"
                ></v-rating>
                <span class="text-body-2 ml-2" :style="{ color: settings.textColor }">
                  {{ reviewsStore.getAverageRating(productId) }} ({{ reviewsStore.getReviewsCount(productId) }} отзывов)
                </span>
              </div>

              <!-- Название -->
              <h1 class="text-h4 font-weight-bold mb-4" :style="{ color: settings.textColor }">
                {{ product.name }}
              </h1>

              <!-- Цена -->
              <div class="d-flex align-center mb-6">
                <span class="text-h4 font-weight-bold" :style="{ color: settings.primaryColor }">
                  {{ formatPrice(product.price) }}
                </span>
                <span
                  v-if="product.compareAtPrice && product.compareAtPrice > product.price"
                  class="text-h6 text-decoration-line-through text-grey ml-4"
                >
                  {{ formatPrice(product.compareAtPrice) }}
                </span>
              </div>

              <!-- Описание -->
              <p class="text-body-1 mb-6" :style="{ color: settings.textColor, opacity: 0.8 }">
                {{ product.description || 'Нет описания' }}
              </p>

              <!-- Количество и кнопка -->
              <div class="d-flex align-center gap-4 mb-6">
                <div class="d-flex align-center border rounded-lg">
                  <v-btn icon="mdi-minus" variant="text" size="small" :disabled="quantity <= 1" @click="quantity--"></v-btn>
                  <span class="px-4 font-weight-bold">{{ quantity }}</span>
                  <v-btn icon="mdi-plus" variant="text" size="small" @click="quantity++"></v-btn>
                </div>
                <v-btn
                  size="x-large"
                  rounded="lg"
                  :color="settings.primaryColor"
                  class="text-white text-none font-weight-bold px-10 flex-grow-1"
                  :disabled="product.status !== 'active'"
                  @click="addToCart"
                >
                  <v-icon icon="mdi-cart-plus" class="mr-2"></v-icon>
                  В корзину
                </v-btn>
              </div>

              <!-- Преимущества -->
              <div class="d-flex flex-wrap gap-4 mt-auto">
                <div class="d-flex align-center">
                  <v-icon icon="mdi-truck-delivery-outline" :color="settings.primaryColor" class="mr-2"></v-icon>
                  <span class="text-body-2">Быстрая доставка</span>
                </div>
                <div class="d-flex align-center">
                  <v-icon icon="mdi-shield-check-outline" :color="settings.primaryColor" class="mr-2"></v-icon>
                  <span class="text-body-2">Гарантия качества</span>
                </div>
              </div>
            </div>
          </v-col>
        </v-row>

        <!-- Секция отзывов -->
        <v-card class="rounded-xl mt-8 pa-6" flat :color="isDark ? 'grey-darken-4' : 'grey-lighten-5'">
          <div class="d-flex justify-space-between align-center mb-6">
            <h2 class="text-h6 font-weight-bold" :style="{ color: settings.textColor }">
              Отзывы ({{ productReviews.length }})
            </h2>
            <v-btn
              :color="settings.primaryColor"
              variant="flat"
              class="text-white text-none font-weight-bold"
              rounded="lg"
              @click="showReviewForm = true"
            >
              Написать отзыв
            </v-btn>
          </div>

          <!-- Форма отзыва -->
          <v-card v-if="showReviewForm" class="rounded-xl pa-5 mb-6" flat>
            <h3 class="font-weight-bold mb-4">Новый отзыв</h3>
            <v-text-field
              v-model="newReview.authorName"
              label="Ваше имя"
              variant="outlined"
              density="compact"
              hide-details
              class="mb-4"
            ></v-text-field>
            <div class="mb-4">
              <label class="text-body-2 font-weight-bold mb-2 d-block">Оценка</label>
              <v-rating
                v-model="newReview.rating"
                color="amber"
                hover
                size="large"
              ></v-rating>
            </div>
            <v-textarea
              v-model="newReview.text"
              label="Ваш отзыв"
              variant="outlined"
              density="compact"
              rows="3"
              hide-details
              class="mb-4"
            ></v-textarea>
            <div class="d-flex gap-2">
              <v-btn
                :color="settings.primaryColor"
                variant="flat"
                class="text-white text-none font-weight-bold"
                rounded="lg"
                :loading="reviewsStore.loading"
                @click="submitReview"
              >
                Отправить
              </v-btn>
              <v-btn variant="text" class="text-none" @click="showReviewForm = false">Отмена</v-btn>
            </div>
          </v-card>

          <!-- Список отзывов -->
          <div v-if="productReviews.length > 0">
            <v-card
              v-for="review in productReviews"
              :key="review.id"
              class="rounded-lg pa-4 mb-3"
              flat
            >
              <div class="d-flex align-center mb-2">
                <v-avatar color="grey-lighten-3" size="36" class="mr-3">
                  <span class="font-weight-bold">{{ review.authorName.charAt(0) }}</span>
                </v-avatar>
                <div>
                  <div class="font-weight-bold text-body-2">{{ review.authorName }}</div>
                  <v-rating :model-value="review.rating" color="amber" readonly density="compact" size="x-small"></v-rating>
                </div>
                <v-spacer></v-spacer>
                <span class="text-caption text-grey">{{ formatDate(review.createdAt) }}</span>
              </div>
              <p class="text-body-2 mb-0">{{ review.text }}</p>
            </v-card>
          </div>
          <div v-else class="text-center py-8">
            <v-icon icon="mdi-comment-outline" size="48" color="grey-lighten-1" class="mb-2"></v-icon>
            <p class="text-body-2 text-grey">Пока нет отзывов. Будьте первым!</p>
          </div>
        </v-card>
      </template>
    </v-container>
  </ShopLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'
import ShopLayout from '@/layouts/ShopLayout.vue'
import { useShopStore } from '@/stores/shop'
import { useProductsStore, type Product } from '@/stores/products'
import { useCartStore } from '@/stores/cart'
import { useReviewsStore } from '@/stores/reviews'

const route = useRoute()
const shopStore = useShopStore()
const productsStore = useProductsStore()
const cartStore = useCartStore()
const reviewsStore = useReviewsStore()

const settings = computed(() => shopStore.settings)
const isDark = computed(() => shopStore.isDarkTheme)

const loading = ref(true)
const product = ref<Product | null>(null)
const quantity = ref(1)
const showReviewForm = ref(false)

const newReview = reactive({
  authorName: '',
  rating: 5,
  text: ''
})

const productId = computed(() => route.params.id as string)
const productReviews = computed(() => reviewsStore.getReviewsByProductId(productId.value))

const breadcrumbs = computed(() => [
  { title: 'Главная', to: '/shop/preview' },
  { title: 'Каталог', to: '/shop/catalog' },
  { title: product.value?.name || 'Товар', disabled: true }
])

onMounted(() => {
  loading.value = true
  // Берем товар из уже загруженного списка (из конфига)
  const found = productsStore.allProducts.find(p => String(p.id) === String(productId.value))
  product.value = found || null
  loading.value = false
})

const formatPrice = (price: number) => new Intl.NumberFormat('ru-RU').format(price) + ' ₽'

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })
}

const addToCart = () => {
  if (!product.value) return
  for (let i = 0; i < quantity.value; i++) {
    cartStore.addItem({
      id: product.value.id,
      name: product.value.name,
      price: product.value.price,
      image: product.value.images?.[0]
    })
  }
  quantity.value = 1
}

const submitReview = async () => {
  if (!newReview.authorName.trim() || !newReview.text.trim()) return
  await reviewsStore.addReview({
    productId: productId.value,
    authorName: newReview.authorName,
    rating: newReview.rating,
    text: newReview.text
  })
  newReview.authorName = ''
  newReview.rating = 5
  newReview.text = ''
  showReviewForm.value = false
}
</script>

<style scoped>
.mw-1200 { max-width: 1200px; margin: 0 auto; }
</style>
