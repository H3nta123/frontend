import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/services/api'

export interface Balance {
    currency?: string
    amount?: number
    [key: string]: unknown
}

export const useBalanceStore = defineStore('balance', () => {
    // === STATE ===
    const balances = ref<Balance[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    // === ACTIONS ===

    /**
     * Получить балансы пользователя
     * GET /me/balances
     */
    async function fetchBalances(): Promise<Balance[]> {
        loading.value = true
        error.value = null

        try {
            const response = await api.get<Balance[]>('/me/balances')
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

    return {
        // State
        balances,
        loading,
        error,
        // Actions
        fetchBalances,
    }
})
