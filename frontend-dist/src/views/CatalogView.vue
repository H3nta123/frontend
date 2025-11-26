<template>
  <MainLayout>
    <!-- Верхняя панель: Заголовок и кнопки -->
    <div class="d-flex justify-space-between align-center mb-8">
      <h1 class="text-h5 font-weight-bold text-black">каталог товаров</h1>

      <div class="d-flex align-center">
        <!-- Переключатель вида (Сетка/Список) -->
        <div class="bg-white border rounded-lg mr-4 d-flex pa-1" style="border-color: #e0e0e0 !important;">
          <v-btn
            variant="text"
            size="small"
            rounded="md"
            :color="viewMode === 'grid' ? '#4527A0' : 'grey'"
            class="min-w-0 px-2"
            @click="viewMode = 'grid'"
          >
            <v-icon icon="mdi-view-grid"></v-icon>
          </v-btn>
          <v-btn
            variant="text"
            size="small"
            rounded="md"
            :color="viewMode === 'list' ? '#4527A0' : 'grey'"
            class="min-w-0 px-2"
            @click="viewMode = 'list'"
          >
            <v-icon icon="mdi-format-list-bulleted"></v-icon>
          </v-btn>
        </div>

        <!-- Кнопка Добавить товар -->
        <v-btn
          color="#4527A0"
          prepend-icon="mdi-plus"
          class="text-none text-white font-weight-bold px-6"
          height="44"
          rounded="lg"
          elevation="0"
          @click="showAddDialog = true"
        >
          добавить товар
        </v-btn>
      </div>
    </div>

    <!-- Режим СЕТКИ (Grid) -->
    <v-row v-if="viewMode === 'grid'">
      <v-col
        v-for="product in products"
        :key="product.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-card class="pa-4 rounded-xl border" flat color="white" style="border-color: #eee !important;">
          <!-- Плейсхолдер изображения -->
          <v-sheet
            color="grey-lighten-4"
            height="220"
            class="rounded-lg mb-4 d-flex align-center justify-center"
          >
            <v-icon icon="mdi-image-outline" size="64" color="grey-lighten-2"></v-icon>
          </v-sheet>

          <div class="mb-1 font-weight-medium text-body-1">{{ product.name }}</div>
          <div class="text-blue font-weight-bold text-body-1 mb-4">{{ formatPrice(product.price) }}</div>

          <div class="d-flex gap-2">
            <v-btn
              variant="flat"
              color="grey-lighten-3"
              class="flex-grow-1 text-none rounded-lg text-caption font-weight-bold text-grey-darken-3"
              height="36"
            >
              редактировать <v-icon icon="mdi-pencil" size="small" class="ml-1"></v-icon>
            </v-btn>
            <v-btn
              variant="flat"
              color="red-lighten-5"
              icon
              rounded="lg"
              size="36"
              class="ml-2"
            >
              <v-icon color="red" icon="mdi-trash-can-outline" size="small"></v-icon>
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Режим СПИСКА (List) -->
    <v-card v-else flat class="rounded-xl border" style="border-color: #eee !important;">
      <v-table>
        <thead class="bg-grey-lighten-4">
        <tr>
          <th class="text-left font-weight-bold py-4">изображение</th>
          <th class="text-left font-weight-bold">название</th>
          <th class="text-left font-weight-bold">цена</th>
          <th class="text-right font-weight-bold pr-10">действие</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="product in products" :key="product.id" class="hover-row">
          <td class="py-3 pl-6">
            <v-sheet
              color="grey-lighten-4"
              width="60"
              height="60"
              class="rounded-lg d-flex align-center justify-center"
            >
              <v-icon icon="mdi-image-outline" color="grey-lighten-1"></v-icon>
            </v-sheet>
          </td>
          <td class="font-weight-bold text-body-1">{{ product.name }}</td>
          <td class="text-blue font-weight-bold text-body-1">{{ formatPrice(product.price) }}</td>
          <td class="text-right pr-6">
            <v-btn variant="text" color="blue" class="text-none font-weight-medium">
              Редактировать
            </v-btn>
            <v-btn variant="text" color="red" class="text-none font-weight-medium">
              Удалить
            </v-btn>
          </td>
        </tr>
        </tbody>
      </v-table>
    </v-card>

    <!-- === МОДАЛЬНОЕ ОКНО: Добавить товар === -->
    <v-dialog v-model="showAddDialog" max-width="750">
      <v-card class="rounded-xl bg-white overflow-hidden">
        <!-- Заголовок -->
        <div class="pa-6 pb-4 border-b">
          <h3 class="text-h6 font-weight-bold">Добавить товар</h3>
        </div>

        <div class="pa-8">
          <div class="d-flex align-start">

            <!-- Левая часть: Загрузка фото -->
            <div class="mr-8">
              <v-sheet
                color="grey-lighten-3"
                width="220"
                height="280"
                class="rounded-xl d-flex align-center justify-center cursor-pointer hover-sheet"
                @click="triggerFileInput"
              >
                <v-icon icon="mdi-plus" size="64" color="black"></v-icon>
              </v-sheet>
              <!-- Скрытый инпут для файла -->
              <input type="file" ref="fileInput" class="d-none" />
            </div>

            <!-- Правая часть: Поля ввода -->
            <div class="flex-grow-1 pt-2">
              <label class="text-body-1 mb-2 d-block text-grey-darken-1">название товара</label>
              <v-text-field
                v-model="newProduct.name"
                placeholder="ведите название"
                variant="outlined"
                density="comfortable"
                rounded="lg"
                base-color="grey-lighten-1"
                color="primary"
                bg-color="transparent"
                class="mb-6"
                hide-details="auto"
              ></v-text-field>

              <label class="text-body-1 mb-2 d-block text-grey-darken-1">цена</label>
              <v-text-field
                v-model="newProduct.price"
                placeholder="ведите цену"
                variant="outlined"
                density="comfortable"
                rounded="lg"
                base-color="grey-lighten-1"
                color="primary"
                bg-color="transparent"
                hide-details="auto"
              ></v-text-field>
            </div>
          </div>
        </div>

        <!-- Кнопки внизу (опционально, хотя на скрине их нет, но для логики нужны) -->
        <v-card-actions class="pa-6 pt-0 justify-end">
          <!-- Можно добавить кнопку сохранения, если нужно -->
        </v-card-actions>

      </v-card>
    </v-dialog>

  </MainLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MainLayout from '@/layouts/MainLayout.vue'

const viewMode = ref('grid')
const showAddDialog = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

const newProduct = ref({
  name: '',
  price: ''
})

const products = ref([
  { id: 1, name: 'наушники', price: 12000 },
  { id: 2, name: 'наушники', price: 12000 },
  { id: 3, name: 'наушники', price: 12000 },
  { id: 4, name: 'наушники', price: 12000 },
  { id: 5, name: 'наушники', price: 12000 },
  { id: 6, name: 'наушники', price: 12000 },
])

const formatPrice = (price: number) => {
  return `${price.toLocaleString()} ₽`
}

const triggerFileInput = () => {
  fileInput.value?.click()
}
</script>

<style scoped>
.hover-sheet:hover {
  background-color: #e0e0e0 !important;
  transition: background-color 0.2s;
}
.hover-row:hover td {
  background-color: #fafafa;
}
</style>
