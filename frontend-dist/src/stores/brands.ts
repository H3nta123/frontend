import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api, type PaginatedResponse } from '@/services/api'

// Интерфейс бренда/производителя
export interface Brand {
    id: number
    name: string
    description?: string
    logoUrl?: string
    createdAt?: string
    updatedAt?: string
}

export interface BrandFormData {
    name: string
    description?: string
    logoUrl?: string
}

// Мок данные для разработки
const MOCK_BRANDS: Brand[] = [
    { id: 1, name: 'Nike', description: 'Американский производитель спортивной одежды', logoUrl: '' },
    { id: 2, name: 'Adidas', description: 'Немецкий производитель спортивных товаров', logoUrl: '' },
    { id: 3, name: 'Puma', description: 'Немецкий производитель спортивной одежды и обуви', logoUrl: '' },
    { id: 4, name: 'Reebok', description: 'Производитель спортивной обуви и одежды', logoUrl: '' },
    { id: 5, name: 'New Balance', description: 'Американский производитель спортивной обуви', logoUrl: '' },
]

export const useBrandsStore = defineStore('brands', () => {
    // === STATE ===
    const brands = ref<Brand[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    // Режим разработки
    const useMocks = ref(true)

    // === ACTIONS ===

    // Получить список брендов
    async function fetchBrands() {
        loading.value = true
        error.value = null

        try {
            if (useMocks.value) {
                await new Promise(resolve => setTimeout(resolve, 300))
                brands.value = [...MOCK_BRANDS]
                return
            }

            const response = await api.get<PaginatedResponse<Brand>>('/brands')
            brands.value = response.data
        } catch (e: any) {
            error.value = e.message || 'Ошибка загрузки брендов'
            console.error('fetchBrands error:', e)
        } finally {
            loading.value = false
        }
    }

    // Получить бренд по ID
    async function fetchBrandById(id: number): Promise<Brand | null> {
        try {
            if (useMocks.value) {
                return MOCK_BRANDS.find(b => b.id === id) || null
            }
            return await api.get<Brand>(`/brands/${id}`)
        } catch (e: any) {
            error.value = e.message || 'Ошибка загрузки бренда'
            return null
        }
    }

    // Создать бренд
    async function createBrand(data: BrandFormData): Promise<Brand | null> {
        loading.value = true
        error.value = null

        try {
            if (useMocks.value) {
                await new Promise(resolve => setTimeout(resolve, 300))
                const newBrand: Brand = {
                    ...data,
                    id: Math.max(...MOCK_BRANDS.map(b => b.id), 0) + 1,
                    createdAt: new Date().toISOString(),
                }
                MOCK_BRANDS.push(newBrand)
                brands.value = [...MOCK_BRANDS]
                return newBrand
            }

            const brand = await api.post<Brand>('/brands', data)
            brands.value.push(brand)
            return brand
        } catch (e: any) {
            error.value = e.message || 'Ошибка создания бренда'
            return null
        } finally {
            loading.value = false
        }
    }

    // Обновить бренд
    async function updateBrand(id: number, data: BrandFormData): Promise<Brand | null> {
        loading.value = true
        error.value = null

        try {
            if (useMocks.value) {
                await new Promise(resolve => setTimeout(resolve, 300))
                const index = MOCK_BRANDS.findIndex(b => b.id === id)
                if (index !== -1) {
                    MOCK_BRANDS[index] = {
                        ...MOCK_BRANDS[index],
                        name: data.name,
                        description: data.description,
                        logoUrl: data.logoUrl,
                        updatedAt: new Date().toISOString()
                    }
                    brands.value = [...MOCK_BRANDS]
                    return MOCK_BRANDS[index]
                }
                return null
            }

            const brand = await api.patch<Brand>(`/brands/${id}`, data)
            const index = brands.value.findIndex(b => b.id === id)
            if (index !== -1) {
                brands.value[index] = brand
            }
            return brand
        } catch (e: any) {
            error.value = e.message || 'Ошибка обновления бренда'
            return null
        } finally {
            loading.value = false
        }
    }

    // Удалить бренд
    async function deleteBrand(id: number): Promise<boolean> {
        loading.value = true
        error.value = null

        try {
            if (useMocks.value) {
                await new Promise(resolve => setTimeout(resolve, 300))
                const index = MOCK_BRANDS.findIndex(b => b.id === id)
                if (index !== -1) {
                    MOCK_BRANDS.splice(index, 1)
                    brands.value = [...MOCK_BRANDS]
                    return true
                }
                return false
            }

            await api.delete(`/brands/${id}`)
            brands.value = brands.value.filter(b => b.id !== id)
            return true
        } catch (e: any) {
            error.value = e.message || 'Ошибка удаления бренда'
            return false
        } finally {
            loading.value = false
        }
    }

    return {
        // State
        brands,
        loading,
        error,
        useMocks,
        // Actions
        fetchBrands,
        fetchBrandById,
        createBrand,
        updateBrand,
        deleteBrand,
    }
})
