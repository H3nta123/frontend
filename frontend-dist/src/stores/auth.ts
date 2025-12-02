import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // --- СОСТОЯНИЕ (STATE) ---

  // ВРЕМЕННО: ставим true для разработки (чтобы видеть админку сразу)
  const isAuthenticated = ref(true)

  // Для продакшена (когда будет бэкенд) нужно раскомментировать эту строку и закомментировать верхнюю:
  // const isAuthenticated = ref(localStorage.getItem('is_authenticated') === 'true')

  const token = ref(localStorage.getItem('jwt_token') || null)
  const loading = ref(false)
  const error = ref('')

  const user = ref({
    email: 'admin@example.com',
    name: 'Никита',
    role: 'owner'
  })

  // --- ДЕЙСТВИЯ (ACTIONS) ---

  // 1. Отправка email для получения кода
  const sendLoginRequest = async (email: string) => {
    loading.value = true
    error.value = ''
    try {
      /*
      // URL: https://b7ed89ec-b77d-4be3-a1ef-ee9df24158c9.tunnel4.com/api/v1/auth/login
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData.detail || 'Ошибка запроса')
      }
      */

      // Имитация успешного ответа сервера (задержка 1с)
      await new Promise(resolve => setTimeout(resolve, 1000));
      return true
    } catch (e: any) {
      console.error(e)
      error.value = e.message || 'Ошибка сети'
      return false
    } finally {
      loading.value = false
    }
  }

  // 2. Подтверждение кода
  const verifyCode = async (email: string, code: string) => {
    loading.value = true
    error.value = ''
    try {
      /*
      // URL: https://b7ed89ec-b77d-4be3-a1ef-ee9df24158c9.tunnel4.com/api/v1/auth/confirm
      const payload = {
        email: email,
        code: code
      }

      const response = await fetch('/api/v1/auth/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData.detail || 'Неверный код')
      }

      const userData = await response.json()

      // Успешный вход
      isAuthenticated.value = true
      localStorage.setItem('is_authenticated', 'true')

      if (userData.token) {
        token.value = userData.token
        localStorage.setItem('jwt_token', userData.token)
      }

      if (userData.user) {
        user.value = userData.user
      }
      */

      // Имитация успешного входа
      await new Promise(resolve => setTimeout(resolve, 1000));

      isAuthenticated.value = true;
      localStorage.setItem('is_authenticated', 'true');

      return true
    } catch (e: any) {
      console.error(e)
      error.value = e.message || 'Ошибка подтверждения'
      return false
    } finally {
      loading.value = false
    }
  }

  // 3. Выход из системы
  const logout = () => {
    token.value = null
    isAuthenticated.value = false
    user.value = { email: '', name: '', role: '' }

    localStorage.removeItem('is_authenticated')
    localStorage.removeItem('jwt_token')
  }

  return {
    token,
    isAuthenticated,
    loading,
    error,
    user,
    sendLoginRequest,
    verifyCode,
    logout
  }
})
