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
                <div class="text-h3 font-weight-bold mb-4">
                    <v-progress-circular v-if="loading" indeterminate color="white" size="32"></v-progress-circular>
                    <span v-else>{{ availableBalance }} ₽</span>
                </div>
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

    </v-container>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import MainLayout from '@/layouts/MainLayout.vue'
import { useAuthStore } from '@/stores/auth'
import { useBalanceStore } from '@/stores/balance'

const authStore = useAuthStore()
const balanceStore = useBalanceStore()

const loading = ref(true)

// Суммируем все балансы, которые пришли с API /me/sellers/balances
// Суммируем все балансы, которые пришли с API /me/sellers/balances
const availableBalance = computed(() => {
    const data = balanceStore.balances
    if (!data || !data.balances) return 0
    
    // Суммируем значения всех ключей в объекте balances
    return Object.values(data.balances).reduce((sum, amount) => {
        return sum + (Number(amount) || 0)
    }, 0)
})

onMounted(async () => {
    loading.value = true
    try {
        await balanceStore.fetchBalances()
    } finally {
        loading.value = false
    }
})
</script>
