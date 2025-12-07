<template>
  <MainLayout>
    <v-container fluid class="pa-0 mw-1000">

      <!-- Верхняя панель -->
      <div class="d-flex align-center justify-space-between mb-6">
        <div class="d-flex align-center">
          <v-btn icon="mdi-arrow-left" variant="text" to="/catalog" class="mr-2"></v-btn>
          <h1 class="text-h5 font-weight-bold">{{ isEditMode ? 'Редактировать товар' : 'Добавить товар' }}</h1>
        </div>
        <div class="d-flex gap-2">
          <v-btn variant="outlined" color="black" class="text-none font-weight-bold" rounded="lg" to="/catalog">
            Отмена
          </v-btn>
          <v-btn 
            color="#37E23F" 
            class="text-white text-none font-weight-bold" 
            elevation="0" 
            rounded="lg"
            :loading="productsStore.loading"
            @click="handleSave"
          >
            Сохранить
          </v-btn>
        </div>
      </div>

      <!-- Ошибка -->
      <v-alert v-if="productsStore.error" type="error" class="mb-4" closable>
        {{ productsStore.error }}
      </v-alert>

      <!-- Загрузка в режиме редактирования -->
      <div v-if="isEditMode && loading" class="d-flex justify-center py-16">
        <v-progress-circular indeterminate color="#4527A0" size="48"></v-progress-circular>
      </div>

      <v-row v-else>
        <!-- ЛЕВАЯ КОЛОНКА (Основной контент) -->
        <v-col cols="12" md="8">

          <!-- Карточка: Название и описание -->
          <v-card class="rounded-xl border mb-6" flat>
            <div class="pa-6">
              <label class="text-caption font-weight-bold text-grey-darken-1 mb-2 d-block">Название *</label>
              <v-text-field
                v-model="form.name"
                placeholder="Например, Футболка oversize"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
                class="mb-6"
                :error-messages="errors.name"
              ></v-text-field>

              <label class="text-caption font-weight-bold text-grey-darken-1 mb-2 d-block">Описание</label>
              <v-textarea
                v-model="form.description"
                placeholder="Расскажите о товаре..."
                variant="outlined"
                density="comfortable"
                rows="6"
                hide-details="auto"
              ></v-textarea>
            </div>
          </v-card>

          <!-- Карточка: Медиафайлы -->
          <v-card class="rounded-xl border mb-6" flat>
            <div class="pa-6">
              <h3 class="text-body-1 font-weight-bold mb-4">Медиафайлы</h3>
              
              <!-- Превью загруженных изображений -->
              <div v-if="form.images.length > 0" class="d-flex flex-wrap gap-3 mb-4">
                <div v-for="(img, index) in form.images" :key="index" class="position-relative">
                  <v-img :src="img" width="100" height="100" cover class="rounded-lg border"></v-img>
                  <v-btn
                    icon
                    size="x-small"
                    color="red"
                    class="position-absolute"
                    style="top: -8px; right: -8px;"
                    @click="removeImage(index)"
                  >
                    <v-icon icon="mdi-close" size="12"></v-icon>
                  </v-btn>
                </div>
              </div>

              <v-sheet
                color="grey-lighten-5"
                class="border dashed-border rounded-lg d-flex flex-column align-center justify-center pa-8 cursor-pointer"
                height="160"
                @click="$refs.fileInput.click()"
              >
                <div class="d-flex gap-2 mb-2">
                  <v-btn size="small" variant="flat" color="white" class="text-none border">Добавить файл</v-btn>
                </div>
                <div class="text-caption text-grey">Принимаем изображения (JPG, PNG, WebP)</div>
              </v-sheet>
              <input 
                type="file" 
                ref="fileInput" 
                class="d-none" 
                accept="image/*"
                multiple
                @change="handleFileUpload"
              />
            </div>
          </v-card>

          <!-- Карточка: Цены -->
          <v-card class="rounded-xl border mb-6" flat>
            <div class="pa-6">
              <h3 class="text-body-1 font-weight-bold mb-4">Цены</h3>
              <v-row>
                <v-col cols="6">
                  <label class="text-caption font-weight-bold text-grey-darken-1 mb-2 d-block">Цена *</label>
                  <v-text-field
                    v-model.number="form.price"
                    prefix="₽"
                    placeholder="0"
                    type="number"
                    variant="outlined"
                    density="comfortable"
                    hide-details="auto"
                    :error-messages="errors.price"
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <label class="text-caption font-weight-bold text-grey-darken-1 mb-2 d-block">Цена до скидки</label>
                  <v-text-field
                    v-model.number="form.compareAtPrice"
                    prefix="₽"
                    placeholder="0"
                    type="number"
                    variant="outlined"
                    density="comfortable"
                    hide-details
                  ></v-text-field>
                </v-col>
              </v-row>
            </div>
          </v-card>

          <!-- Карточка: Учет товаров (Inventory) -->
          <v-card class="rounded-xl border mb-6" flat>
            <div class="pa-6">
              <h3 class="text-body-1 font-weight-bold mb-4">Учет товаров</h3>
              <v-row>
                <v-col cols="6">
                  <label class="text-caption font-weight-bold text-grey-darken-1 mb-2 d-block">Артикул (SKU)</label>
                  <v-text-field v-model="form.sku" variant="outlined" density="comfortable" hide-details></v-text-field>
                </v-col>
                <v-col cols="6">
                  <label class="text-caption font-weight-bold text-grey-darken-1 mb-2 d-block">Штрихкод (ISBN, UPC)</label>
                  <v-text-field v-model="form.barcode" variant="outlined" density="comfortable" hide-details></v-text-field>
                </v-col>
              </v-row>

              <v-divider class="my-4"></v-divider>

              <div class="d-flex justify-space-between align-center" style="max-width: 300px;">
                <span class="text-body-2">Количество на складе</span>
                <v-text-field
                  v-model.number="form.quantity"
                  type="number"
                  variant="outlined"
                  density="compact"
                  style="max-width: 120px;"
                  hide-details
                ></v-text-field>
              </div>
            </div>
          </v-card>

        </v-col>

        <!-- ПРАВАЯ КОЛОНКА (Статус, Организация) -->
        <v-col cols="12" md="4">

          <!-- Статус -->
          <v-card class="rounded-xl border mb-6" flat>
            <div class="pa-6">
              <h3 class="text-body-1 font-weight-bold mb-4">Статус</h3>
              <v-select
                v-model="form.status"
                :items="statusOptions"
                item-title="title"
                item-value="value"
                variant="outlined"
                density="comfortable"
                hide-details
              >
                <template v-slot:selection="{ item }">
                  <v-icon :color="item.raw.value === 'active' ? 'green' : 'grey'" icon="mdi-circle-small" class="mr-2"></v-icon>
                  {{ item.title }}
                </template>
              </v-select>
            </div>
          </v-card>

          <!-- Организация товара -->
          <v-card class="rounded-xl border mb-6" flat>
            <div class="pa-6">
              <h3 class="text-body-1 font-weight-bold mb-4">Организация</h3>

              <label class="text-caption font-weight-bold text-grey-darken-1 mb-2 d-block">Категория</label>
              <v-select 
                v-model="form.categoryId"
                :items="categories" 
                item-title="name"
                item-value="id"
                label="Выбрать категорию" 
                variant="outlined" 
                density="comfortable" 
                hide-details 
                class="mb-4"
                clearable
              ></v-select>

              <label class="text-caption font-weight-bold text-grey-darken-1 mb-2 d-block">Бренд / Производитель</label>
              <v-select 
                v-model="form.brandId"
                :items="brands" 
                item-title="name"
                item-value="id"
                label="Выбрать бренд" 
                variant="outlined" 
                density="comfortable" 
                hide-details 
                class="mb-4"
                clearable
              ></v-select>
            </div>
          </v-card>

        </v-col>
      </v-row>

    </v-container>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import { useProductsStore, type ProductFormData } from '@/stores/products'

const route = useRoute()
const router = useRouter()
const productsStore = useProductsStore()

const loading = ref(false)

// Определяем режим: создание или редактирование
const isEditMode = computed(() => {
  return route.params.id && route.params.id !== 'new'
})

const productId = computed(() => {
  return isEditMode.value ? Number(route.params.id) : null
})

// Форма
const form = reactive<ProductFormData & { images: string[] }>({
  name: '',
  description: '',
  price: 0,
  compareAtPrice: undefined,
  sku: '',
  barcode: '',
  quantity: 0,
  status: 'active',
  categoryId: undefined,
  brandId: undefined,
  images: [],
})

// Ошибки валидации
const errors = reactive({
  name: '',
  price: '',
})

// Опции статуса
const statusOptions = [
  { title: 'Активный', value: 'active' },
  { title: 'Черновик', value: 'draft' },
]

// Моки для категорий и брендов (позже подключим к API)
const categories = ref([
  { id: 1, name: 'Одежда' },
  { id: 2, name: 'Обувь' },
  { id: 3, name: 'Аксессуары' },
])

const brands = ref([
  { id: 1, name: 'Nike' },
  { id: 2, name: 'Adidas' },
  { id: 3, name: 'Puma' },
])

// Загрузка данных при редактировании
onMounted(async () => {
  if (isEditMode.value && productId.value) {
    loading.value = true
    const product = await productsStore.fetchProductById(productId.value)
    if (product) {
      form.name = product.name
      form.description = product.description
      form.price = product.price
      form.compareAtPrice = product.compareAtPrice
      form.sku = product.sku || ''
      form.barcode = product.barcode || ''
      form.quantity = product.quantity
      form.status = product.status
      form.categoryId = product.categoryId
      form.brandId = product.brandId
      form.images = product.images || []
    }
    loading.value = false
  }
})

// Валидация
const validate = (): boolean => {
  let isValid = true
  errors.name = ''
  errors.price = ''

  if (!form.name.trim()) {
    errors.name = 'Название обязательно'
    isValid = false
  }

  if (!form.price || form.price <= 0) {
    errors.price = 'Укажите цену'
    isValid = false
  }

  return isValid
}

// Сохранение
const handleSave = async () => {
  if (!validate()) return

  const data: ProductFormData = {
    name: form.name,
    description: form.description,
    price: form.price,
    compareAtPrice: form.compareAtPrice,
    sku: form.sku,
    barcode: form.barcode,
    quantity: form.quantity,
    status: form.status,
    categoryId: form.categoryId,
    brandId: form.brandId,
    images: form.images,
  }

  let success = false

  if (isEditMode.value && productId.value) {
    const result = await productsStore.updateProduct(productId.value, data)
    success = !!result
  } else {
    const result = await productsStore.createProduct(data)
    success = !!result
  }

  if (success) {
    router.push('/catalog')
  }
}

// Загрузка изображений (Base64 для разработки)
const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files) return

  Array.from(input.files).forEach(file => {
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) {
        form.images.push(e.target.result as string)
      }
    }
    reader.readAsDataURL(file)
  })

  // Сбросить input для повторной загрузки того же файла
  input.value = ''
}

// Удаление изображения
const removeImage = (index: number) => {
  form.images.splice(index, 1)
}
</script>

<style scoped>
.mw-1000 {
  max-width: 1000px;
  margin: 0 auto;
}
.dashed-border {
  border-style: dashed !important;
  border-width: 2px !important;
  border-color: #e0e0e0 !important;
}
.cursor-pointer {
  cursor: pointer;
}
.position-relative {
  position: relative;
}
.position-absolute {
  position: absolute;
}
</style>
