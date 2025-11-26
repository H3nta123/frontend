<template>
  <v-container fluid class="pa-6">
    <div class="d-flex justify-space-between align-center mb-6">
      <h1 class="text-h5 font-weight-bold">каталог товаров</h1>

      <div class="d-flex align-center">
        <v-btn-toggle
          v-model="viewMode"
          mandatory
          rounded="lg"
          variant="outlined"
          divided
          class="mr-4 bg-white"
          color="primary"
        >
          <v-btn value="grid" icon="mdi-view-grid"></v-btn>
          <v-btn value="list" icon="mdi-format-list-bulleted"></v-btn>
        </v-btn-toggle>

        <v-btn
          color="#4527A0"
          prepend-icon="mdi-plus"
          class="text-none text-white"
          height="40"
          rounded="lg"
          @click="showAddDialog = true"
        >
          добавить товар
        </v-btn>
      </div>
    </div>

    <v-row v-if="viewMode === 'grid'">
      <v-col
        v-for="product in products"
        :key="product.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-card class="pa-3 rounded-xl" flat color="white">
          <v-sheet
            color="grey-lighten-3"
            height="200"
            class="rounded-lg mb-3 d-flex align-center justify-center"
          >
            <v-icon icon="mdi-image-outline" size="64" color="grey-lighten-1"></v-icon>
          </v-sheet>

          <div class="mb-1 font-weight-medium">{{ product.name }}</div>
          <div class="text-blue text-body-1 mb-4">{{ formatPrice(product.price) }}</div>

          <div class="d-flex gap-2">
            <v-btn
              variant="flat"
              color="grey-lighten-3"
              class="flex-grow-1 text-none"
              rounded="lg"
            >
              редактировать <v-icon icon="mdi-pencil" size="small" class="ml-1"></v-icon>
            </v-btn>
            <v-btn
              variant="flat"
              color="red-lighten-5"
              icon
              rounded="lg"
              class="ml-2"
            >
              <v-icon color="red" icon="mdi-trash-can-outline"></v-icon>
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-card v-else flat class="rounded-xl">
      <v-table>
        <thead class="bg-grey-lighten-3">
        <tr>
          <th class="text-left font-weight-bold">изображение</th>
          <th class="text-left font-weight-bold">название</th>
          <th class="text-left font-weight-bold">цена</th>
          <th class="text-right font-weight-bold pr-10">действие</th>
        </tr>
        </thead>
        <tbody>
        <v-tr v-for="product in products" :key="product.id">
          <td class="py-2">
            <v-sheet
              color="grey-lighten-3"
              width="60"
              height="60"
              class="rounded-lg d-flex align-center justify-center"
            >
              <v-icon icon="mdi-image-outline" color="grey-lighten-1"></v-icon>
            </v-sheet>
          </td>
          <td class="font-weight-bold">{{ product.name }}</td>
          <td class="text-blue">{{ formatPrice(product.price) }}</td>
          <td class="text-right">
            <v-btn variant="text" color="blue" class="text-none px-2">
              Редактировать
            </v-btn>
            <v-btn variant="text" color="red" class="text-none px-2">
              Удалить
            </v-btn>
          </td>
        </v-tr>
        </tbody>
      </v-table>
    </v-card>

    <v-dialog v-model="showAddDialog" max-width="600">
      <v-card class="rounded-xl pa-6">
        <h3 class="text-h6 font-weight-bold mb-6">Добавить товар</h3>

        <div class="d-flex">
          <v-sheet
            color="grey-lighten-3"
            width="200"
            height="240"
            class="rounded-xl mr-6 d-flex align-center justify-center cursor-pointer flex-shrink-0"
          >
            <v-icon icon="mdi-plus" size="48" color="black"></v-icon>
          </v-sheet>

          <div class="flex-grow-1">
            <div class="text-body-2 mb-1 text-grey-darken-1">название товара</div>
            <v-text-field
              v-model="newProduct.name"
              placeholder="ведите название"
              variant="outlined"
              density="compact"
              rounded="lg"
              bg-color="white"
              class="mb-4"
            ></v-text-field>

            <div class="text-body-2 mb-1 text-grey-darken-1">цена</div>
            <v-text-field
              v-model="newProduct.price"
              placeholder="ведите цену"
              variant="outlined"
              density="compact"
              rounded="lg"
              bg-color="white"
            ></v-text-field>
          </div>
        </div>

        <v-card-actions class="justify-end mt-4">
          <v-btn color="grey" variant="text" @click="showAddDialog = false">Отмена</v-btn>
          <v-btn color="#4527A0" variant="flat" class="text-white" @click="showAddDialog = false">Сохранить</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const viewMode = ref('grid')
const showAddDialog = ref(false)

const newProduct = ref({
  name: '',
  price: ''
})

const products = ref([
  { id: 1, name: 'наушники', price: 12000 },
  { id: 2, name: 'часы', price: 12000 },
  { id: 3, name: 'наушники', price: 12000 },
  { id: 4, name: 'наушники', price: 12000 },
  { id: 5, name: 'наушники', price: 12000 },
  { id: 6, name: 'наушники', price: 12000 },
])

const formatPrice = (price: number) => {
  return `${price.toLocaleString()} ₽`
}
</script>
