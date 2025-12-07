import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api, type PaginatedResponse } from '@/services/api'

// Интерфейс новости
export interface NewsItem {
    id: number
    title: string
    content: string
    imageUrl?: string
    isPublished: boolean
    createdAt?: string
    updatedAt?: string
}

export interface NewsFormData {
    title: string
    content: string
    imageUrl?: string
    isPublished: boolean
}

// Мок данные для разработки
const MOCK_NEWS: NewsItem[] = [
    {
        id: 1,
        title: 'Открытие нового магазина',
        content: 'Рады сообщить об открытии нашего нового магазина в центре города!',
        isPublished: true,
        createdAt: '2024-12-01T10:00:00Z'
    },
    {
        id: 2,
        title: 'Зимняя распродажа',
        content: 'С 15 декабря стартует большая зимняя распродажа. Скидки до 50%!',
        isPublished: true,
        createdAt: '2024-12-05T14:30:00Z'
    },
    {
        id: 3,
        title: 'Новая коллекция весна 2025',
        content: 'Скоро в продаже новая коллекция весна-лето 2025.',
        isPublished: false,
        createdAt: '2024-12-07T09:00:00Z'
    },
]

export const useNewsStore = defineStore('news', () => {
    // === STATE ===
    const news = ref<NewsItem[]>([])
    const currentNews = ref<NewsItem | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    // Режим разработки
    const useMocks = ref(true)

    // === ACTIONS ===

    // Получить список новостей
    async function fetchNews() {
        loading.value = true
        error.value = null

        try {
            if (useMocks.value) {
                await new Promise(resolve => setTimeout(resolve, 300))
                news.value = [...MOCK_NEWS]
                return
            }

            const response = await api.get<PaginatedResponse<NewsItem>>('/news')
            news.value = response.data
        } catch (e: any) {
            error.value = e.message || 'Ошибка загрузки новостей'
            console.error('fetchNews error:', e)
        } finally {
            loading.value = false
        }
    }

    // Получить новость по ID
    async function fetchNewsById(id: number): Promise<NewsItem | null> {
        loading.value = true
        try {
            if (useMocks.value) {
                await new Promise(resolve => setTimeout(resolve, 200))
                const item = MOCK_NEWS.find(n => n.id === id)
                currentNews.value = item || null
                return item || null
            }
            const item = await api.get<NewsItem>(`/news/${id}`)
            currentNews.value = item
            return item
        } catch (e: any) {
            error.value = e.message || 'Ошибка загрузки новости'
            return null
        } finally {
            loading.value = false
        }
    }

    // Создать новость
    async function createNews(data: NewsFormData): Promise<NewsItem | null> {
        loading.value = true
        error.value = null

        try {
            if (useMocks.value) {
                await new Promise(resolve => setTimeout(resolve, 300))
                const newItem: NewsItem = {
                    ...data,
                    id: Math.max(...MOCK_NEWS.map(n => n.id), 0) + 1,
                    createdAt: new Date().toISOString(),
                }
                MOCK_NEWS.unshift(newItem)
                news.value = [...MOCK_NEWS]
                return newItem
            }

            const item = await api.post<NewsItem>('/news', data)
            news.value.unshift(item)
            return item
        } catch (e: any) {
            error.value = e.message || 'Ошибка создания новости'
            return null
        } finally {
            loading.value = false
        }
    }

    // Обновить новость
    async function updateNews(id: number, data: NewsFormData): Promise<NewsItem | null> {
        loading.value = true
        error.value = null

        try {
            if (useMocks.value) {
                await new Promise(resolve => setTimeout(resolve, 300))
                const index = MOCK_NEWS.findIndex(n => n.id === id)
                if (index !== -1) {
                    MOCK_NEWS[index] = {
                        ...MOCK_NEWS[index],
                        title: data.title,
                        content: data.content,
                        imageUrl: data.imageUrl,
                        isPublished: data.isPublished,
                        updatedAt: new Date().toISOString()
                    }
                    news.value = [...MOCK_NEWS]
                    return MOCK_NEWS[index]
                }
                return null
            }

            const item = await api.patch<NewsItem>(`/news/${id}`, data)
            const index = news.value.findIndex(n => n.id === id)
            if (index !== -1) {
                news.value[index] = item
            }
            return item
        } catch (e: any) {
            error.value = e.message || 'Ошибка обновления новости'
            return null
        } finally {
            loading.value = false
        }
    }

    // Удалить новость
    async function deleteNews(id: number): Promise<boolean> {
        loading.value = true
        error.value = null

        try {
            if (useMocks.value) {
                await new Promise(resolve => setTimeout(resolve, 300))
                const index = MOCK_NEWS.findIndex(n => n.id === id)
                if (index !== -1) {
                    MOCK_NEWS.splice(index, 1)
                    news.value = [...MOCK_NEWS]
                    return true
                }
                return false
            }

            await api.delete(`/news/${id}`)
            news.value = news.value.filter(n => n.id !== id)
            return true
        } catch (e: any) {
            error.value = e.message || 'Ошибка удаления новости'
            return false
        } finally {
            loading.value = false
        }
    }

    // Очистить текущую новость
    function clearCurrentNews() {
        currentNews.value = null
    }

    return {
        // State
        news,
        currentNews,
        loading,
        error,
        useMocks,
        // Actions
        fetchNews,
        fetchNewsById,
        createNews,
        updateNews,
        deleteNews,
        clearCurrentNews,
    }
})
