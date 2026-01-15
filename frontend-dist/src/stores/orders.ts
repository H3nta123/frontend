import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api, type PaginatedResponse } from '@/services/api'

// Статусы заказов
export type OrderStatus = 'paid' | 'awaiting payment' | 'cancelled' | 'new'

export interface OrderItemsSummary {
    count: number
    title: string
}

export interface Order {
    id: string
    created_at: string
    items: OrderItemsSummary
    site_id: string
    site_name: string
    status: string // Используем string чтобы не ломаться от новых статусов
    total_amount: number
}

export const useOrdersStore = defineStore('orders', () => {
    // === STATE ===
    const orders = ref<Order[]>([])
    const currentOrder = ref<Order | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    // === COMPUTED ===
    const newOrdersCount = computed(() =>
        orders.value.filter(o => o.status === 'awaiting payment' || o.status === 'new').length
    )

    // === ACTIONS ===

    async function fetchOrders() {
        loading.value = true
        error.value = null

        try {
            // Ожидаем { orders: Order[] }
            const response = await api.get<{ orders: Order[] }>('/me/orders/statuses')
            // Если придет null или что-то странное
            orders.value = response.orders || []
        } catch (e: any) {
            error.value = e.message || 'Ошибка загрузки заказов'
            console.error('fetchOrders error:', e)
        } finally {
            loading.value = false
        }
    }

    // Остальные методы пока закомментируем или упростим, так как структура поменялась кардинально
    // и старые методы updateOrderStatus / fetchOrderById могут не работать с новым API

    return {
        orders,
        currentOrder,
        loading,
        error,
        newOrdersCount,
        fetchOrders
    }
})
