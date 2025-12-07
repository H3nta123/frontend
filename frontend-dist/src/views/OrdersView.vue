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

    <!-- Фильтры по статусу -->
    <div class="d-flex gap-2 mb-6 flex-wrap">
      <v-chip
        v-for="status in statusFilters"
        :key="status.value"
        :color="activeStatus === status.value ? getStatusColor(status.value) : 'grey-lighten-3'"
        :class="activeStatus === status.value ? 'text-white' : 'text-grey-darken-2'"
        class="font-weight-bold"
        @click="activeStatus = status.value"
      >
        {{ status.label }}
        <span v-if="status.value !== 'all'" class="ml-1">({{ getStatusCount(status.value) }})</span>
      </v-chip>
    </div>

    <!-- Загрузка -->
    <div v-if="ordersStore.loading && ordersStore.orders.length === 0" class="d-flex justify-center py-16">
      <v-progress-circular indeterminate color="#4527A0" size="48"></v-progress-circular>
    </div>

    <!-- Ошибка -->
    <v-alert v-else-if="ordersStore.error" type="error" class="mb-4" closable>
      {{ ordersStore.error }}
    </v-alert>

    <!-- Пустой список -->
    <v-card v-else-if="filteredOrders.length === 0" class="rounded-xl border pa-12 text-center" flat>
      <v-icon icon="mdi-package-variant" size="64" color="grey-lighten-1" class="mb-4"></v-icon>
      <h3 class="text-h6 font-weight-bold mb-2">Заказов нет</h3>
      <p class="text-body-2 text-grey">Новые заказы появятся здесь</p>
    </v-card>

    <!-- Таблица заказов -->
    <v-card v-else class="rounded-xl border" flat>
      <v-table>
        <thead class="bg-grey-lighten-4">
          <tr>
            <th class="text-left font-weight-bold py-4 pl-6">Заказ</th>
            <th class="text-left font-weight-bold">Дата</th>
            <th class="text-left font-weight-bold">Клиент</th>
            <th class="text-left font-weight-bold">Сумма</th>
            <th class="text-left font-weight-bold">Статус</th>
            <th class="text-right font-weight-bold pr-6">Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in filteredOrders" :key="order.id" class="hover-row">
            <td class="py-4 pl-6">
              <div class="font-weight-bold">#{{ order.orderNumber }}</div>
              <div class="text-caption text-grey">{{ order.items.length }} товаров</div>
            </td>
            <td class="text-body-2">{{ formatDate(order.createdAt) }}</td>
            <td>
              <div class="font-weight-bold">{{ order.customerName }}</div>
              <div class="text-caption text-grey">{{ order.customerPhone }}</div>
            </td>
            <td class="font-weight-bold">{{ formatPrice(order.total) }}</td>
            <td>
              <v-chip
                size="small"
                :color="getStatusColor(order.status)"
                label
              >
                {{ getStatusLabel(order.status) }}
              </v-chip>
            </td>
            <td class="text-right pr-6">
              <v-btn variant="text" color="blue" class="text-none font-weight-medium" @click="openOrderDetails(order)">
                Подробнее
              </v-btn>
              <v-menu v-if="order.status !== 'delivered' && order.status !== 'cancelled'">
                <template v-slot:activator="{ props }">
                  <v-btn variant="text" color="grey" class="text-none" v-bind="props" icon="mdi-dots-vertical"></v-btn>
                </template>
                <v-list density="compact">
                  <v-list-item
                    v-for="nextStatus in getNextStatuses(order.status)"
                    :key="nextStatus"
                    @click="changeStatus(order.id, nextStatus)"
                  >
                    <v-list-item-title>{{ getStatusAction(nextStatus) }}</v-list-item-title>
                  </v-list-item>
                  <v-divider></v-divider>
                  <v-list-item @click="changeStatus(order.id, 'cancelled')">
                    <v-list-item-title class="text-red">Отменить</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
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
          <v-chip size="small" :color="getStatusColor(selectedOrder.status)" class="ml-3" label>
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
import { useOrdersStore, type Order, type OrderStatus } from '@/stores/orders'

const ordersStore = useOrdersStore()

const activeStatus = ref<string>('all')
const detailsDialog = ref(false)
const selectedOrder = ref<Order | null>(null)

const statusFilters = [
  { label: 'Все', value: 'all' },
  { label: 'Новые', value: 'new' },
  { label: 'В обработке', value: 'processing' },
  { label: 'Отправлены', value: 'shipped' },
  { label: 'Доставлены', value: 'delivered' },
  { label: 'Отменены', value: 'cancelled' },
]

onMounted(() => {
  ordersStore.fetchOrders()
})

const filteredOrders = computed(() => {
  if (activeStatus.value === 'all') return ordersStore.orders
  return ordersStore.orders.filter(o => o.status === activeStatus.value)
})

const getStatusCount = (status: string): number => {
  return ordersStore.orders.filter(o => o.status === status).length
}

const getStatusColor = (status: string): string => {
  switch (status) {
    case 'new': return 'blue'
    case 'processing': return 'orange'
    case 'shipped': return 'purple'
    case 'delivered': return 'green'
    case 'cancelled': return 'grey'
    default: return 'grey'
  }
}

const getStatusLabel = (status: string): string => {
  switch (status) {
    case 'new': return 'Новый'
    case 'processing': return 'В обработке'
    case 'shipped': return 'Отправлен'
    case 'delivered': return 'Доставлен'
    case 'cancelled': return 'Отменён'
    default: return status
  }
}

const getStatusAction = (status: OrderStatus): string => {
  switch (status) {
    case 'processing': return 'Взять в работу'
    case 'shipped': return 'Отправить'
    case 'delivered': return 'Доставлен'
    default: return ''
  }
}

const getNextStatuses = (currentStatus: OrderStatus): OrderStatus[] => {
  switch (currentStatus) {
    case 'new': return ['processing']
    case 'processing': return ['shipped']
    case 'shipped': return ['delivered']
    default: return []
  }
}

const formatDate = (dateStr: string) => {
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

const openOrderDetails = (order: Order) => {
  selectedOrder.value = order
  detailsDialog.value = true
}

const changeStatus = async (orderId: number, status: OrderStatus) => {
  await ordersStore.updateOrderStatus(orderId, status)
}
</script>

<style scoped>
.hover-row:hover td {
  background-color: #fafafa;
}
</style>
