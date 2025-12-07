import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Review {
    id: number
    productId: number
    authorName: string
    rating: number // 1-5
    text: string
    createdAt: string
}

// Мок данные
const MOCK_REVIEWS: Review[] = [
    { id: 1, productId: 1, authorName: 'Иван П.', rating: 5, text: 'Отличная футболка! Качество на высоте, размер подошёл идеально.', createdAt: '2024-12-05T10:00:00Z' },
    { id: 2, productId: 1, authorName: 'Мария К.', rating: 4, text: 'Хороший товар, но доставка немного затянулась.', createdAt: '2024-12-03T14:30:00Z' },
    { id: 3, productId: 2, authorName: 'Алексей С.', rating: 5, text: 'Кепка супер! Буду заказывать ещё.', createdAt: '2024-12-01T09:00:00Z' },
    { id: 4, productId: 3, authorName: 'Елена В.', rating: 5, text: 'Худи очень тёплое и стильное. Рекомендую!', createdAt: '2024-11-28T16:45:00Z' },
    { id: 5, productId: 3, authorName: 'Дмитрий Л.', rating: 4, text: 'Хорошее качество материала.', createdAt: '2024-11-25T11:20:00Z' },
    { id: 6, productId: 4, authorName: 'Анна М.', rating: 3, text: 'Джинсы неплохие, но размер немного больше заявленного.', createdAt: '2024-11-20T12:00:00Z' },
]

export const useReviewsStore = defineStore('reviews', () => {
    const reviews = ref<Review[]>([...MOCK_REVIEWS])
    const loading = ref(false)

    // Получить отзывы по товару
    const getReviewsByProductId = (productId: number) => {
        return reviews.value.filter(r => r.productId === productId)
    }

    // Средний рейтинг товара
    const getAverageRating = (productId: number): number => {
        const productReviews = getReviewsByProductId(productId)
        if (productReviews.length === 0) return 0
        const sum = productReviews.reduce((acc, r) => acc + r.rating, 0)
        return Math.round((sum / productReviews.length) * 10) / 10
    }

    // Количество отзывов
    const getReviewsCount = (productId: number): number => {
        return reviews.value.filter(r => r.productId === productId).length
    }

    // Добавить отзыв
    const addReview = async (data: { productId: number; authorName: string; rating: number; text: string }): Promise<Review> => {
        loading.value = true

        await new Promise(resolve => setTimeout(resolve, 500))

        const newReview: Review = {
            id: Math.max(...reviews.value.map(r => r.id), 0) + 1,
            productId: data.productId,
            authorName: data.authorName,
            rating: data.rating,
            text: data.text,
            createdAt: new Date().toISOString()
        }

        reviews.value.unshift(newReview)
        loading.value = false

        return newReview
    }

    return {
        reviews,
        loading,
        getReviewsByProductId,
        getAverageRating,
        getReviewsCount,
        addReview,
    }
})
