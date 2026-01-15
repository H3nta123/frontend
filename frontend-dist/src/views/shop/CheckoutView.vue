<template>
  <ShopLayout>
    <v-container class="py-8 mw-900">
      <!-- Заголовок -->
      <h1 
        class="text-h4 font-weight-bold mb-8 text-center"
        :style="{ color: settings.textColor }"
      >
        Оформление заказа
      </h1>

      <!-- Пустая корзина -->
      <v-card 
        v-if="cartStore.items.length === 0" 
        class="rounded-xl pa-12 text-center" 
        flat
        :color="isDark ? 'grey-darken-4' : 'grey-lighten-5'"
      >
        <v-icon icon="mdi-cart-outline" size="80" color="grey" class="mb-4"></v-icon>
        <h3 class="text-h6 font-weight-bold mb-2" :style="{ color: settings.textColor }">
          Корзина пуста
        </h3>
        <p class="text-body-2 mb-6" :style="{ color: settings.textColor, opacity: 0.7 }">
          Добавьте товары для оформления заказа
        </p>
        <v-btn
          :color="settings.primaryColor"
          variant="flat"
          class="text-white text-none font-weight-bold"
          rounded="lg"
          to="/shop/catalog"
        >
          Перейти в каталог
        </v-btn>
      </v-card>

      <!-- Форма оформления -->
      <v-row v-else>
        <!-- Левая колонка: форма -->
        <v-col cols="12" md="7">
          <v-card class="rounded-xl pa-6 mb-6" flat :color="isDark ? 'grey-darken-4' : 'white'">
            <h2 class="text-h6 font-weight-bold mb-4" :style="{ color: settings.textColor }">
              Контактные данные
            </h2>

            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="cartStore.customerInfo.name"
                  label="Имя *"
                  variant="outlined"
                  density="comfortable"
                  hide-details="auto"
                  :error-messages="errors.name"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="cartStore.customerInfo.phone"
                  label="Телефон *"
                  variant="outlined"
                  density="comfortable"
                  hide-details="auto"
                  :error-messages="errors.phone"
                  placeholder="+7 (999) 123-45-67"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="cartStore.customerInfo.email"
                  label="Email"
                  type="email"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card>

          <!-- Доставка -->
          <v-card class="rounded-xl pa-6 mb-6" flat :color="isDark ? 'grey-darken-4' : 'white'">
            <h2 class="text-h6 font-weight-bold mb-4" :style="{ color: settings.textColor }">
              Способ доставки
            </h2>

            <v-radio-group v-model="cartStore.selectedDelivery" hide-details>
              <v-card
                v-for="method in deliveryMethods"
                :key="method.id"
                class="pa-4 mb-3 rounded-lg cursor-pointer"
                :class="{ 'border-primary': cartStore.selectedDelivery === method.id }"
                flat
                :color="isDark ? 'grey-darken-3' : 'grey-lighten-5'"
                @click="cartStore.selectedDelivery = method.id"
              >
                <div class="d-flex align-center">
                  <v-radio :value="method.id" hide-details class="ma-0 pa-0"></v-radio>
                  <div class="ml-3 flex-grow-1">
                    <div class="font-weight-bold" :style="{ color: settings.textColor }">
                      {{ method.name }}
                    </div>
                    <div class="text-body-2" :style="{ color: settings.textColor, opacity: 0.7 }">
                      {{ method.description }} · {{ method.estimatedDays }}
                    </div>
                  </div>
                  <div class="font-weight-bold" :style="{ color: settings.primaryColor }">
                    {{ method.price === 0 ? 'Бесплатно' : formatPrice(method.price) }}
                  </div>
                </div>
              </v-card>
            </v-radio-group>

            <!-- Адрес при необходимости -->
            <v-text-field
              v-if="cartStore.selectedDelivery !== 'pickup'"
              v-model="cartStore.customerInfo.address"
              label="Адрес доставки *"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
              class="mt-4"
              :error-messages="errors.address"
            ></v-text-field>
          </v-card>

          <!-- Комментарий -->
          <v-card class="rounded-xl pa-6" flat :color="isDark ? 'grey-darken-4' : 'white'">
            <h2 class="text-h6 font-weight-bold mb-4" :style="{ color: settings.textColor }">
              Комментарий к заказу
            </h2>
            <v-textarea
              v-model="cartStore.customerInfo.comment"
              placeholder="Дополнительные пожелания..."
              variant="outlined"
              density="comfortable"
              rows="3"
              hide-details
            ></v-textarea>
          </v-card>
        </v-col>

        <!-- Правая колонка: итого -->
        <v-col cols="12" md="5">
          <v-card class="rounded-xl pa-6 sticky-card" flat :color="isDark ? 'grey-darken-4' : 'grey-lighten-5'">
            <h2 class="text-h6 font-weight-bold mb-4" :style="{ color: settings.textColor }">
              Ваш заказ
            </h2>

            <!-- Товары -->
            <div class="mb-4">
              <div
                v-for="item in cartStore.items"
                :key="item.productId"
                class="d-flex justify-space-between mb-2"
              >
                <span class="text-body-2" :style="{ color: settings.textColor }">
                  {{ item.name }} × {{ item.quantity }}
                </span>
                <span class="text-body-2 font-weight-bold" :style="{ color: settings.textColor }">
                  {{ formatPrice(item.price * item.quantity) }}
                </span>
              </div>
            </div>

            <v-divider class="mb-4"></v-divider>

            <!-- Итого -->
            <div class="d-flex justify-space-between mb-2">
              <span :style="{ color: settings.textColor }">Товары:</span>
              <span class="font-weight-bold" :style="{ color: settings.textColor }">
                {{ formatPrice(cartStore.subtotal) }}
              </span>
            </div>
            <div class="d-flex justify-space-between mb-4">
              <span :style="{ color: settings.textColor }">Доставка:</span>
              <span class="font-weight-bold" :style="{ color: settings.textColor }">
                {{ cartStore.deliveryPrice === 0 ? 'Бесплатно' : formatPrice(cartStore.deliveryPrice) }}
              </span>
            </div>

            <v-divider class="mb-4"></v-divider>

            <div class="d-flex justify-space-between mb-6">
              <span class="text-h6 font-weight-bold" :style="{ color: settings.textColor }">Итого:</span>
              <span class="text-h5 font-weight-bold" :style="{ color: settings.primaryColor }">
                {{ formatPrice(cartStore.total) }}
              </span>
            </div>

            <v-btn
              block
              size="x-large"
              :color="settings.primaryColor"
              variant="flat"
              class="text-white text-none font-weight-bold"
              rounded="lg"
              :loading="submitting"
              @click="submitOrder"
            >
              Оформить заказ
            </v-btn>

            <p class="text-caption text-center mt-4" :style="{ color: settings.textColor, opacity: 0.6 }">
              Нажимая кнопку, вы соглашаетесь с условиями обработки персональных данных
            </p>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Диалог успеха -->
    <v-dialog v-model="successDialog" max-width="500" persistent>
      <v-card class="rounded-xl text-center pa-8">
        <v-icon icon="mdi-check-circle" color="green" size="80" class="mb-4"></v-icon>
        <h2 class="text-h5 font-weight-bold mb-2">Заказ оформлен!</h2>
        <p class="text-body-1 text-grey mb-2">
          Номер заказа: <strong>#{{ orderNumber }}</strong>
        </p>
        <p class="text-body-2 text-grey mb-6">
          Мы свяжемся с вами для подтверждения
        </p>
        <v-btn
          :color="settings.primaryColor"
          variant="flat"
          class="text-white text-none font-weight-bold"
          rounded="lg"
          to="/shop/preview"
          @click="successDialog = false"
        >
          На главную
        </v-btn>
      </v-card>
    </v-dialog>
  </ShopLayout>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import ShopLayout from '@/layouts/ShopLayout.vue'
import { useShopStore } from '@/stores/shop'
import { useCartStore, DELIVERY_METHODS } from '@/stores/cart'

const shopStore = useShopStore()
const cartStore = useCartStore()

const settings = computed(() => shopStore.settings)
const isDark = computed(() => shopStore.isDarkTheme)

const deliveryMethods = DELIVERY_METHODS
const submitting = ref(false)
const successDialog = ref(false)
const orderNumber = ref('')

const errors = reactive({
  name: '',
  phone: '',
  address: ''
})

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('ru-RU').format(price) + ' ₽'
}

const validate = (): boolean => {
  errors.name = ''
  errors.phone = ''
  errors.address = ''
  let isValid = true

  if (!cartStore.customerInfo.name.trim()) {
    errors.name = 'Укажите имя'
    isValid = false
  }

  if (!cartStore.customerInfo.phone.trim()) {
    errors.phone = 'Укажите телефон'
    isValid = false
  }

  if (cartStore.selectedDelivery !== 'pickup' && !cartStore.customerInfo.address.trim()) {
    errors.address = 'Укажите адрес доставки'
    isValid = false
  }

  return isValid
}

const submitOrder = async () => {
  if (!validate()) return

  submitting.value = true
  
  try {
      // 1. Формируем строку товаров
      const itemsTitle = cartStore.items
          .map(item => `${item.name} x${item.quantity}`)
          .join(', ')
      
      const payload = {
          items: {
              title: itemsTitle,
              count: cartStore.totalItems
          },
          total_amount: cartStore.total,
          return_url: "test",
          description: `Заказ от ${cartStore.customerInfo.name}`,
          email: cartStore.customerInfo.email || "no-email@test.com"
      }
      
      // 2. Отправляем запрос
      // Используем /basket/payment который проксируется на бэкенд
      const response = await fetch('/basket/payment', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
      })

      if (!response.ok) {
          throw new Error('Ошибка при создании платежа')
      }
      
      const data = await response.json()
      console.log('Payment created:', data)

      if (data.confirmation_url) {
        // Редирект на оплату
        window.location.href = data.confirmation_url
        return
      }

      // Если ссылки нет (например, тестовый режим или ошибка), показываем успех
      // Генерация номера заказа (можно брать из ответа если бэк отдает)
      orderNumber.value = String(100000 + Math.floor(Math.random() * 900000))

      // Очистка корзины
      cartStore.clearCart()
      cartStore.resetCustomerInfo()

      submitting.value = false
      successDialog.value = true
      
  } catch (e) {
      console.error('Order error:', e)
      alert('Произошла ошибка при оформлении заказа. Попробуйте снова.')
      submitting.value = false
  }
}
</script>

<style scoped>
.mw-900 {
  max-width: 900px;
  margin: 0 auto;
}

.sticky-card {
  position: sticky;
  top: 100px;
}

.border-primary {
  border: 2px solid var(--v-theme-primary) !important;
}

.cursor-pointer {
  cursor: pointer;
}
</style>
