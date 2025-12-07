import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/services/api'

interface User {
  email: string
  name: string
  role: string
}

interface AuthConfirmResponse {
  token?: string
  user?: User
}

export const useAuthStore = defineStore('auth', () => {
  // === STATE ===

  // Для разработки: true = пропускаем авторизацию
  const useMocks = ref(true)

  const isAuthenticated = ref(
    useMocks.value ? true : localStorage.getItem('is_authenticated') === 'true'
  )

  const token = ref(localStorage.getItem('jwt_token') || null)
  const loading = ref(false)
  const error = ref('')

  const user = ref<User>({
    email: 'admin@example.com',
    name: 'Никита',
    role: 'owner'
  })

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
      if (useMocks.value) {
        // Имитация успешного ответа (задержка 1с)
        await new Promise(resolve => setTimeout(resolve, 1000))
        return true
      }

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
   * Response: { token?: string, user?: User }
   */
  const verifyCode = async (email: string, code: string): Promise<boolean> => {
    loading.value = true
    error.value = ''

    try {
      if (useMocks.value) {
        // Имитация успешного входа
        await new Promise(resolve => setTimeout(resolve, 1000))

        isAuthenticated.value = true
        localStorage.setItem('is_authenticated', 'true')
        user.value = {
          email: email,
          name: 'Пользователь',
          role: 'owner'
        }
        return true
      }

      const response = await api.post<AuthConfirmResponse>('/auth/confirm', {
        email,
        code
      })

      // Успешный вход
      isAuthenticated.value = true
      localStorage.setItem('is_authenticated', 'true')

      // Сохраняем токен если получили
      if (response.token) {
        token.value = response.token
        localStorage.setItem('jwt_token', response.token)
      }

      // Сохраняем данные пользователя
      if (response.user) {
        user.value = response.user
      }

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
    user.value = { email: '', name: '', role: '' }

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
    useMocks,
    // Actions
    sendLoginRequest,
    verifyCode,
    logout,
    checkAuth,
  }
})
