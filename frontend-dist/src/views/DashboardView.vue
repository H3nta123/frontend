<template>
  <MainLayout>
    <v-container fluid class="pa-0 mw-1200">

      <!-- Заголовок -->
      <div class="d-flex justify-space-between align-center mb-6">
        <div>
          <h1 class="text-h5 font-weight-black text-black">Аналитика</h1>
          <p class="text-body-2 text-grey-darken-1">Обзор показателей вашего магазина</p>
        </div>
        <v-select
          v-model="period"
          :items="periodOptions"
          item-title="title"
          item-value="value"
          variant="outlined"
          density="compact"
          hide-details
          style="max-width: 180px;"
          prepend-inner-icon="mdi-calendar"
        ></v-select>
      </div>

      <!-- Ключевые метрики -->
      <v-row class="mb-6">
        <v-col cols="12" sm="6" lg="3">
          <v-card class="rounded-xl border pa-5 h-100 metric-card" flat>
            <div class="d-flex justify-space-between align-start mb-3">
              <span class="text-caption font-weight-bold text-grey text-uppercase">Выручка</span>
              <v-avatar color="deep-purple-lighten-5" size="40" rounded="lg">
                <v-icon color="#4527A0" icon="mdi-cash-multiple"></v-icon>
              </v-avatar>
            </div>
            <div class="text-h5 font-weight-black mb-2">{{ formatPrice(25750) }}</div>
            <div class="d-flex align-center">
              <v-icon icon="mdi-arrow-up" color="green" size="small"></v-icon>
              <span class="text-caption font-weight-bold text-green ml-1">+12.5%</span>
              <span class="text-caption text-grey ml-2">vs прошлая неделя</span>
            </div>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" lg="3">
          <v-card class="rounded-xl border pa-5 h-100 metric-card" flat>
            <div class="d-flex justify-space-between align-start mb-3">
              <span class="text-caption font-weight-bold text-grey text-uppercase">Заказы</span>
              <v-avatar color="blue-lighten-5" size="40" rounded="lg">
                <v-icon color="#1976D2" icon="mdi-package-variant"></v-icon>
              </v-avatar>
            </div>
            <div class="text-h5 font-weight-black mb-2">{{ ordersStore.orders.length }}</div>
            <div class="d-flex align-center">
              <v-icon icon="mdi-arrow-up" color="green" size="small"></v-icon>
              <span class="text-caption font-weight-bold text-green ml-1">+33%</span>
              <span class="text-caption text-grey ml-2">vs прошлая неделя</span>
            </div>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" lg="3">
          <v-card class="rounded-xl border pa-5 h-100 metric-card" flat>
            <div class="d-flex justify-space-between align-start mb-3">
              <span class="text-caption font-weight-bold text-grey text-uppercase">Средний чек</span>
              <v-avatar color="teal-lighten-5" size="40" rounded="lg">
                <v-icon color="#00897B" icon="mdi-cart-check"></v-icon>
              </v-avatar>
            </div>
            <div class="text-h5 font-weight-black mb-2">{{ formatPrice(6438) }}</div>
            <div class="d-flex align-center">
              <v-icon icon="mdi-arrow-down" color="red" size="small"></v-icon>
              <span class="text-caption font-weight-bold text-red ml-1">-5.2%</span>
              <span class="text-caption text-grey ml-2">vs прошлая неделя</span>
            </div>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" lg="3">
          <v-card class="rounded-xl border pa-5 h-100 metric-card" flat>
            <div class="d-flex justify-space-between align-start mb-3">
              <span class="text-caption font-weight-bold text-grey text-uppercase">Конверсия</span>
              <v-avatar color="orange-lighten-5" size="40" rounded="lg">
                <v-icon color="#FB8C00" icon="mdi-percent"></v-icon>
              </v-avatar>
            </div>
            <div class="text-h5 font-weight-black mb-2">3.2%</div>
            <div class="d-flex align-center">
              <v-icon icon="mdi-arrow-up" color="green" size="small"></v-icon>
              <span class="text-caption font-weight-bold text-green ml-1">+0.8%</span>
              <span class="text-caption text-grey ml-2">vs прошлая неделя</span>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <!-- График продаж (простой на CSS) -->
        <v-col cols="12" lg="8">
          <v-card class="rounded-xl border" flat>
            <v-card-title class="d-flex align-center justify-space-between pa-5 pb-3">
              <span class="font-weight-bold">Продажи за неделю</span>
            </v-card-title>
            <v-card-text class="pa-5 pt-0">
              <div class="simple-chart d-flex align-end justify-space-between gap-3">
                <div v-for="(day, idx) in weekData" :key="idx" class="chart-bar-wrapper text-center">
                  <div class="chart-bar-value text-caption font-weight-bold mb-1">
                    {{ (day.value / 1000).toFixed(1) }}k
                  </div>
                  <div 
                    class="chart-bar rounded-t-lg"
                    :style="{ height: (day.value / maxValue * 180) + 'px', backgroundColor: idx === 6 ? '#4527A0' : '#E8E0FF' }"
                  ></div>
                  <div class="chart-bar-label text-caption text-grey mt-2">{{ day.label }}</div>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Топ товаров -->
        <v-col cols="12" lg="4">
          <v-card class="rounded-xl border h-100" flat>
            <v-card-title class="font-weight-bold pa-5 pb-3">Топ товаров</v-card-title>
            <v-list class="pa-0">
              <v-list-item
                v-for="(product, index) in topProducts"
                :key="product.id"
                class="px-5 py-3"
              >
                <template v-slot:prepend>
                  <v-avatar :color="['#FFD700', '#C0C0C0', '#CD7F32', '#4527A0', '#888'][index]" size="36" class="mr-3">
                    <span class="text-white font-weight-bold">{{ index + 1 }}</span>
                  </v-avatar>
                </template>
                <v-list-item-title class="font-weight-bold text-body-2">{{ product.name }}</v-list-item-title>
                <v-list-item-subtitle class="text-caption">{{ product.sales }} продаж</v-list-item-subtitle>
                <template v-slot:append>
                  <span class="font-weight-bold text-body-2" style="color: #4527A0;">{{ formatPrice(product.revenue) }}</span>
                </template>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
      </v-row>

      <!-- Последние заказы и трафик -->
      <v-row class="mt-4">
        <v-col cols="12" lg="8">
          <v-card class="rounded-xl border" flat>
            <v-card-title class="d-flex align-center justify-space-between pa-5 pb-3">
              <span class="font-weight-bold">Последние заказы</span>
              <v-btn variant="text" color="primary" class="text-none" to="/orders">Все заказы</v-btn>
            </v-card-title>
            <v-table density="comfortable">
              <thead class="bg-grey-lighten-5">
                <tr>
                  <th class="text-left pl-5">Заказ</th>
                  <th class="text-left">Клиент</th>
                  <th class="text-left">Сумма</th>
                  <th class="text-left">Статус</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="order in ordersStore.orders.slice(0, 5)" :key="order.id">
                  <td class="pl-5"><span class="font-weight-bold">#{{ order.orderNumber }}</span></td>
                  <td>{{ order.customerName }}</td>
                  <td class="font-weight-bold">{{ formatPrice(order.total) }}</td>
                  <td>
                    <v-chip size="small" :color="getStatusColor(order.status)" label>{{ getStatusLabel(order.status) }}</v-chip>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card>
        </v-col>

        <v-col cols="12" lg="4">
          <v-card class="rounded-xl border h-100" flat>
            <v-card-title class="font-weight-bold pa-5 pb-3">Источники трафика</v-card-title>
            <v-card-text>
              <div v-for="source in trafficSources" :key="source.name" class="mb-4">
                <div class="d-flex justify-space-between mb-1">
                  <span class="text-body-2">{{ source.name }}</span>
                  <span class="text-body-2 font-weight-bold">{{ source.percent }}%</span>
                </div>
                <v-progress-linear :model-value="source.percent" :color="source.color" height="8" rounded></v-progress-linear>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

    </v-container>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import MainLayout from '@/layouts/MainLayout.vue'
import { useOrdersStore } from '@/stores/orders'

const ordersStore = useOrdersStore()
const period = ref('7days')

const periodOptions = [
  { title: 'Последние 7 дней', value: '7days' },
  { title: 'Последние 30 дней', value: '30days' },
  { title: 'Этот месяц', value: 'month' },
]

// Данные графика
const weekData = [
  { label: 'Пн', value: 4200 },
  { label: 'Вт', value: 3800 },
  { label: 'Ср', value: 5100 },
  { label: 'Чт', value: 6200 },
  { label: 'Пт', value: 4800 },
  { label: 'Сб', value: 8500 },
  { label: 'Вс', value: 7200 },
]

const maxValue = computed(() => Math.max(...weekData.map(d => d.value)))

// Топ товаров
const topProducts = [
  { id: 1, name: 'Худи Streetwear', sales: 12, revenue: 54000 },
  { id: 2, name: 'Кроссовки Classic', sales: 8, revenue: 57600 },
  { id: 3, name: 'Футболка Oversize', sales: 15, revenue: 37500 },
  { id: 4, name: 'Джинсы Regular', sales: 6, revenue: 22800 },
  { id: 5, name: 'Кепка Brand', sales: 10, revenue: 12000 },
]

// Трафик
const trafficSources = [
  { name: 'Прямые переходы', percent: 45, color: '#4527A0' },
  { name: 'Поисковики', percent: 28, color: '#1976D2' },
  { name: 'Соцсети', percent: 18, color: '#00897B' },
  { name: 'Реклама', percent: 9, color: '#FB8C00' },
]

// Хелперы
const formatPrice = (price: number) => new Intl.NumberFormat('ru-RU').format(price) + ' ₽'

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = { new: 'blue', processing: 'orange', shipped: 'purple', delivered: 'green', cancelled: 'grey' }
  return colors[status] || 'grey'
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = { new: 'Новый', processing: 'В обработке', shipped: 'Отправлен', delivered: 'Доставлен', cancelled: 'Отменён' }
  return labels[status] || status
}

onMounted(() => {
  ordersStore.fetchOrders()
})
</script>

<style scoped>
.mw-1200 {
  max-width: 1200px;
  margin: 0 auto;
}

.metric-card {
  transition: box-shadow 0.2s;
}

.metric-card:hover {
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
}

.simple-chart {
  height: 240px;
  padding-top: 20px;
}

.chart-bar-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.chart-bar {
  width: 100%;
  max-width: 48px;
  min-height: 20px;
  transition: height 0.3s ease;
}
</style>
