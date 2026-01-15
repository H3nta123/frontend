import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '@/services/api'

export interface BalanceResponse {
    balances: Record<string, number>
}

export const useBalanceStore = defineStore('balance', () => {
    // === STATE ===
    const balances = ref<BalanceResponse | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    // === COMPUTED ===
    const availableBalance = computed(() => {
        if (!balances.value || !balances.value.balances) return 0
        return Object.values(balances.value.balances).reduce((sum, amount) => sum + (Number(amount) || 0), 0)
    })

    // === ACTIONS ===

    /**
     * Получить балансы пользователя
     * GET /me/balances
     */
    async function fetchBalances() {
        loading.value = true
        error.value = null

        try {
            const response = await api.get<BalanceResponse>('/me/sellers/balances')
            balances.value = response
            return response
        } catch (e: any) {
            error.value = e.message || 'Ошибка загрузки балансов'
            console.error('fetchBalances error:', e)
            return []
        } finally {
            loading.value = false
        }
    }

    let pollingInterval: any = null

    function startPolling(intervalMs = 15000) {
        if (pollingInterval) return
        // Fetch immediately
        fetchBalances()
        pollingInterval = setInterval(() => {
            fetchBalances()
        }, intervalMs)
    }

    function stopPolling() {
        if (pollingInterval) {
            clearInterval(pollingInterval)
            pollingInterval = null
        }
    }

    return {
        // State
        balances,
        loading,
        error,
        availableBalance,
        // Actions
        fetchBalances,
        startPolling,
        stopPolling
    }
})
