<template>
  <MainLayout>
    <v-container fluid class="pa-0 mw-900">
      <!-- Верхняя панель -->
      <div class="d-flex align-center justify-space-between mb-6">
        <div class="d-flex align-center">
          <v-btn icon="mdi-arrow-left" variant="text" to="/news" class="mr-2"></v-btn>
          <h1 class="text-h5 font-weight-bold">{{ isEditMode ? 'Редактировать новость' : 'Новая новость' }}</h1>
        </div>
        <div class="d-flex gap-2">
          <v-btn variant="outlined" color="black" class="text-none font-weight-bold" rounded="lg" to="/news">
            Отмена
          </v-btn>
          <v-btn
            color="#37E23F"
            class="text-white text-none font-weight-bold"
            elevation="0"
            rounded="lg"
            :loading="newsStore.loading"
            @click="handleSave"
          >
            {{ isEditMode ? 'Сохранить' : 'Опубликовать' }}
          </v-btn>
        </div>
      </div>

      <!-- Ошибка -->
      <v-alert v-if="newsStore.error" type="error" class="mb-4" closable>
        {{ newsStore.error }}
      </v-alert>

      <!-- Загрузка -->
      <div v-if="isEditMode && loading" class="d-flex justify-center py-16">
        <v-progress-circular indeterminate color="#4527A0" size="48"></v-progress-circular>
      </div>

      <v-row v-else>
        <!-- Левая колонка -->
        <v-col cols="12" md="8">
          <!-- Заголовок и контент -->
          <v-card class="rounded-xl border mb-6" flat>
            <div class="pa-6">
              <label class="text-caption font-weight-bold text-grey-darken-1 mb-2 d-block">Заголовок *</label>
              <v-text-field
                v-model="form.title"
                placeholder="Введите заголовок новости"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
                class="mb-6"
                :error-messages="errors.title"
              ></v-text-field>

              <label class="text-caption font-weight-bold text-grey-darken-1 mb-2 d-block">Содержание *</label>
              <v-textarea
                v-model="form.content"
                placeholder="Текст новости..."
                variant="outlined"
                density="comfortable"
                rows="10"
                hide-details="auto"
                :error-messages="errors.content"
              ></v-textarea>
            </div>
          </v-card>

          <!-- Изображение -->
          <v-card class="rounded-xl border" flat>
            <div class="pa-6">
              <h3 class="text-body-1 font-weight-bold mb-4">Изображение</h3>
              
              <!-- Превью -->
              <v-sheet
                v-if="form.imageUrl"
                color="grey-lighten-4"
                class="rounded-lg mb-4 position-relative overflow-hidden"
                height="200"
              >
                <v-img :src="form.imageUrl" height="200" cover></v-img>
                <v-btn
                  icon
                  size="small"
                  color="red"
                  class="position-absolute"
                  style="top: 8px; right: 8px;"
                  @click="form.imageUrl = ''"
                >
                  <v-icon icon="mdi-close" size="small"></v-icon>
                </v-btn>
              </v-sheet>

              <v-text-field
                v-model="form.imageUrl"
                placeholder="https://example.com/image.jpg"
                variant="outlined"
                density="comfortable"
                hide-details
                prepend-inner-icon="mdi-image"
                label="URL изображения"
              ></v-text-field>
            </div>
          </v-card>
        </v-col>

        <!-- Правая колонка -->
        <v-col cols="12" md="4">
          <!-- Статус публикации -->
          <v-card class="rounded-xl border" flat>
            <div class="pa-6">
              <h3 class="text-body-1 font-weight-bold mb-4">Публикация</h3>
              
              <v-switch
                v-model="form.isPublished"
                :label="form.isPublished ? 'Опубликовано' : 'Черновик'"
                color="#4527A0"
                hide-details
                inset
              ></v-switch>

              <p class="text-caption text-grey mt-3">
                {{ form.isPublished ? 'Новость видна посетителям' : 'Новость скрыта от посетителей' }}
              </p>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import { useNewsStore } from '@/stores/news'

const route = useRoute()
const router = useRouter()
const newsStore = useNewsStore()

const loading = ref(false)

// Режим
const isEditMode = computed(() => {
  return route.params.id && route.params.id !== 'new'
})

const newsId = computed(() => {
  return isEditMode.value ? Number(route.params.id) : null
})

// Форма
const form = reactive({
  title: '',
  content: '',
  imageUrl: '',
  isPublished: true,
})

const errors = reactive({
  title: '',
  content: '',
})

// Загрузка данных
onMounted(async () => {
  if (isEditMode.value && newsId.value) {
    loading.value = true
    const item = await newsStore.fetchNewsById(newsId.value)
    if (item) {
      form.title = item.title
      form.content = item.content
      form.imageUrl = item.imageUrl || ''
      form.isPublished = item.isPublished
    }
    loading.value = false
  }
})

// Валидация
const validate = (): boolean => {
  let isValid = true
  errors.title = ''
  errors.content = ''

  if (!form.title.trim()) {
    errors.title = 'Заголовок обязателен'
    isValid = false
  }

  if (!form.content.trim()) {
    errors.content = 'Содержание обязательно'
    isValid = false
  }

  return isValid
}

// Сохранение
const handleSave = async () => {
  if (!validate()) return

  const data = {
    title: form.title,
    content: form.content,
    imageUrl: form.imageUrl || undefined,
    isPublished: form.isPublished,
  }

  let success = false

  if (isEditMode.value && newsId.value) {
    const result = await newsStore.updateNews(newsId.value, data)
    success = !!result
  } else {
    const result = await newsStore.createNews(data)
    success = !!result
  }

  if (success) {
    router.push('/news')
  }
}
</script>

<style scoped>
.mw-900 {
  max-width: 900px;
  margin: 0 auto;
}
.position-relative {
  position: relative;
}
.position-absolute {
  position: absolute;
}
.overflow-hidden {
  overflow: hidden;
}
</style>
