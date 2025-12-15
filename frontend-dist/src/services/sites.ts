import axios from 'axios'
import type { ShopSettings } from '@/stores/shop'

// URL API
const API_URL = '/api/v1'

export interface SaveSiteRequest {
    subdomain: string
    pattern: string
    config: ShopSettings
}

export interface SaveSiteResponse {
    id: string
    subdomain: string
    config: ShopSettings
    status: string
}

export const sitesService = {
    /**
     * Сохраняет настройки сайта (Save Draft)
     * POST /me/sites/save
     */
    async saveSite(data: SaveSiteRequest): Promise<SaveSiteResponse> {
        try {
            const token = localStorage.getItem('jwt_token')
            const headers = token ? { Authorization: `Bearer ${token}` } : {}

            const response = await axios.post<SaveSiteResponse>(`${API_URL}/me/sites/save`, data, {
                headers
            })
            return response.data
        } catch (error) {
            console.error('Ошибка при сохранении сайта:', error)
            throw error
        }
    },

    /**
     * Проверяет доступность поддомена
     */
    async checkSubdomain(subdomain: string): Promise<boolean> {
        try {
            const response = await axios.get<{ available: boolean }>(`${API_URL}/sites/check-subdomain`, {
                params: { subdomain }
            })
            return response.data.available
        } catch (error) {
            console.error('Ошибка проверки поддомена:', error)
            return false
        }
    },

    /**
     * Публикация сайта
     * POST /me/sites/{id}/publish
     */
    async publishSite(siteId: string): Promise<void> {
        const token = localStorage.getItem('jwt_token')
        const headers = token ? { Authorization: `Bearer ${token}` } : {}
        await axios.post(`${API_URL}/me/sites/${siteId}/publish`, {}, { headers })
    },

    /**
     * Получение дашборда (список сайтов?)
     * POST /me/dashboard
     */
    async getDashboard(): Promise<any> {
        const token = localStorage.getItem('jwt_token')
        const headers = token ? { Authorization: `Bearer ${token}` } : {}
        const response = await axios.post(`${API_URL}/me/dashboard`, {}, { headers })
        return response.data
    }
}
