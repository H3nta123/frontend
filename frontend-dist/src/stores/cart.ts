import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface CartItem {
    productId: string | number
    name: string
    price: number
    image?: string
    quantity: number
}

export interface DeliveryMethod {
    id: string
    name: string
    price: number
    description: string
    estimatedDays: string
}

export const DELIVERY_METHODS: DeliveryMethod[] = [
    { id: 'pickup', name: 'Самовывоз', price: 0, description: 'Бесплатно', estimatedDays: 'Сегодня' },
    { id: 'courier', name: 'Курьер', price: 350, description: 'Доставка по городу', estimatedDays: '1-2 дня' },
    { id: 'cdek', name: 'СДЭК', price: 450, description: 'Пункт выдачи', estimatedDays: '3-5 дней' },
    { id: 'post', name: 'Почта России', price: 300, description: 'Почтовое отделение', estimatedDays: '7-14 дней' },
]

export const useCartStore = defineStore('cart', () => {
    // === STATE ===
    const items = ref<CartItem[]>([])
    const isOpen = ref(false)
    const selectedDelivery = ref<string>('pickup')

    // Данные покупателя для checkout
    const customerInfo = ref({
        name: '',
        phone: '',
        email: '',
        address: '',
        comment: ''
    })

    // === COMPUTED ===

    // Общее количество товаров
    const totalItems = computed(() =>
        items.value.reduce((sum, item) => sum + item.quantity, 0)
    )

    // Сумма товаров
    const subtotal = computed(() =>
        items.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    )

    // Стоимость доставки
    const deliveryPrice = computed(() => {
        const method = DELIVERY_METHODS.find(m => m.id === selectedDelivery.value)
        return method?.price || 0
    })

    // Итого
    const total = computed(() => subtotal.value + deliveryPrice.value)

    // Выбранный способ доставки
    const deliveryMethod = computed(() =>
        DELIVERY_METHODS.find(m => m.id === selectedDelivery.value)
    )

    // === ACTIONS ===

    // Добавить товар в корзину
    function addItem(product: { id: string | number, name: string, price: number, image?: string }) {
        const existing = items.value.find(item => item.productId === product.id)

        if (existing) {
            existing.quantity++
        } else {
            items.value.push({
                productId: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            })
        }

        // Показать корзину
        isOpen.value = true
    }

    // Удалить товар из корзины
    function removeItem(productId: string | number) {
        const index = items.value.findIndex(item => item.productId === productId)
        if (index !== -1) {
            items.value.splice(index, 1)
        }
    }

    // Увеличить количество
    function incrementQuantity(productId: string | number) {
        const item = items.value.find(item => item.productId === productId)
        if (item) {
            item.quantity++
        }
    }

    // Уменьшить количество
    function decrementQuantity(productId: string | number) {
        const item = items.value.find(item => item.productId === productId)
        if (item && item.quantity > 1) {
            item.quantity--
        } else if (item) {
            removeItem(productId)
        }
    }

    // Очистить корзину
    function clearCart() {
        items.value = []
    }

    // Открыть/закрыть корзину
    function toggleCart() {
        isOpen.value = !isOpen.value
    }

    function openCart() {
        isOpen.value = true
    }

    function closeCart() {
        isOpen.value = false
    }

    // Сброс данных покупателя
    function resetCustomerInfo() {
        customerInfo.value = {
            name: '',
            phone: '',
            email: '',
            address: '',
            comment: ''
        }
    }

    return {
        // State
        items,
        isOpen,
        selectedDelivery,
        customerInfo,
        // Computed
        totalItems,
        subtotal,
        deliveryPrice,
        total,
        deliveryMethod,
        // Actions
        addItem,
        removeItem,
        incrementQuantity,
        decrementQuantity,
        clearCart,
        toggleCart,
        openCart,
        closeCart,
        resetCustomerInfo,
    }
})
