import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api, type PaginatedResponse } from '@/services/api'

// Интерфейс товара согласно спецификации API
export interface Product {
    id: number
    name: string
    description: string
    price: number
    compareAtPrice?: number // Цена до скидки
    sku?: string
    barcode?: string
    quantity: number
    status: 'active' | 'draft'
    categoryId?: number
    brandId?: number
    images: string[]
    createdAt?: string
    updatedAt?: string
}

export interface ProductFormData {
    name: string
    description: string
    price: number
    compareAtPrice?: number
    sku?: string
    barcode?: string
    quantity: number
    status: 'active' | 'draft'
    categoryId?: number
    brandId?: number
    images?: string[]
}

// Для разработки — мок данные
export const useProductsStore = defineStore('products', () => {
    // === STATE ===
    const products = ref<Product[]>([])
    const currentProduct = ref<Product | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)
    const total = ref(0)
    const page = ref(1)
    const limit = ref(20)

    // === COMPUTED ===
    const activeProducts = computed(() =>
        products.value.filter(p => p.status === 'active')
    )

    const draftProducts = computed(() =>
        products.value.filter(p => p.status === 'draft')
    )

    // === ACTIONS ===

    // Получить список товаров
    async function fetchProducts(params?: { page?: number; limit?: number }) {
        loading.value = true
        error.value = null

        try {
            // В режиме Site Builder товары загружаются вместе с конфигом сайта (через shop store)
            // Если они уже есть, просто возвращаем их
            if (products.value.length > 0) {
                total.value = products.value.length
                return
            }

            const queryParams = new URLSearchParams()
            if (params?.page) queryParams.set('page', String(params.page))
            if (params?.limit) queryParams.set('limit', String(params.limit))

            const response = await api.get<PaginatedResponse<Product>>(
                `/goods?${queryParams.toString()}`
            )

            products.value = response.data
            total.value = response.total
            page.value = response.page
            limit.value = response.limit
        } catch (e: any) {
            error.value = e.message || 'Ошибка загрузки товаров'
            console.error('fetchProducts error:', e)
        } finally {
            loading.value = false
        }
    }

    // Получить товар по ID
    async function fetchProductById(id: number): Promise<Product | null> {
        loading.value = true
        error.value = null

        try {
            // Сначала ищем в уже загруженных
            const localProduct = products.value.find(p => p.id === id)
            if (localProduct) {
                currentProduct.value = localProduct
                return localProduct
            }

            // Если нет, пробуем загрузить отдельно (возможно не сработает если нет эндпоинта)
            try {
                const product = await api.get<Product>(`/goods/${id}`)
                currentProduct.value = product
                return product
            } catch (innerError) {
                console.warn('Could not fetch product via API, returning null')
                return null
            }

        } catch (e: any) {
            error.value = e.message || 'Ошибка загрузки товара'
            console.error('fetchProductById error:', e)
            return null
        } finally {
            loading.value = false
        }
    }

    // Установить товары (вызывается из shop store)
    function setProducts(newProducts: Product[]) {
        products.value = newProducts
        total.value = newProducts.length
    }

    // Создать товар
    async function createProduct(data: ProductFormData): Promise<Product | null> {
        loading.value = true
        error.value = null

        try {
            const product = await api.post<Product>('/goods', data)
            products.value.push(product)
            return product
        } catch (e: any) {
            error.value = e.message || 'Ошибка создания товара'
            console.error('createProduct error:', e)
            return null
        } finally {
            loading.value = false
        }
    }

    // Обновить товар
    async function updateProduct(id: number, data: Partial<ProductFormData>): Promise<Product | null> {
        loading.value = true
        error.value = null

        try {
            const product = await api.patch<Product>(`/goods/${id}`, data)
            const index = products.value.findIndex(p => p.id === id)
            if (index !== -1) {
                products.value[index] = product
            }
            return product
        } catch (e: any) {
            error.value = e.message || 'Ошибка обновления товара'
            console.error('updateProduct error:', e)
            return null
        } finally {
            loading.value = false
        }
    }

    // Удалить товар
    async function deleteProduct(id: number): Promise<boolean> {
        loading.value = true
        error.value = null

        try {
            await api.delete(`/goods/${id}`)
            products.value = products.value.filter(p => p.id !== id)
            return true
        } catch (e: any) {
            error.value = e.message || 'Ошибка удаления товара'
            console.error('deleteProduct error:', e)
            return false
        } finally {
            loading.value = false
        }
    }

    // Очистить текущий товар
    function clearCurrentProduct() {
        currentProduct.value = null
    }

    return {
        // State
        products,
        currentProduct,
        loading,
        error,
        total,
        page,
        limit,

        // Computed
        activeProducts,
        draftProducts,
        // Actions
        fetchProducts,
        fetchProductById,
        createProduct,
        updateProduct,
        deleteProduct,
        clearCurrentProduct,
        setProducts
    }
})
