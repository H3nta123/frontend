import { api } from '@/services/api'

export interface CreatePaymentRequest {
    site_id: string
    description: string
    return_url: string
}

export interface PaymentResponse {
    confirmation_url: string
    payment_id: string
    status: string
}

export interface BasketPaymentItem {
    title: string
    count: number
}

export interface BasketPaymentRequest {
    items: BasketPaymentItem
    total_amount: number
    return_url: string
    description: string
    email: string
}

export interface BasketPaymentResponse {
    confirmation_url?: string
    payment_id?: string
    status?: string
}

export const paymentsService = {
    /**
     * Создать платеж для активации поддомена
     * POST /payment/create
     */
    async createPayment(data: CreatePaymentRequest): Promise<PaymentResponse> {
        return await api.post<PaymentResponse>('/me/payment/create', data)
    },

    /**
     * Создать платеж для корзины
     * POST /basket/payment
     */
    async createBasketPayment(data: BasketPaymentRequest): Promise<BasketPaymentResponse> {
        return await api.post<BasketPaymentResponse>('/basket/payment', data)
    }
}
