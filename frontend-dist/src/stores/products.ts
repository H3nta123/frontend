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
const MOCK_PRODUCTS: Product[] = [
    { id: 1, name: 'Футболка Oversize', description: 'Удобная футболка', price: 2500, quantity: 10, status: 'active', images: [] },
    { id: 2, name: 'Кепка Brand', description: 'Стильная кепка', price: 1200, quantity: 25, status: 'active', images: [] },
    { id: 3, name: 'Худи Streetwear', description: 'Теплое худи', price: 4500, quantity: 15, status: 'active', images: [] },
    { id: 4, name: 'Джинсы Slim Fit', description: 'Классические джинсы', price: 5200, quantity: 8, status: 'active', images: [] },
    { id: 5, name: 'Кроссовки Urban', description: 'Городские кроссовки', price: 8900, quantity: 12, status: 'draft', images: [] },
]

export const useProductsStore = defineStore('products', () => {
    // === STATE ===
    const products = ref<Product[]>([])
    const currentProduct = ref<Product | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)
    const total = ref(0)
    const page = ref(1)
    const limit = ref(20)

    // Режим разработки — использовать моки
    const useMocks = ref(true) // Поменять на false когда бэкенд готов

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
            if (useMocks.value) {
                // Мок для разработки
                await new Promise(resolve => setTimeout(resolve, 300))
                products.value = [...MOCK_PRODUCTS]
                total.value = MOCK_PRODUCTS.length
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
            if (useMocks.value) {
                await new Promise(resolve => setTimeout(resolve, 200))
                const product = MOCK_PRODUCTS.find(p => p.id === id)
                currentProduct.value = product || null
                return product || null
            }

            const product = await api.get<Product>(`/goods/${id}`)
            currentProduct.value = product
            return product
        } catch (e: any) {
            error.value = e.message || 'Ошибка загрузки товара'
            console.error('fetchProductById error:', e)
            return null
        } finally {
            loading.value = false
        }
    }

    // Создать товар
    async function createProduct(data: ProductFormData): Promise<Product | null> {
        loading.value = true
        error.value = null

        try {
            if (useMocks.value) {
                await new Promise(resolve => setTimeout(resolve, 300))
                const newProduct: Product = {
                    ...data,
                    id: Math.max(...MOCK_PRODUCTS.map(p => p.id)) + 1,
                    images: data.images || [],
                    createdAt: new Date().toISOString(),
                }
                MOCK_PRODUCTS.push(newProduct)
                products.value = [...MOCK_PRODUCTS]
                return newProduct
            }

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
            if (useMocks.value) {
                await new Promise(resolve => setTimeout(resolve, 300))
                const index = MOCK_PRODUCTS.findIndex(p => p.id === id)
                if (index !== -1) {
                    MOCK_PRODUCTS[index] = { ...MOCK_PRODUCTS[index], ...data, updatedAt: new Date().toISOString() }
                    products.value = [...MOCK_PRODUCTS]
                    return MOCK_PRODUCTS[index]
                }
                return null
            }

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
            if (useMocks.value) {
                await new Promise(resolve => setTimeout(resolve, 300))
                const index = MOCK_PRODUCTS.findIndex(p => p.id === id)
                if (index !== -1) {
                    MOCK_PRODUCTS.splice(index, 1)
                    products.value = [...MOCK_PRODUCTS]
                    return true
                }
                return false
            }

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
        useMocks,
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
    }
})
