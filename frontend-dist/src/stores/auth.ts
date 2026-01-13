import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/services/api'

interface User {
  email: string
  name: string
  role: string
  balance: number
  pendingBalance: number // Средства в холде/обработке
}

interface AuthConfirmResponse {
  accessToken: string
  token_type: string
  expires_in: number
}

export const useAuthStore = defineStore('auth', () => {
  // === STATE ===

  const isAuthenticated = ref(localStorage.getItem('is_authenticated') === 'true')

  const token = ref(localStorage.getItem('jwt_token') || null)
  const loading = ref(false)
  const error = ref('')

  const savedEmail = localStorage.getItem('user_email')
  const user = ref<User | null>(savedEmail ? {
    email: savedEmail,
    name: savedEmail,
    role: 'owner',
    balance: 0,
    pendingBalance: 0
  } : null)

  // === ACTIONS ===

  /**
   * Отправка email для получения одноразового кода
   * POST /api/v1/auth/login
   * Body: { email: string }
   */
  const sendLoginRequest = async (email: string): Promise<boolean> => {
    loading.value = true
    error.value = ''

    try {


      await api.post('/auth/login', { email })
      return true
    } catch (e: any) {
      console.error('sendLoginRequest error:', e)
      error.value = e.message || 'Ошибка отправки кода'
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * Подтверждение кода и получение токена
   * POST /api/v1/auth/confirm
   * Body: { email: string, code: string }
   * Response: { accessToken: string, ... }
   */
  const verifyCode = async (email: string, code: string): Promise<boolean> => {
    loading.value = true
    error.value = ''

    try {


      const response = await api.post<AuthConfirmResponse>('/auth/confirm', {
        email,
        code
      })

      // Успешный вход
      isAuthenticated.value = true
      localStorage.setItem('is_authenticated', 'true')

      // Бэкенд возвращает { accessToken, token_type, expires_in }
      if (response.accessToken) {
        token.value = response.accessToken
        localStorage.setItem('jwt_token', response.accessToken)
      }

      // Обновляем email
      user.value = {
        email: email,
        name: email,
        role: 'owner',
        balance: 0,
        pendingBalance: 0
      }
      localStorage.setItem('user_email', email)

      return true
    } catch (e: any) {
      console.error('verifyCode error:', e)
      error.value = e.message || 'Неверный код'
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * Выход из системы
   */
  const logout = () => {
    token.value = null
    isAuthenticated.value = false
    user.value = { email: '', name: '', role: '', balance: 0, pendingBalance: 0 }

    localStorage.removeItem('is_authenticated')
    localStorage.removeItem('jwt_token')
  }

  /**
   * Проверка авторизации при загрузке приложения
   */
  const checkAuth = () => {
    const savedAuth = localStorage.getItem('is_authenticated')
    const savedToken = localStorage.getItem('jwt_token')

    if (savedAuth === 'true' && savedToken) {
      isAuthenticated.value = true
      token.value = savedToken
    }
  }

  return {
    // State
    token,
    isAuthenticated,
    loading,
    error,
    user,
    // Actions
    sendLoginRequest,
    verifyCode,
    logout,
    checkAuth,
  }
})
