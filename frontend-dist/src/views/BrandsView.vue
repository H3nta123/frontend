<template>
  <MainLayout>
    <!-- Заголовок -->
    <div class="d-flex justify-space-between align-center mb-8">
      <div>
        <h1 class="text-h5 font-weight-bold text-black">Бренды / Производители</h1>
        <p class="text-body-2 text-grey-darken-1 mt-1">Управление брендами товаров</p>
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
        Добавить бренд
      </v-btn>
    </div>

    <!-- Загрузка -->
    <div v-if="brandsStore.loading && brandsStore.brands.length === 0" class="d-flex justify-center py-16">
      <v-progress-circular indeterminate color="#4527A0" size="48"></v-progress-circular>
    </div>

    <!-- Ошибка -->
    <v-alert v-else-if="brandsStore.error" type="error" class="mb-4" closable>
      {{ brandsStore.error }}
    </v-alert>

    <!-- Пустой список -->
    <v-card v-else-if="brandsStore.brands.length === 0" class="rounded-xl border pa-12 text-center" flat>
      <v-icon icon="mdi-tag-multiple-outline" size="64" color="grey-lighten-1" class="mb-4"></v-icon>
      <h3 class="text-h6 font-weight-bold mb-2">Брендов пока нет</h3>
      <p class="text-body-2 text-grey mb-6">Добавьте первый бренд для товаров</p>
      <v-btn
        color="#4527A0"
        prepend-icon="mdi-plus"
        class="text-none text-white font-weight-bold"
        rounded="lg"
        @click="openDialog()"
      >
        Добавить бренд
      </v-btn>
    </v-card>

    <!-- Таблица брендов -->
    <v-card v-else class="rounded-xl border" flat>
      <v-table>
        <thead class="bg-grey-lighten-4">
          <tr>
            <th class="text-left font-weight-bold py-4 pl-6">Логотип</th>
            <th class="text-left font-weight-bold">Название</th>
            <th class="text-left font-weight-bold">Описание</th>
            <th class="text-right font-weight-bold pr-6">Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="brand in brandsStore.brands" :key="brand.id" class="hover-row">
            <td class="py-3 pl-6">
              <v-avatar color="grey-lighten-4" size="48" rounded="lg">
                <v-img v-if="brand.logoUrl" :src="brand.logoUrl" cover></v-img>
                <v-icon v-else icon="mdi-tag-outline" color="grey"></v-icon>
              </v-avatar>
            </td>
            <td class="font-weight-bold text-body-1">{{ brand.name }}</td>
            <td class="text-body-2 text-grey-darken-1" style="max-width: 400px;">
              {{ brand.description || '—' }}
            </td>
            <td class="text-right pr-6">
              <v-btn variant="text" color="blue" class="text-none font-weight-medium" @click="openDialog(brand)">
                Редактировать
              </v-btn>
              <v-btn variant="text" color="red" class="text-none font-weight-medium" @click="confirmDelete(brand)">
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
          {{ editingBrand ? 'Редактировать бренд' : 'Новый бренд' }}
        </v-card-title>
        <v-card-text class="px-6 pb-4">
          <label class="text-caption font-weight-bold text-grey-darken-1 mb-2 d-block">Название *</label>
          <v-text-field
            v-model="form.name"
            placeholder="Например, Nike"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
            class="mb-4"
            :error-messages="formError"
          ></v-text-field>

          <label class="text-caption font-weight-bold text-grey-darken-1 mb-2 d-block">Описание</label>
          <v-textarea
            v-model="form.description"
            placeholder="Краткое описание бренда"
            variant="outlined"
            density="comfortable"
            rows="3"
            hide-details
            class="mb-4"
          ></v-textarea>

          <label class="text-caption font-weight-bold text-grey-darken-1 mb-2 d-block">URL логотипа</label>
          <v-text-field
            v-model="form.logoUrl"
            placeholder="https://example.com/logo.png"
            variant="outlined"
            density="comfortable"
            hide-details
          ></v-text-field>
        </v-card-text>
        <v-card-actions class="pa-6 pt-0">
          <v-spacer></v-spacer>
          <v-btn variant="text" class="text-none" @click="formDialog = false">Отмена</v-btn>
          <v-btn 
            color="#4527A0" 
            variant="flat" 
            class="text-none font-weight-bold text-white" 
            rounded="lg"
            :loading="brandsStore.loading"
            @click="handleSave"
          >
            {{ editingBrand ? 'Сохранить' : 'Создать' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Диалог подтверждения удаления -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card class="rounded-xl">
        <v-card-title class="text-h6 font-weight-bold pa-6 pb-2">
          Удалить бренд?
        </v-card-title>
        <v-card-text class="px-6 pb-4">
          Вы уверены, что хотите удалить бренд <strong>{{ brandToDelete?.name }}</strong>?
        </v-card-text>
        <v-card-actions class="pa-6 pt-0">
          <v-spacer></v-spacer>
          <v-btn variant="text" class="text-none" @click="deleteDialog = false">Отмена</v-btn>
          <v-btn 
            color="red" 
            variant="flat" 
            class="text-none font-weight-bold" 
            rounded="lg"
            :loading="brandsStore.loading"
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
import { useBrandsStore, type Brand } from '@/stores/brands'

const brandsStore = useBrandsStore()

// Dialogs
const formDialog = ref(false)
const deleteDialog = ref(false)

// Form state
const editingBrand = ref<Brand | null>(null)
const brandToDelete = ref<Brand | null>(null)
const formError = ref('')

const form = reactive({
  name: '',
  description: '',
  logoUrl: '',
})

// Загрузка при монтировании
onMounted(() => {
  brandsStore.fetchBrands()
})

// Открыть диалог
const openDialog = (brand?: Brand) => {
  if (brand) {
    editingBrand.value = brand
    form.name = brand.name
    form.description = brand.description || ''
    form.logoUrl = brand.logoUrl || ''
  } else {
    editingBrand.value = null
    form.name = ''
    form.description = ''
    form.logoUrl = ''
  }
  formError.value = ''
  formDialog.value = true
}

// Подтверждение удаления
const confirmDelete = (brand: Brand) => {
  brandToDelete.value = brand
  deleteDialog.value = true
}

// Сохранение
const handleSave = async () => {
  if (!form.name.trim()) {
    formError.value = 'Название обязательно'
    return
  }

  const data = {
    name: form.name,
    description: form.description || undefined,
    logoUrl: form.logoUrl || undefined,
  }

  let success = false

  if (editingBrand.value) {
    const result = await brandsStore.updateBrand(editingBrand.value.id, data)
    success = !!result
  } else {
    const result = await brandsStore.createBrand(data)
    success = !!result
  }

  if (success) {
    formDialog.value = false
  }
}

// Удаление
const handleDelete = async () => {
  if (!brandToDelete.value) return

  const success = await brandsStore.deleteBrand(brandToDelete.value.id)
  if (success) {
    deleteDialog.value = false
    brandToDelete.value = null
  }
}
</script>

<style scoped>
.hover-row:hover td {
  background-color: #fafafa;
}
</style>
