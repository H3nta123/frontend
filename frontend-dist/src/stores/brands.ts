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

// Мок данные удалены

export const useBrandsStore = defineStore('brands', () => {
    // === STATE ===
    const brands = ref<Brand[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    // === ACTIONS ===

    // Получить список брендов
    async function fetchBrands() {
        loading.value = true
        error.value = null

        try {
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
        // Actions
        fetchBrands,
        fetchBrandById,
        createBrand,
        updateBrand,
        deleteBrand,
    }
})
