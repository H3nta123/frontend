<template>
  <MainLayout>
    <!-- Заголовок -->
    <div class="d-flex justify-space-between align-center mb-8">
      <div>
        <h1 class="text-h5 font-weight-bold text-black">Новости</h1>
        <p class="text-body-2 text-grey-darken-1 mt-1">Управление новостями магазина</p>
      </div>

      <v-btn
        color="#4527A0"
        prepend-icon="mdi-plus"
        class="text-none text-white font-weight-bold px-6"
        height="44"
        rounded="lg"
        elevation="0"
        to="/news/new"
      >
        Добавить новость
      </v-btn>
    </div>

    <!-- Загрузка -->
    <div v-if="newsStore.loading && newsStore.news.length === 0" class="d-flex justify-center py-16">
      <v-progress-circular indeterminate color="#4527A0" size="48"></v-progress-circular>
    </div>

    <!-- Ошибка -->
    <v-alert v-else-if="newsStore.error" type="error" class="mb-4" closable>
      {{ newsStore.error }}
    </v-alert>

    <!-- Пустой список -->
    <v-card v-else-if="newsStore.news.length === 0" class="rounded-xl border pa-12 text-center" flat>
      <v-icon icon="mdi-newspaper-variant-outline" size="64" color="grey-lighten-1" class="mb-4"></v-icon>
      <h3 class="text-h6 font-weight-bold mb-2">Новостей пока нет</h3>
      <p class="text-body-2 text-grey mb-6">Добавьте первую новость для вашего магазина</p>
      <v-btn
        color="#4527A0"
        prepend-icon="mdi-plus"
        class="text-none text-white font-weight-bold"
        rounded="lg"
        to="/news/new"
      >
        Добавить новость
      </v-btn>
    </v-card>

    <!-- Список новостей -->
    <v-row v-else>
      <v-col v-for="item in newsStore.news" :key="item.id" cols="12" md="6" lg="4">
        <v-card class="rounded-xl border h-100 d-flex flex-column" flat>
          <!-- Изображение -->
          <v-sheet color="grey-lighten-4" height="160" class="d-flex align-center justify-center">
            <v-img v-if="item.imageUrl" :src="item.imageUrl" height="160" cover></v-img>
            <v-icon v-else icon="mdi-newspaper-variant-outline" size="48" color="grey-lighten-1"></v-icon>
          </v-sheet>

          <v-card-text class="flex-grow-1 pa-5">
            <!-- Статус -->
            <v-chip
              size="x-small"
              :color="item.isPublished ? 'green' : 'grey'"
              class="mb-3"
              label
            >
              {{ item.isPublished ? 'Опубликовано' : 'Черновик' }}
            </v-chip>

            <h3 class="text-body-1 font-weight-bold mb-2">{{ item.title }}</h3>
            <p class="text-body-2 text-grey-darken-1 mb-3" style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
              {{ item.content }}
            </p>
            <div class="text-caption text-grey">
              {{ formatDate(item.createdAt) }}
            </div>
          </v-card-text>

          <v-card-actions class="pa-5 pt-0">
            <v-btn
              variant="flat"
              color="grey-lighten-3"
              class="flex-grow-1 text-none rounded-lg text-caption font-weight-bold text-grey-darken-3"
              height="36"
              :to="`/news/${item.id}`"
            >
              Редактировать
            </v-btn>
            <v-btn
              variant="flat"
              color="red-lighten-5"
              icon
              rounded="lg"
              size="36"
              class="ml-2"
              @click="confirmDelete(item)"
            >
              <v-icon color="red" icon="mdi-trash-can-outline" size="small"></v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Диалог подтверждения удаления -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card class="rounded-xl">
        <v-card-title class="text-h6 font-weight-bold pa-6 pb-2">
          Удалить новость?
        </v-card-title>
        <v-card-text class="px-6 pb-4">
          Вы уверены, что хотите удалить новость <strong>{{ itemToDelete?.title }}</strong>?
        </v-card-text>
        <v-card-actions class="pa-6 pt-0">
          <v-spacer></v-spacer>
          <v-btn variant="text" class="text-none" @click="deleteDialog = false">Отмена</v-btn>
          <v-btn
            color="red"
            variant="flat"
            class="text-none font-weight-bold"
            rounded="lg"
            :loading="newsStore.loading"
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
import { ref, onMounted } from 'vue'
import MainLayout from '@/layouts/MainLayout.vue'
import { useNewsStore, type NewsItem } from '@/stores/news'

const newsStore = useNewsStore()

const deleteDialog = ref(false)
const itemToDelete = ref<NewsItem | null>(null)

// Загрузка при монтировании
onMounted(() => {
  newsStore.fetchNews()
})

// Форматирование даты
const formatDate = (dateStr?: string) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

// Подтверждение удаления
const confirmDelete = (item: NewsItem) => {
  itemToDelete.value = item
  deleteDialog.value = true
}

// Удаление
const handleDelete = async () => {
  if (!itemToDelete.value) return

  const success = await newsStore.deleteNews(itemToDelete.value.id)
  if (success) {
    deleteDialog.value = false
    itemToDelete.value = null
  }
}
</script>
