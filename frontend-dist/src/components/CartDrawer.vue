<template>
  <!-- Drawer корзины -->
  <v-navigation-drawer
    v-model="cartStore.isOpen"
    location="right"
    temporary
    width="420"
    class="cart-drawer"
  >
    <!-- Заголовок -->
    <div class="d-flex align-center justify-space-between pa-4 border-b">
      <h2 class="text-h6 font-weight-bold">
        Корзина
        <v-chip v-if="cartStore.totalItems > 0" size="small" color="primary" class="ml-2">
          {{ cartStore.totalItems }}
        </v-chip>
      </h2>
      <v-btn icon="mdi-close" variant="text" @click="cartStore.closeCart"></v-btn>
    </div>

    <!-- Пустая корзина -->
    <div v-if="cartStore.items.length === 0" class="d-flex flex-column align-center justify-center h-100 pa-8">
      <v-icon icon="mdi-cart-outline" size="80" color="grey-lighten-2" class="mb-4"></v-icon>
      <h3 class="text-h6 font-weight-bold mb-2">Корзина пуста</h3>
      <p class="text-body-2 text-grey text-center mb-6">Добавьте товары, чтобы начать покупки</p>
      <v-btn
        color="primary"
        variant="flat"
        class="text-none font-weight-bold"
        rounded="lg"
        to="/shop/catalog"
        @click="cartStore.closeCart"
      >
        Перейти в каталог
      </v-btn>
    </div>

    <!-- Товары в корзине -->
    <div v-else class="d-flex flex-column h-100">
      <div class="flex-grow-1 overflow-y-auto pa-4">
        <div
          v-for="item in cartStore.items"
          :key="item.productId"
          class="d-flex gap-3 mb-4 pb-4 border-b"
        >
          <!-- Изображение -->
          <v-sheet
            width="80"
            height="80"
            color="grey-lighten-4"
            class="rounded-lg flex-shrink-0 d-flex align-center justify-center"
          >
            <v-img v-if="item.image" :src="item.image" width="80" height="80" cover class="rounded-lg"></v-img>
            <v-icon v-else icon="mdi-image-outline" color="grey-lighten-2" size="32"></v-icon>
          </v-sheet>

          <!-- Информация -->
          <div class="flex-grow-1">
            <h4 class="text-body-1 font-weight-bold mb-1 text-truncate" style="max-width: 200px;">
              {{ item.name }}
            </h4>
            <div class="text-body-2 font-weight-bold text-primary mb-2">
              {{ formatPrice(item.price) }}
            </div>

            <!-- Количество -->
            <div class="d-flex align-center">
              <v-btn
                icon="mdi-minus"
                variant="outlined"
                size="x-small"
                density="compact"
                @click="cartStore.decrementQuantity(item.productId)"
              ></v-btn>
              <span class="px-3 font-weight-bold">{{ item.quantity }}</span>
              <v-btn
                icon="mdi-plus"
                variant="outlined"
                size="x-small"
                density="compact"
                @click="cartStore.incrementQuantity(item.productId)"
              ></v-btn>
            </div>
          </div>

          <!-- Удалить -->
          <v-btn
            icon="mdi-trash-can-outline"
            variant="text"
            color="red"
            size="small"
            @click="cartStore.removeItem(item.productId)"
          ></v-btn>
        </div>
      </div>

      <!-- Итого и кнопка -->
      <div class="pa-4 border-t bg-grey-lighten-5">
        <div class="d-flex justify-space-between mb-2">
          <span class="text-body-2 text-grey">Товаров:</span>
          <span class="text-body-2 font-weight-bold">{{ cartStore.totalItems }} шт.</span>
        </div>
        <div class="d-flex justify-space-between mb-4">
          <span class="text-body-1 font-weight-bold">Итого:</span>
          <span class="text-h6 font-weight-bold text-primary">{{ formatPrice(cartStore.subtotal) }}</span>
        </div>

        <v-btn
          block
          size="large"
          color="primary"
          variant="flat"
          class="text-none font-weight-bold mb-2"
          rounded="lg"
          to="/shop/checkout"
          @click="cartStore.closeCart"
        >
          Оформить заказ
        </v-btn>
        <v-btn
          block
          variant="text"
          class="text-none"
          @click="cartStore.closeCart"
        >
          Продолжить покупки
        </v-btn>
      </div>
    </div>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { useCartStore } from '@/stores/cart'

const cartStore = useCartStore()

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('ru-RU').format(price) + ' ₽'
}
</script>

<style scoped>
.cart-drawer {
  z-index: 9999 !important;
}
</style>
