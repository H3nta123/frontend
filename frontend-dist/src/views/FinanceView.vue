<template>
  <MainLayout>
    <v-container>
      <div class="mb-6">
        <h1 class="text-h4 font-weight-bold mb-2">Финансы</h1>
        <p class="text-body-1 text-grey-darken-1">Управляйте доходами от ваших магазинов</p>
      </div>

      <!-- Карточки баланса -->
      <v-row class="mb-6">
        <v-col cols="12" md="4">
          <v-card class="rounded-xl border" flat color="#2A1A8E">
            <v-card-text class="text-white pa-6">
                <div class="text-caption font-weight-bold opacity-70 mb-2">ДОСТУПНЫЙ БАЛАНС</div>
                <div class="text-h3 font-weight-bold mb-4">{{ authStore.user?.balance || 0 }} ₽</div>
                <v-btn 
                    variant="flat" 
                    color="white" 
                    class="text-none text-indigo-darken-4 font-weight-bold"
                    rounded="lg"
                    prepend-icon="mdi-arrow-up-circle-outline"
                >
                    Вывести средства
                </v-btn>
            </v-card-text>
          </v-card>
        </v-col>
        
        <v-col cols="12" md="4">
          <v-card class="rounded-xl border bg-grey-lighten-5" flat>
            <v-card-text class="pa-6">
                <div class="text-caption font-weight-bold text-grey-darken-1 mb-2">В ОБРАБОТКЕ (ХОЛД)</div>
                <div class="text-h4 font-weight-bold text-grey-darken-3 mb-1">{{ authStore.user?.pendingBalance || 0 }} ₽</div>
                <div class="text-caption text-grey">Средства станут доступны после подтверждения доставки</div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- История транзакций -->
      <v-card class="rounded-xl border" flat>
        <v-card-title class="px-6 pt-6 pb-4 text-h6 font-weight-bold">История транзакций</v-card-title>
        
        <v-data-table
            :headers="headers"
            :items="transactions"
            hover
            class="fill-height rounded-0"
        >
            <template v-slot:item.amount="{ item }">
                <span :class="item.amount > 0 ? 'text-green-darken-1 font-weight-bold' : 'text-black'">
                    {{ item.amount > 0 ? '+' : '' }}{{ item.amount }} ₽
                </span>
            </template>
            <template v-slot:item.status="{ item }">
                 <v-chip size="small" :color="getStatusColor(item.status)" label class="font-weight-bold">
                     {{ getStatusText(item.status) }}
                 </v-chip>
            </template>
            <template v-slot:bottom>
                 <!-- Скрываем пагинацию если мало элементов -->
                 <div v-if="transactions.length > 10" class="pa-4"></div>
            </template>
        </v-data-table>
      </v-card>

    </v-container>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MainLayout from '@/layouts/MainLayout.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const headers = [
  { title: 'Дата', key: 'date', align: 'start' as const },
  { title: 'Описание', key: 'description' },
  { title: 'Магазин', key: 'store' },
  { title: 'Сумма', key: 'amount' },
  { title: 'Статус', key: 'status' },
]

interface Transaction {
  id: number
  date: string
  description: string
  store: string
  amount: number
  status: string
}

// Mock данные (Пусто)
const transactions = ref<Transaction[]>([])

const getStatusColor = (status: string) => {
    switch (status) {
        case 'success': return 'green'
        case 'pending': return 'orange'
        case 'failed': return 'red'
        default: return 'grey'
    }
}

const getStatusText = (status: string) => {
    switch (status) {
        case 'success': return 'Выполнено'
        case 'pending': return 'В обработке'
        case 'failed': return 'Ошибка'
        default: return status
    }
}
</script>
