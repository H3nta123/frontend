<template>
  <MainLayout>
    <!-- Заголовок -->
    <div class="d-flex justify-space-between align-center mb-8">
      <div>
        <h1 class="text-h5 font-weight-bold text-black">Пользователи</h1>
        <p class="text-body-2 text-grey-darken-1 mt-1">Управление пользователями системы</p>
      </div>

      <v-btn
        color="#4527A0"
        prepend-icon="mdi-plus"
        class="text-none text-white font-weight-bold px-6"
        height="44"
        rounded="lg"
        elevation="0"
        @click="openDialog()"
      >
        Добавить пользователя
      </v-btn>
    </div>

    <!-- Загрузка -->
    <div v-if="usersStore.loading && usersStore.users.length === 0" class="d-flex justify-center py-16">
      <v-progress-circular indeterminate color="#4527A0" size="48"></v-progress-circular>
    </div>

    <!-- Ошибка -->
    <v-alert v-else-if="usersStore.error" type="error" class="mb-4" closable>
      {{ usersStore.error }}
    </v-alert>

    <!-- Пустой список -->
    <v-card v-else-if="usersStore.users.length === 0" class="rounded-xl border pa-12 text-center" flat>
      <v-icon icon="mdi-account-group-outline" size="64" color="grey-lighten-1" class="mb-4"></v-icon>
      <h3 class="text-h6 font-weight-bold mb-2">Пользователей пока нет</h3>
      <p class="text-body-2 text-grey mb-6">Добавьте первого пользователя</p>
      <v-btn
        color="#4527A0"
        prepend-icon="mdi-plus"
        class="text-none text-white font-weight-bold"
        rounded="lg"
        @click="openDialog()"
      >
        Добавить пользователя
      </v-btn>
    </v-card>

    <!-- Таблица пользователей -->
    <v-card v-else class="rounded-xl border" flat>
      <v-table>
        <thead class="bg-grey-lighten-4">
          <tr>
            <th class="text-left font-weight-bold py-4 pl-6">Пользователь</th>
            <th class="text-left font-weight-bold">Email</th>
            <th class="text-left font-weight-bold">Роль</th>
            <th class="text-left font-weight-bold">Статус</th>
            <th class="text-left font-weight-bold">Дата регистрации</th>
            <th class="text-right font-weight-bold pr-6">Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in usersStore.users" :key="user.id" class="hover-row">
            <td class="py-3 pl-6">
              <div class="d-flex align-center">
                <v-avatar :color="getRoleColor(user.role)" size="40" class="mr-3">
                  <span class="text-white font-weight-bold">{{ user.name.charAt(0).toUpperCase() }}</span>
                </v-avatar>
                <span class="font-weight-bold">{{ user.name }}</span>
              </div>
            </td>
            <td class="text-body-2">{{ user.email }}</td>
            <td>
              <v-chip
                size="small"
                :color="getRoleColor(user.role)"
                label
              >
                {{ getRoleName(user.role) }}
              </v-chip>
            </td>
            <td>
              <v-chip
                size="small"
                :color="user.isActive ? 'green' : 'grey'"
                label
              >
                {{ user.isActive ? 'Активен' : 'Неактивен' }}
              </v-chip>
            </td>
            <td class="text-body-2 text-grey-darken-1">
              {{ formatDate(user.createdAt) }}
            </td>
            <td class="text-right pr-6">
              <v-btn variant="text" color="blue" class="text-none font-weight-medium" @click="openDialog(user)">
                Редактировать
              </v-btn>
              <v-btn
                variant="text"
                :color="user.isActive ? 'orange' : 'green'"
                class="text-none font-weight-medium"
                @click="toggleStatus(user)"
              >
                {{ user.isActive ? 'Деактивировать' : 'Активировать' }}
              </v-btn>
              <v-btn variant="text" color="red" class="text-none font-weight-medium" @click="confirmDelete(user)">
                Удалить
              </v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>

    <!-- Диалог создания/редактирования -->
    <v-dialog v-model="formDialog" max-width="500">
      <v-card class="rounded-xl">
        <v-card-title class="text-h6 font-weight-bold pa-6 pb-2">
          {{ editingUser ? 'Редактировать пользователя' : 'Новый пользователь' }}
        </v-card-title>
        <v-card-text class="px-6 pb-4">
          <label class="text-caption font-weight-bold text-grey-darken-1 mb-2 d-block">Имя *</label>
          <v-text-field
            v-model="form.name"
            placeholder="Введите имя"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
            class="mb-4"
            :error-messages="formErrors.name"
          ></v-text-field>

          <label class="text-caption font-weight-bold text-grey-darken-1 mb-2 d-block">Email *</label>
          <v-text-field
            v-model="form.email"
            placeholder="email@example.com"
            type="email"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
            class="mb-4"
            :error-messages="formErrors.email"
          ></v-text-field>

          <label class="text-caption font-weight-bold text-grey-darken-1 mb-2 d-block">Роль</label>
          <v-select
            v-model="form.role"
            :items="roleOptions"
            item-title="title"
            item-value="value"
            variant="outlined"
            density="comfortable"
            hide-details
            class="mb-4"
          ></v-select>

          <v-switch
            v-model="form.isActive"
            label="Активен"
            color="#4527A0"
            hide-details
            inset
          ></v-switch>
        </v-card-text>
        <v-card-actions class="pa-6 pt-0">
          <v-spacer></v-spacer>
          <v-btn variant="text" class="text-none" @click="formDialog = false">Отмена</v-btn>
          <v-btn
            color="#4527A0"
            variant="flat"
            class="text-none font-weight-bold text-white"
            rounded="lg"
            :loading="usersStore.loading"
            @click="handleSave"
          >
            {{ editingUser ? 'Сохранить' : 'Создать' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Диалог подтверждения удаления -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card class="rounded-xl">
        <v-card-title class="text-h6 font-weight-bold pa-6 pb-2">
          Удалить пользователя?
        </v-card-title>
        <v-card-text class="px-6 pb-4">
          Вы уверены, что хотите удалить пользователя <strong>{{ userToDelete?.name }}</strong>?
        </v-card-text>
        <v-card-actions class="pa-6 pt-0">
          <v-spacer></v-spacer>
          <v-btn variant="text" class="text-none" @click="deleteDialog = false">Отмена</v-btn>
          <v-btn
            color="red"
            variant="flat"
            class="text-none font-weight-bold"
            rounded="lg"
            :loading="usersStore.loading"
            @click="handleDelete"
          >
            Удалить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </MainLayout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import MainLayout from '@/layouts/MainLayout.vue'
import { useUsersStore, type User } from '@/stores/users'

const usersStore = useUsersStore()

// Dialogs
const formDialog = ref(false)
const deleteDialog = ref(false)

// Form state
const editingUser = ref<User | null>(null)
const userToDelete = ref<User | null>(null)

const form = reactive({
  name: '',
  email: '',
  role: 'customer' as 'admin' | 'manager' | 'customer',
  isActive: true,
})

const formErrors = reactive({
  name: '',
  email: '',
})

const roleOptions = [
  { title: 'Администратор', value: 'admin' },
  { title: 'Менеджер', value: 'manager' },
  { title: 'Клиент', value: 'customer' },
]

// Загрузка при монтировании
onMounted(() => {
  usersStore.fetchUsers()
})

// Хелперы
const getRoleColor = (role: string) => {
  switch (role) {
    case 'admin': return '#4527A0'
    case 'manager': return '#1976D2'
    default: return 'grey'
  }
}

const getRoleName = (role: string) => {
  switch (role) {
    case 'admin': return 'Администратор'
    case 'manager': return 'Менеджер'
    default: return 'Клиент'
  }
}

const formatDate = (dateStr?: string) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

// Открыть диалог
const openDialog = (user?: User) => {
  if (user) {
    editingUser.value = user
    form.name = user.name
    form.email = user.email
    form.role = user.role
    form.isActive = user.isActive
  } else {
    editingUser.value = null
    form.name = ''
    form.email = ''
    form.role = 'customer'
    form.isActive = true
  }
  formErrors.name = ''
  formErrors.email = ''
  formDialog.value = true
}

// Переключить статус
const toggleStatus = async (user: User) => {
  await usersStore.toggleUserStatus(user.id)
}

// Подтверждение удаления
const confirmDelete = (user: User) => {
  userToDelete.value = user
  deleteDialog.value = true
}

// Валидация
const validate = (): boolean => {
  formErrors.name = ''
  formErrors.email = ''
  let isValid = true

  if (!form.name.trim()) {
    formErrors.name = 'Имя обязательно'
    isValid = false
  }

  if (!form.email.trim()) {
    formErrors.email = 'Email обязателен'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    formErrors.email = 'Некорректный email'
    isValid = false
  }

  return isValid
}

// Сохранение
const handleSave = async () => {
  if (!validate()) return

  const data = {
    name: form.name,
    email: form.email,
    role: form.role,
    isActive: form.isActive,
  }

  let success = false

  if (editingUser.value) {
    const result = await usersStore.updateUser(editingUser.value.id, data)
    success = !!result
  } else {
    const result = await usersStore.createUser(data)
    success = !!result
  }

  if (success) {
    formDialog.value = false
  }
}

// Удаление
const handleDelete = async () => {
  if (!userToDelete.value) return

  const success = await usersStore.deleteUser(userToDelete.value.id)
  if (success) {
    deleteDialog.value = false
    userToDelete.value = null
  }
}
</script>

<style scoped>
.hover-row:hover td {
  background-color: #fafafa;
}
</style>
