import { api } from '@/services/api'
import type { ShopSettings } from '@/stores/shop'

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
        return await api.post<SaveSiteResponse>('/me/sites/save', data)
    },

    /**
     * Проверяет доступность поддомена
     */
    async checkSubdomain(subdomain: string): Promise<boolean> {
        try {
            const response = await api.get<{ available: boolean }>(`/sites/check-subdomain?subdomain=${subdomain}`)
            return response.available
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
        await api.post(`/me/sites/${siteId}/publish`, {})
    },

    /**
     * Получение дашборда (список сайтов?)
     * POST /me/dashboard
     */
    async getDashboard(): Promise<any> {
        return await api.post('/me/dashboard', {})
    }
}
