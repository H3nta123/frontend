<template>
  <MainLayout>
    <!-- Верхняя панель: Заголовок и кнопки -->
    <div class="d-flex justify-space-between align-center mb-8">
      <h1 class="text-h5 font-weight-bold text-black">Каталог товаров</h1>

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
          to="/products/new"
        >
          Добавить товар
        </v-btn>
      </div>
    </div>

    <!-- Загрузка -->
    <div v-if="productsStore.loading" class="d-flex justify-center py-16">
      <v-progress-circular indeterminate color="#4527A0" size="48"></v-progress-circular>
    </div>

    <!-- Ошибка -->
    <v-alert v-else-if="productsStore.error" type="error" class="mb-4" closable>
      {{ productsStore.error }}
    </v-alert>

    <!-- Пустой список -->
    <v-card v-else-if="productsStore.products.length === 0" class="rounded-xl border pa-12 text-center" flat>
      <v-icon icon="mdi-package-variant" size="64" color="grey-lighten-1" class="mb-4"></v-icon>
      <h3 class="text-h6 font-weight-bold mb-2">Товаров пока нет</h3>
      <p class="text-body-2 text-grey mb-6">Добавьте первый товар, чтобы начать продажи</p>
      <v-btn
        color="#4527A0"
        prepend-icon="mdi-plus"
        class="text-none text-white font-weight-bold"
        rounded="lg"
        to="/products/new"
      >
        Добавить товар
      </v-btn>
    </v-card>

    <!-- Режим СЕТКИ (Grid) -->
    <v-row v-else-if="viewMode === 'grid'">
      <v-col
        v-for="product in productsStore.products"
        :key="product.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-card class="pa-4 rounded-xl border h-100" flat color="white" style="border-color: #eee !important;">
          <!-- Плейсхолдер изображения -->
          <v-sheet
            color="grey-lighten-4"
            height="220"
            class="rounded-lg mb-4 d-flex align-center justify-center"
          >
            <v-icon v-if="!product.images?.length" icon="mdi-image-outline" size="64" color="grey-lighten-2"></v-icon>
            <v-img v-else :src="product.images[0]" height="220" cover class="rounded-lg"></v-img>
          </v-sheet>

          <div class="mb-1 font-weight-medium text-body-1">{{ product.name }}</div>
          <div class="text-blue font-weight-bold text-body-1 mb-2">{{ formatPrice(product.price) }}</div>
          
          <!-- Статус -->
          <v-chip 
            size="x-small" 
            :color="product.status === 'active' ? 'green' : 'grey'" 
            class="mb-4"
            label
          >
            {{ product.status === 'active' ? 'Активный' : 'Черновик' }}
          </v-chip>

          <div class="d-flex gap-2">
            <v-btn
              variant="flat"
              color="grey-lighten-3"
              class="flex-grow-1 text-none rounded-lg text-caption font-weight-bold text-grey-darken-3"
              height="36"
              :to="`/products/${product.id}`"
            >
              Редактировать <v-icon icon="mdi-pencil" size="small" class="ml-1"></v-icon>
            </v-btn>
            <v-btn
              variant="flat"
              color="red-lighten-5"
              icon
              rounded="lg"
              size="36"
              class="ml-2"
              @click="confirmDelete(product)"
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
          <th class="text-left font-weight-bold py-4">Изображение</th>
          <th class="text-left font-weight-bold">Название</th>
          <th class="text-left font-weight-bold">Цена</th>
          <th class="text-left font-weight-bold">Статус</th>
          <th class="text-left font-weight-bold">Кол-во</th>
          <th class="text-right font-weight-bold pr-10">Действие</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="product in productsStore.products" :key="product.id" class="hover-row">
          <td class="py-3 pl-6">
            <v-sheet
              color="grey-lighten-4"
              width="60"
              height="60"
              class="rounded-lg d-flex align-center justify-center"
            >
              <v-icon v-if="!product.images?.length" icon="mdi-image-outline" color="grey-lighten-1"></v-icon>
              <v-img v-else :src="product.images[0]" width="60" height="60" cover class="rounded-lg"></v-img>
            </v-sheet>
          </td>
          <td class="font-weight-bold text-body-1">{{ product.name }}</td>
          <td class="text-blue font-weight-bold text-body-1">{{ formatPrice(product.price) }}</td>
          <td>
            <v-chip 
              size="x-small" 
              :color="product.status === 'active' ? 'green' : 'grey'" 
              label
            >
              {{ product.status === 'active' ? 'Активный' : 'Черновик' }}
            </v-chip>
          </td>
          <td class="text-body-2">{{ product.quantity }} шт</td>
          <td class="text-right pr-6">
            <v-btn variant="text" color="blue" class="text-none font-weight-medium" :to="`/products/${product.id}`">
              Редактировать
            </v-btn>
            <v-btn variant="text" color="red" class="text-none font-weight-medium" @click="confirmDelete(product)">
              Удалить
            </v-btn>
          </td>
        </tr>
        </tbody>
      </v-table>
    </v-card>

    <!-- Диалог подтверждения удаления -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card class="rounded-xl">
        <v-card-title class="text-h6 font-weight-bold pa-6 pb-2">
          Удалить товар?
        </v-card-title>
        <v-card-text class="px-6 pb-4">
          Вы уверены, что хотите удалить товар <strong>{{ productToDelete?.name }}</strong>? 
          Это действие нельзя отменить.
        </v-card-text>
        <v-card-actions class="pa-6 pt-0">
          <v-spacer></v-spacer>
          <v-btn variant="text" class="text-none" @click="deleteDialog = false">Отмена</v-btn>
          <v-btn 
            color="red" 
            variant="flat" 
            class="text-none font-weight-bold" 
            rounded="lg"
            :loading="productsStore.loading"
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
import { useProductsStore, type Product } from '@/stores/products'

const productsStore = useProductsStore()

const viewMode = ref('grid')
const deleteDialog = ref(false)
const productToDelete = ref<Product | null>(null)

// Загрузить товары при монтировании
onMounted(() => {
  productsStore.fetchProducts()
})

const formatPrice = (price: number) => {
  return `${price.toLocaleString()} ₽`
}

const confirmDelete = (product: Product) => {
  productToDelete.value = product
  deleteDialog.value = true
}

const handleDelete = async () => {
  if (!productToDelete.value) return
  
  const success = await productsStore.deleteProduct(productToDelete.value.id)
  if (success) {
    deleteDialog.value = false
    productToDelete.value = null
  }
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
