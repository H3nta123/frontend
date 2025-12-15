import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api, type PaginatedResponse } from '@/services/api'

// Статусы заказов
export type OrderStatus = 'new' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

export interface OrderItem {
    productId: number
    name: string
    price: number
    quantity: number
    image?: string
}

export interface Order {
    id: number
    orderNumber: string
    status: OrderStatus
    items: OrderItem[]
    subtotal: number
    deliveryPrice: number
    total: number
    deliveryMethod: string
    customerName: string
    customerPhone: string
    customerEmail?: string
    address?: string
    comment?: string
    createdAt: string
    updatedAt?: string
}

// Мок данные
const MOCK_ORDERS: Order[] = []

export const useOrdersStore = defineStore('orders', () => {
    // === STATE ===
    const orders = ref<Order[]>([])
    const currentOrder = ref<Order | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    const useMocks = ref(true)

    // === COMPUTED ===

    const newOrdersCount = computed(() =>
        orders.value.filter(o => o.status === 'new').length
    )

    const ordersByStatus = computed(() => {
        const grouped: Record<OrderStatus, Order[]> = {
            new: [],
            processing: [],
            shipped: [],
            delivered: [],
            cancelled: []
        }
        orders.value.forEach(order => {
            grouped[order.status].push(order)
        })
        return grouped
    })

    // === ACTIONS ===

    async function fetchOrders() {
        loading.value = true
        error.value = null

        try {
            if (useMocks.value) {
                await new Promise(resolve => setTimeout(resolve, 300))
                orders.value = [...MOCK_ORDERS]
                return
            }

            const response = await api.get<PaginatedResponse<Order>>('/orders')
            orders.value = response.data
        } catch (e: any) {
            error.value = e.message || 'Ошибка загрузки заказов'
            console.error('fetchOrders error:', e)
        } finally {
            loading.value = false
        }
    }

    async function fetchOrderById(id: number): Promise<Order | null> {
        try {
            if (useMocks.value) {
                const order = MOCK_ORDERS.find(o => o.id === id)
                currentOrder.value = order || null
                return order || null
            }
            const order = await api.get<Order>(`/orders/${id}`)
            currentOrder.value = order
            return order
        } catch (e: any) {
            error.value = e.message || 'Ошибка загрузки заказа'
            return null
        }
    }

    async function updateOrderStatus(id: number, status: OrderStatus): Promise<boolean> {
        loading.value = true
        error.value = null

        try {
            if (useMocks.value) {
                await new Promise(resolve => setTimeout(resolve, 300))
                const index = MOCK_ORDERS.findIndex(o => o.id === id)
                if (index !== -1) {
                    MOCK_ORDERS[index].status = status
                    MOCK_ORDERS[index].updatedAt = new Date().toISOString()
                    orders.value = [...MOCK_ORDERS]
                    return true
                }
                return false
            }

            await api.patch(`/orders/${id}`, { status })
            const index = orders.value.findIndex(o => o.id === id)
            if (index !== -1) {
                orders.value[index].status = status
            }
            return true
        } catch (e: any) {
            error.value = e.message || 'Ошибка обновления статуса'
            return false
        } finally {
            loading.value = false
        }
    }

    // Создать заказ (из checkout)
    async function createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'status' | 'createdAt'>): Promise<Order | null> {
        loading.value = true
        error.value = null

        try {
            if (useMocks.value) {
                await new Promise(resolve => setTimeout(resolve, 300))
                const newOrder: Order = {
                    ...orderData,
                    id: Math.max(...MOCK_ORDERS.map(o => o.id), 0) + 1,
                    orderNumber: String(100000 + MOCK_ORDERS.length + 1),
                    status: 'new',
                    createdAt: new Date().toISOString()
                }
                MOCK_ORDERS.unshift(newOrder)
                orders.value = [...MOCK_ORDERS]
                return newOrder
            }

            const order = await api.post<Order>('/orders', orderData)
            orders.value.unshift(order)
            return order
        } catch (e: any) {
            error.value = e.message || 'Ошибка создания заказа'
            return null
        } finally {
            loading.value = false
        }
    }

    return {
        // State
        orders,
        currentOrder,
        loading,
        error,
        useMocks,
        // Computed
        newOrdersCount,
        ordersByStatus,
        // Actions
        fetchOrders,
        fetchOrderById,
        updateOrderStatus,
        createOrder,
    }
})
