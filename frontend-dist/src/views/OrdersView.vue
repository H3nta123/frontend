<template>
  <MainLayout>
    <!-- Заголовок -->
    <div class="d-flex justify-space-between align-center mb-8">
      <div>
        <h1 class="text-h5 font-weight-bold text-black">Заказы</h1>
        <p class="text-body-2 text-grey-darken-1 mt-1">Управление заказами магазина</p>
      </div>

      <!-- Счётчик новых -->
      <v-chip v-if="ordersStore.newOrdersCount > 0" color="red" class="font-weight-bold">
        {{ ordersStore.newOrdersCount }} новых
      </v-chip>
    </div>

    <!-- Статистика или заглушка (можно вернуть позже) -->

    <!-- Загрузка -->
    <div v-if="ordersStore.loading && ordersStore.orders.length === 0" class="d-flex justify-center py-16">
      <v-progress-circular indeterminate color="#4527A0" size="48"></v-progress-circular>
    </div>

    <!-- Ошибка -->
    <v-alert v-else-if="ordersStore.error" type="error" class="mb-4" closable>
      {{ ordersStore.error }}
    </v-alert>

    <!-- Пустой список -->
    <v-card v-else-if="ordersStore.orders.length === 0" class="rounded-xl border pa-12 text-center" flat>
      <v-icon icon="mdi-package-variant" size="64" color="grey-lighten-1" class="mb-4"></v-icon>
      <h3 class="text-h6 font-weight-bold mb-2">Заказов нет</h3>
      <p class="text-body-2 text-grey">Новые заказы появятся здесь</p>
    </v-card>

    <!-- Таблица заказов -->
    <v-card v-else class="rounded-xl border" flat>
      <v-table>
        <thead class="bg-grey-lighten-4">
          <tr>
            <th class="text-left font-weight-bold py-4 pl-6">Магазин / ID</th>
            <th class="text-left font-weight-bold">Состав заказа</th>
            <th class="text-left font-weight-bold">Дата</th>
            <th class="text-left font-weight-bold">Сумма</th>
            <th class="text-left font-weight-bold">Статус</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in ordersStore.orders" :key="order.id" class="hover-row">
            <td class="py-4 pl-6">
              <div class="font-weight-bold text-indigo-darken-2">{{ order.site_name }}</div>
              <div class="text-caption text-grey text-truncate" style="max-width: 120px;" :title="order.id">#{{ order.id.slice(0, 8) }}...</div>
            </td>
            <td>
              <div class="font-weight-medium">{{ order.items?.title || 'Товар' }}</div>
              <div class="text-caption text-grey">{{ order.items?.count || 1 }} шт.</div>
            </td>
            <td class="text-body-2">{{ formatDate(order.created_at) }}</td>
            <td class="font-weight-bold">{{ formatPrice(order.total_amount) }}</td>
            <td>
              <v-chip
                size="small"
                :color="getStatusColor(order.status)"
                class="font-weight-bold"
                label
                :prepend-icon="getStatusIcon(order.status)"
              >
                {{ getStatusLabel(order.status) }}
              </v-chip>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>

    <!-- Диалог деталей заказа -->
    <v-dialog v-model="detailsDialog" max-width="600">
      <v-card v-if="selectedOrder" class="rounded-xl">
        <v-card-title class="d-flex align-center pa-6 pb-2">
          <span class="text-h6 font-weight-bold">Заказ #{{ selectedOrder.orderNumber }}</span>
          <v-chip size="small" :color="getStatusColor(selectedOrder.status)" class="ml-3 font-weight-bold" label :prepend-icon="getStatusIcon(selectedOrder.status)">
            {{ getStatusLabel(selectedOrder.status) }}
          </v-chip>
          <v-spacer></v-spacer>
          <v-btn icon="mdi-close" variant="text" @click="detailsDialog = false"></v-btn>
        </v-card-title>
        
        <v-divider></v-divider>

        <v-card-text class="pa-6">
          <!-- Клиент -->
          <h4 class="text-body-1 font-weight-bold mb-3">Клиент</h4>
          <div class="text-body-2 mb-1"><strong>Имя:</strong> {{ selectedOrder.customerName }}</div>
          <div class="text-body-2 mb-1"><strong>Телефон:</strong> {{ selectedOrder.customerPhone }}</div>
          <div v-if="selectedOrder.customerEmail" class="text-body-2 mb-1"><strong>Email:</strong> {{ selectedOrder.customerEmail }}</div>
          <div v-if="selectedOrder.address" class="text-body-2 mb-1"><strong>Адрес:</strong> {{ selectedOrder.address }}</div>
          <div v-if="selectedOrder.comment" class="text-body-2 mb-1"><strong>Комментарий:</strong> {{ selectedOrder.comment }}</div>

          <v-divider class="my-4"></v-divider>

          <!-- Товары -->
          <h4 class="text-body-1 font-weight-bold mb-3">Товары</h4>
          <div v-for="item in selectedOrder.items" :key="item.productId" class="d-flex justify-space-between mb-2">
            <span class="text-body-2">{{ item.name }} × {{ item.quantity }}</span>
            <span class="text-body-2 font-weight-bold">{{ formatPrice(item.price * item.quantity) }}</span>
          </div>

          <v-divider class="my-4"></v-divider>

          <!-- Итого -->
          <div class="d-flex justify-space-between mb-2">
            <span>Товары:</span>
            <span class="font-weight-bold">{{ formatPrice(selectedOrder.subtotal) }}</span>
          </div>
          <div class="d-flex justify-space-between mb-2">
            <span>Доставка ({{ selectedOrder.deliveryMethod }}):</span>
            <span class="font-weight-bold">{{ selectedOrder.deliveryPrice === 0 ? 'Бесплатно' : formatPrice(selectedOrder.deliveryPrice) }}</span>
          </div>
          <div class="d-flex justify-space-between">
            <span class="text-h6 font-weight-bold">Итого:</span>
            <span class="text-h6 font-weight-bold" style="color: #4527A0;">{{ formatPrice(selectedOrder.total) }}</span>
          </div>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="pa-6">
          <v-btn variant="text" class="text-none" @click="detailsDialog = false">Закрыть</v-btn>
          <v-spacer></v-spacer>
          <v-btn
            v-if="selectedOrder.status !== 'delivered' && selectedOrder.status !== 'cancelled'"
            v-for="nextStatus in getNextStatuses(selectedOrder.status)"
            :key="nextStatus"
            :color="getStatusColor(nextStatus)"
            variant="flat"
            class="text-white text-none font-weight-bold"
            rounded="lg"
            @click="changeStatus(selectedOrder.id, nextStatus); detailsDialog = false"
          >
            {{ getStatusAction(nextStatus) }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </MainLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import MainLayout from '@/layouts/MainLayout.vue'
import { useOrdersStore } from '@/stores/orders'

const ordersStore = useOrdersStore()

onMounted(() => {
  ordersStore.fetchOrders()
})

const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'paid': return 'green-darken-1'
    case 'awaiting payment': return 'orange-darken-1'
    case 'cancelled': return 'red-lighten-1'
    default: return 'grey-lighten-1'
  }
}

const getStatusLabel = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'paid': return 'Оплачен'
    case 'awaiting payment': return 'Ожидает оплаты'
    case 'cancelled': return 'Отменён'
    default: return status
  }
}

const getStatusIcon = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'paid': return 'mdi-check-circle'
    case 'awaiting payment': return 'mdi-clock-outline'
    case 'cancelled': return 'mdi-close-circle'
    default: return 'mdi-help-circle'
  }
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('ru-RU').format(price) + ' ₽'
}
</script>

<style scoped>
.hover-row:hover td {
  background-color: #fafafa;
}
</style>
