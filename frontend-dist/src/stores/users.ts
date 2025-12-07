import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api, type PaginatedResponse } from '@/services/api'

// Интерфейс пользователя
export interface User {
    id: number
    email: string
    name: string
    role: 'admin' | 'manager' | 'customer'
    isActive: boolean
    createdAt?: string
    updatedAt?: string
}

export interface UserFormData {
    email: string
    name: string
    role: 'admin' | 'manager' | 'customer'
    isActive: boolean
}

// Мок данные для разработки
const MOCK_USERS: User[] = [
    { id: 1, email: 'admin@example.com', name: 'Никита', role: 'admin', isActive: true, createdAt: '2024-01-15T10:00:00Z' },
    { id: 2, email: 'manager@example.com', name: 'Алексей', role: 'manager', isActive: true, createdAt: '2024-03-20T14:30:00Z' },
    { id: 3, email: 'user1@example.com', name: 'Мария', role: 'customer', isActive: true, createdAt: '2024-06-10T09:00:00Z' },
    { id: 4, email: 'user2@example.com', name: 'Иван', role: 'customer', isActive: false, createdAt: '2024-08-05T16:45:00Z' },
    { id: 5, email: 'user3@example.com', name: 'Елена', role: 'customer', isActive: true, createdAt: '2024-11-01T11:20:00Z' },
]

export const useUsersStore = defineStore('users', () => {
    // === STATE ===
    const users = ref<User[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    // Режим разработки
    const useMocks = ref(true)

    // === ACTIONS ===

    // Получить список пользователей
    async function fetchUsers() {
        loading.value = true
        error.value = null

        try {
            if (useMocks.value) {
                await new Promise(resolve => setTimeout(resolve, 300))
                users.value = [...MOCK_USERS]
                return
            }

            const response = await api.get<PaginatedResponse<User>>('/users')
            users.value = response.data
        } catch (e: any) {
            error.value = e.message || 'Ошибка загрузки пользователей'
            console.error('fetchUsers error:', e)
        } finally {
            loading.value = false
        }
    }

    // Получить пользователя по ID
    async function fetchUserById(id: number): Promise<User | null> {
        try {
            if (useMocks.value) {
                return MOCK_USERS.find(u => u.id === id) || null
            }
            return await api.get<User>(`/users/${id}`)
        } catch (e: any) {
            error.value = e.message || 'Ошибка загрузки пользователя'
            return null
        }
    }

    // Создать пользователя
    async function createUser(data: UserFormData): Promise<User | null> {
        loading.value = true
        error.value = null

        try {
            if (useMocks.value) {
                await new Promise(resolve => setTimeout(resolve, 300))
                const newUser: User = {
                    ...data,
                    id: Math.max(...MOCK_USERS.map(u => u.id), 0) + 1,
                    createdAt: new Date().toISOString(),
                }
                MOCK_USERS.push(newUser)
                users.value = [...MOCK_USERS]
                return newUser
            }

            const user = await api.post<User>('/users', data)
            users.value.push(user)
            return user
        } catch (e: any) {
            error.value = e.message || 'Ошибка создания пользователя'
            return null
        } finally {
            loading.value = false
        }
    }

    // Обновить пользователя
    async function updateUser(id: number, data: UserFormData): Promise<User | null> {
        loading.value = true
        error.value = null

        try {
            if (useMocks.value) {
                await new Promise(resolve => setTimeout(resolve, 300))
                const index = MOCK_USERS.findIndex(u => u.id === id)
                if (index !== -1) {
                    MOCK_USERS[index] = {
                        ...MOCK_USERS[index],
                        email: data.email,
                        name: data.name,
                        role: data.role,
                        isActive: data.isActive,
                        updatedAt: new Date().toISOString()
                    }
                    users.value = [...MOCK_USERS]
                    return MOCK_USERS[index]
                }
                return null
            }

            const user = await api.patch<User>(`/users/${id}`, data)
            const index = users.value.findIndex(u => u.id === id)
            if (index !== -1) {
                users.value[index] = user
            }
            return user
        } catch (e: any) {
            error.value = e.message || 'Ошибка обновления пользователя'
            return null
        } finally {
            loading.value = false
        }
    }

    // Удалить пользователя
    async function deleteUser(id: number): Promise<boolean> {
        loading.value = true
        error.value = null

        try {
            if (useMocks.value) {
                await new Promise(resolve => setTimeout(resolve, 300))
                const index = MOCK_USERS.findIndex(u => u.id === id)
                if (index !== -1) {
                    MOCK_USERS.splice(index, 1)
                    users.value = [...MOCK_USERS]
                    return true
                }
                return false
            }

            await api.delete(`/users/${id}`)
            users.value = users.value.filter(u => u.id !== id)
            return true
        } catch (e: any) {
            error.value = e.message || 'Ошибка удаления пользователя'
            return false
        } finally {
            loading.value = false
        }
    }

    // Переключить статус активности
    async function toggleUserStatus(id: number): Promise<boolean> {
        const user = users.value.find(u => u.id === id)
        if (!user) return false

        const result = await updateUser(id, {
            email: user.email,
            name: user.name,
            role: user.role,
            isActive: !user.isActive
        })
        return !!result
    }

    return {
        // State
        users,
        loading,
        error,
        useMocks,
        // Actions
        fetchUsers,
        fetchUserById,
        createUser,
        updateUser,
        deleteUser,
        toggleUserStatus,
    }
})
