import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api, type PaginatedResponse } from '@/services/api'

// Интерфейс категории согласно спецификации API
export interface Category {
    id: number
    name: string
    parentId: number | null
    createdAt?: string
    updatedAt?: string
}

export interface CategoryFormData {
    name: string
    parentId: number | null
}

// Тип для узла дерева категорий
export interface CategoryTreeNode extends Category {
    children: CategoryTreeNode[]
}

// Для разработки — мок данные
// Для разработки — мок данные
const MOCK_CATEGORIES: Category[] = []

export const useCategoriesStore = defineStore('categories', () => {
    // === STATE ===
    const categories = ref<Category[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    // Режим разработки
    const useMocks = ref(true)

    // === COMPUTED ===

    // Корневые категории (без родителя)
    const rootCategories = computed(() =>
        categories.value.filter(c => c.parentId === null)
    )

    // Получить детей категории
    const getChildren = (parentId: number) => {
        return categories.value.filter(c => c.parentId === parentId)
    }

    // Построить дерево категорий
    const categoryTree = computed((): CategoryTreeNode[] => {
        const buildTree = (parentId: number | null): CategoryTreeNode[] => {
            return categories.value
                .filter(c => c.parentId === parentId)
                .map(c => ({
                    ...c,
                    children: buildTree(c.id)
                }))
        }
        return buildTree(null)
    })

    // === ACTIONS ===

    // Получить список категорий
    async function fetchCategories() {
        loading.value = true
        error.value = null

        try {
            if (useMocks.value) {
                await new Promise(resolve => setTimeout(resolve, 300))
                categories.value = [...MOCK_CATEGORIES]
                return
            }

            const response = await api.get<PaginatedResponse<Category>>('/good-categories')
            categories.value = response.data
        } catch (e: any) {
            error.value = e.message || 'Ошибка загрузки категорий'
            console.error('fetchCategories error:', e)
        } finally {
            loading.value = false
        }
    }

    // Получить категорию по ID
    async function fetchCategoryById(id: number): Promise<Category | null> {
        try {
            if (useMocks.value) {
                return MOCK_CATEGORIES.find(c => c.id === id) || null
            }

            return await api.get<Category>(`/good-categories/${id}`)
        } catch (e: any) {
            error.value = e.message || 'Ошибка загрузки категории'
            return null
        }
    }

    // Создать категорию
    async function createCategory(data: CategoryFormData): Promise<Category | null> {
        loading.value = true
        error.value = null

        try {
            if (useMocks.value) {
                await new Promise(resolve => setTimeout(resolve, 300))
                const newCategory: Category = {
                    ...data,
                    id: Math.max(...MOCK_CATEGORIES.map(c => c.id)) + 1,
                    createdAt: new Date().toISOString(),
                }
                MOCK_CATEGORIES.push(newCategory)
                categories.value = [...MOCK_CATEGORIES]
                return newCategory
            }

            const category = await api.post<Category>('/good-categories', data)
            categories.value.push(category)
            return category
        } catch (e: any) {
            error.value = e.message || 'Ошибка создания категории'
            return null
        } finally {
            loading.value = false
        }
    }

    // Обновить категорию
    async function updateCategory(id: number, data: Partial<CategoryFormData>): Promise<Category | null> {
        loading.value = true
        error.value = null

        try {
            if (useMocks.value) {
                await new Promise(resolve => setTimeout(resolve, 300))
                const index = MOCK_CATEGORIES.findIndex(c => c.id === id)
                if (index !== -1) {
                    const existingCategory = MOCK_CATEGORIES[index]
                    MOCK_CATEGORIES[index] = {
                        id: existingCategory.id,
                        name: data.name !== undefined ? data.name : existingCategory.name,
                        parentId: data.parentId !== undefined ? data.parentId : existingCategory.parentId,
                        createdAt: existingCategory.createdAt,
                        updatedAt: new Date().toISOString()
                    }
                    categories.value = [...MOCK_CATEGORIES]
                    return MOCK_CATEGORIES[index]
                }
                return null
            }

            const category = await api.patch<Category>(`/good-categories/${id}`, data)
            const index = categories.value.findIndex(c => c.id === id)
            if (index !== -1) {
                categories.value[index] = category
            }
            return category
        } catch (e: any) {
            error.value = e.message || 'Ошибка обновления категории'
            return null
        } finally {
            loading.value = false
        }
    }

    // Удалить категорию
    async function deleteCategory(id: number): Promise<boolean> {
        loading.value = true
        error.value = null

        try {
            if (useMocks.value) {
                await new Promise(resolve => setTimeout(resolve, 300))
                const index = MOCK_CATEGORIES.findIndex(c => c.id === id)
                if (index !== -1) {
                    // Также удаляем дочерние категории
                    const idsToDelete = [id]
                    const findChildren = (parentId: number) => {
                        MOCK_CATEGORIES.filter(c => c.parentId === parentId).forEach(c => {
                            idsToDelete.push(c.id)
                            findChildren(c.id)
                        })
                    }
                    findChildren(id)

                    idsToDelete.forEach(idToDelete => {
                        const idx = MOCK_CATEGORIES.findIndex(c => c.id === idToDelete)
                        if (idx !== -1) MOCK_CATEGORIES.splice(idx, 1)
                    })

                    categories.value = [...MOCK_CATEGORIES]
                    return true
                }
                return false
            }

            await api.delete(`/good-categories/${id}`)
            categories.value = categories.value.filter(c => c.id !== id)
            return true
        } catch (e: any) {
            error.value = e.message || 'Ошибка удаления категории'
            return false
        } finally {
            loading.value = false
        }
    }

    return {
        // State
        categories,
        loading,
        error,
        useMocks,
        // Computed
        rootCategories,
        categoryTree,
        // Methods
        getChildren,
        // Actions
        fetchCategories,
        fetchCategoryById,
        createCategory,
        updateCategory,
        deleteCategory,
    }
})
