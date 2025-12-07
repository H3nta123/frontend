<template>
  <MainLayout>
    <!-- Заголовок -->
    <div class="d-flex justify-space-between align-center mb-8">
      <div>
        <h1 class="text-h5 font-weight-bold text-black">Дерево каталога</h1>
        <p class="text-body-2 text-grey-darken-1 mt-1">Управление категориями товаров</p>
      </div>

      <v-btn
        color="#4527A0"
        prepend-icon="mdi-plus"
        class="text-none text-white font-weight-bold px-6"
        height="44"
        rounded="lg"
        elevation="0"
        @click="openCreateDialog(null)"
      >
        Добавить категорию
      </v-btn>
    </div>

    <!-- Загрузка -->
    <div v-if="categoriesStore.loading && categoriesStore.categories.length === 0" class="d-flex justify-center py-16">
      <v-progress-circular indeterminate color="#4527A0" size="48"></v-progress-circular>
    </div>

    <!-- Ошибка -->
    <v-alert v-else-if="categoriesStore.error" type="error" class="mb-4" closable>
      {{ categoriesStore.error }}
    </v-alert>

    <!-- Пустой список -->
    <v-card v-else-if="categoriesStore.categories.length === 0" class="rounded-xl border pa-12 text-center" flat>
      <v-icon icon="mdi-folder-outline" size="64" color="grey-lighten-1" class="mb-4"></v-icon>
      <h3 class="text-h6 font-weight-bold mb-2">Категорий пока нет</h3>
      <p class="text-body-2 text-grey mb-6">Создайте первую категорию для организации товаров</p>
      <v-btn
        color="#4527A0"
        prepend-icon="mdi-plus"
        class="text-none text-white font-weight-bold"
        rounded="lg"
        @click="openCreateDialog(null)"
      >
        Создать категорию
      </v-btn>
    </v-card>

    <!-- Дерево категорий -->
    <v-card v-else class="rounded-xl border" flat>
      <v-list class="py-0">
        <template v-for="category in categoriesStore.categoryTree" :key="category.id">
          <!-- Уровень 0 -->
          <v-list-item class="py-3 border-b">
            <template #prepend>
              <v-btn
                v-if="category.children.length > 0"
                icon
                variant="text"
                size="small"
                class="mr-2"
                @click="toggleExpand(category.id)"
              >
                <v-icon :icon="expanded[category.id] ? 'mdi-chevron-down' : 'mdi-chevron-right'" size="small"></v-icon>
              </v-btn>
              <div v-else style="width: 36px"></div>
              <v-icon :icon="category.children.length > 0 ? 'mdi-folder' : 'mdi-folder-outline'" color="#4527A0" class="mr-3"></v-icon>
            </template>
            <v-list-item-title class="font-weight-medium">{{ category.name }}</v-list-item-title>
            <template #append>
              <div class="d-flex align-center gap-1">
                <v-btn variant="text" size="small" icon="mdi-plus" color="grey" title="Добавить подкатегорию" @click="openCreateDialog(category.id)"></v-btn>
                <v-btn variant="text" size="small" icon="mdi-pencil" color="grey" title="Редактировать" @click="openEditDialog(category)"></v-btn>
                <v-btn variant="text" size="small" icon="mdi-trash-can-outline" color="red" title="Удалить" @click="openDeleteDialog(category)"></v-btn>
              </div>
            </template>
          </v-list-item>

          <!-- Уровень 1 (дети) -->
          <template v-if="expanded[category.id]">
            <template v-for="child in category.children" :key="child.id">
              <v-list-item class="py-3 border-b" style="padding-left: 48px;">
                <template #prepend>
                  <v-btn
                    v-if="child.children.length > 0"
                    icon
                    variant="text"
                    size="small"
                    class="mr-2"
                    @click="toggleExpand(child.id)"
                  >
                    <v-icon :icon="expanded[child.id] ? 'mdi-chevron-down' : 'mdi-chevron-right'" size="small"></v-icon>
                  </v-btn>
                  <div v-else style="width: 36px"></div>
                  <v-icon :icon="child.children.length > 0 ? 'mdi-folder' : 'mdi-folder-outline'" color="#7C84D4" class="mr-3"></v-icon>
                </template>
                <v-list-item-title class="font-weight-medium">{{ child.name }}</v-list-item-title>
                <template #append>
                  <div class="d-flex align-center gap-1">
                    <v-btn variant="text" size="small" icon="mdi-plus" color="grey" @click="openCreateDialog(child.id)"></v-btn>
                    <v-btn variant="text" size="small" icon="mdi-pencil" color="grey" @click="openEditDialog(child)"></v-btn>
                    <v-btn variant="text" size="small" icon="mdi-trash-can-outline" color="red" @click="openDeleteDialog(child)"></v-btn>
                  </div>
                </template>
              </v-list-item>

              <!-- Уровень 2 (внуки) -->
              <template v-if="expanded[child.id]">
                <v-list-item
                  v-for="grandchild in child.children"
                  :key="grandchild.id"
                  class="py-3 border-b"
                  style="padding-left: 96px;"
                >
                  <template #prepend>
                    <div style="width: 36px"></div>
                    <v-icon icon="mdi-folder-outline" color="#9E9E9E" class="mr-3"></v-icon>
                  </template>
                  <v-list-item-title class="font-weight-medium">{{ grandchild.name }}</v-list-item-title>
                  <template #append>
                    <div class="d-flex align-center gap-1">
                      <v-btn variant="text" size="small" icon="mdi-pencil" color="grey" @click="openEditDialog(grandchild)"></v-btn>
                      <v-btn variant="text" size="small" icon="mdi-trash-can-outline" color="red" @click="openDeleteDialog(grandchild)"></v-btn>
                    </div>
                  </template>
                </v-list-item>
              </template>
            </template>
          </template>
        </template>
      </v-list>
    </v-card>

    <!-- Диалог создания/редактирования -->
    <v-dialog v-model="formDialog" max-width="500">
      <v-card class="rounded-xl">
        <v-card-title class="text-h6 font-weight-bold pa-6 pb-2">
          {{ editingCategory ? 'Редактировать категорию' : 'Новая категория' }}
        </v-card-title>
        <v-card-text class="px-6 pb-4">
          <label class="text-caption font-weight-bold text-grey-darken-1 mb-2 d-block">Название *</label>
          <v-text-field
            v-model="form.name"
            placeholder="Введите название"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
            class="mb-4"
            :error-messages="formError"
          ></v-text-field>

          <label class="text-caption font-weight-bold text-grey-darken-1 mb-2 d-block">Родительская категория</label>
          <v-select
            v-model="form.parentId"
            :items="parentOptions"
            item-title="name"
            item-value="id"
            placeholder="Без родителя (корневая)"
            variant="outlined"
            density="comfortable"
            hide-details
            clearable
          ></v-select>
        </v-card-text>
        <v-card-actions class="pa-6 pt-0">
          <v-spacer></v-spacer>
          <v-btn variant="text" class="text-none" @click="formDialog = false">Отмена</v-btn>
          <v-btn 
            color="#4527A0" 
            variant="flat" 
            class="text-none font-weight-bold text-white" 
            rounded="lg"
            :loading="categoriesStore.loading"
            @click="handleSave"
          >
            {{ editingCategory ? 'Сохранить' : 'Создать' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Диалог подтверждения удаления -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card class="rounded-xl">
        <v-card-title class="text-h6 font-weight-bold pa-6 pb-2">
          Удалить категорию?
        </v-card-title>
        <v-card-text class="px-6 pb-4">
          Вы уверены, что хотите удалить категорию <strong>{{ categoryToDelete?.name }}</strong>?
          <br><br>
          <v-alert type="warning" density="compact" class="text-caption">
            Все дочерние категории также будут удалены!
          </v-alert>
        </v-card-text>
        <v-card-actions class="pa-6 pt-0">
          <v-spacer></v-spacer>
          <v-btn variant="text" class="text-none" @click="deleteDialog = false">Отмена</v-btn>
          <v-btn 
            color="red" 
            variant="flat" 
            class="text-none font-weight-bold" 
            rounded="lg"
            :loading="categoriesStore.loading"
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
import { ref, reactive, computed, onMounted } from 'vue'
import MainLayout from '@/layouts/MainLayout.vue'
import { useCategoriesStore, type Category } from '@/stores/categories'

const categoriesStore = useCategoriesStore()

// Dialogs
const formDialog = ref(false)
const deleteDialog = ref(false)

// Expanded state for tree nodes
const expanded = ref<Record<number, boolean>>({})

// Form state
const editingCategory = ref<Category | null>(null)
const categoryToDelete = ref<Category | null>(null)
const formError = ref('')

const form = reactive({
  name: '',
  parentId: null as number | null,
})

// Опции для выбора родителя
const parentOptions = computed(() => {
  return categoriesStore.categories.filter(c => {
    if (editingCategory.value) {
      return c.id !== editingCategory.value.id
    }
    return true
  })
})

// Загрузка при монтировании
onMounted(() => {
  categoriesStore.fetchCategories()
  // Развернуть корневые категории по умалчанию
  setTimeout(() => {
    categoriesStore.categoryTree.forEach(c => {
      expanded.value[c.id] = true
    })
  }, 400)
})

// Toggle expand/collapse
const toggleExpand = (id: number) => {
  expanded.value[id] = !expanded.value[id]
}

// Открыть диалог создания
const openCreateDialog = (parentId: number | null) => {
  editingCategory.value = null
  form.name = ''
  form.parentId = parentId
  formError.value = ''
  formDialog.value = true
}

// Открыть диалог редактирования
const openEditDialog = (category: Category) => {
  editingCategory.value = category
  form.name = category.name
  form.parentId = category.parentId
  formError.value = ''
  formDialog.value = true
}

// Открыть диалог удаления
const openDeleteDialog = (category: Category) => {
  categoryToDelete.value = category
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
    parentId: form.parentId,
  }

  let success = false

  if (editingCategory.value) {
    const result = await categoriesStore.updateCategory(editingCategory.value.id, data)
    success = !!result
  } else {
    const result = await categoriesStore.createCategory(data)
    success = !!result
  }

  if (success) {
    formDialog.value = false
  }
}

// Удаление
const handleDelete = async () => {
  if (!categoryToDelete.value) return

  const success = await categoriesStore.deleteCategory(categoryToDelete.value.id)
  if (success) {
    deleteDialog.value = false
    categoryToDelete.value = null
  }
}
</script>
