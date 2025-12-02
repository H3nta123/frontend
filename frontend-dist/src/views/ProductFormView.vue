<template>
  <MainLayout>
    <v-container fluid class="pa-0 mw-1000">

      <!-- Верхняя панель -->
      <div class="d-flex align-center justify-space-between mb-6">
        <div class="d-flex align-center">
          <v-btn icon="mdi-arrow-left" variant="text" to="/catalog" class="mr-2"></v-btn>
          <h1 class="text-h5 font-weight-bold">Добавить товар</h1>
        </div>
        <div class="d-flex gap-2">
          <v-btn variant="outlined" color="black" class="text-none font-weight-bold" rounded="lg">Отмена</v-btn>
          <v-btn color="#37E23F" class="text-white text-none font-weight-bold" elevation="0" rounded="lg">Сохранить</v-btn>
        </div>
      </div>

      <v-row>
        <!-- ЛЕВАЯ КОЛОНКА (Основной контент) -->
        <v-col cols="12" md="8">

          <!-- Карточка: Название и описание -->
          <v-card class="rounded-xl border mb-6" flat>
            <div class="pa-6">
              <label class="text-caption font-weight-bold text-grey-darken-1 mb-2 d-block">Название</label>
              <v-text-field
                placeholder="Например, Футболка oversize"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
                class="mb-6"
              ></v-text-field>

              <label class="text-caption font-weight-bold text-grey-darken-1 mb-2 d-block">Описание</label>
              <v-textarea
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
              <v-sheet
                color="grey-lighten-5"
                class="border dashed-border rounded-lg d-flex flex-column align-center justify-center pa-8 cursor-pointer"
                height="200"
              >
                <div class="d-flex gap-2 mb-2">
                  <v-btn size="small" variant="flat" color="white" class="text-none border">Добавить файл</v-btn>
                  <v-btn size="small" variant="text" class="text-none text-decoration-underline">Добавить по URL</v-btn>
                </div>
                <div class="text-caption text-grey">Принимаем изображения, видео или 3D-модели</div>
              </v-sheet>
            </div>
          </v-card>

          <!-- Карточка: Цены -->
          <v-card class="rounded-xl border mb-6" flat>
            <div class="pa-6">
              <h3 class="text-body-1 font-weight-bold mb-4">Цены</h3>
              <v-row>
                <v-col cols="6">
                  <label class="text-caption font-weight-bold text-grey-darken-1 mb-2 d-block">Цена</label>
                  <v-text-field
                    prefix="₽"
                    placeholder="0.00"
                    variant="outlined"
                    density="comfortable"
                    hide-details
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <label class="text-caption font-weight-bold text-grey-darken-1 mb-2 d-block">Цена до скидки</label>
                  <v-text-field
                    prefix="₽"
                    placeholder="0.00"
                    variant="outlined"
                    density="comfortable"
                    hide-details
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-checkbox label="Начислять налог на этот товар" density="compact" hide-details class="mt-2"></v-checkbox>
            </div>
          </v-card>

          <!-- Карточка: Учет товаров (Inventory) -->
          <v-card class="rounded-xl border mb-6" flat>
            <div class="pa-6">
              <h3 class="text-body-1 font-weight-bold mb-4">Учет товаров</h3>
              <v-row>
                <v-col cols="6">
                  <label class="text-caption font-weight-bold text-grey-darken-1 mb-2 d-block">Артикул (SKU)</label>
                  <v-text-field variant="outlined" density="comfortable" hide-details></v-text-field>
                </v-col>
                <v-col cols="6">
                  <label class="text-caption font-weight-bold text-grey-darken-1 mb-2 d-block">Штрихкод (ISBN, UPC)</label>
                  <v-text-field variant="outlined" density="comfortable" hide-details></v-text-field>
                </v-col>
              </v-row>

              <v-checkbox label="Отслеживать количество" model-value="true" density="compact" hide-details class="mt-4 mb-2"></v-checkbox>

              <v-divider class="my-4"></v-divider>

              <div class="d-flex justify-space-between align-center" style="max-width: 300px;">
                <span class="text-body-2">Доступно</span>
                <v-text-field
                  type="number"
                  variant="outlined"
                  density="compact"
                  style="max-width: 120px;"
                  hide-details
                  model-value="0"
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
                model-value="Активный"
                :items="['Активный', 'Черновик']"
                variant="outlined"
                density="comfortable"
                hide-details
              >
                <template v-slot:selection="{ item }">
                  <v-icon :color="item.title === 'Активный' ? 'green' : 'grey'" icon="mdi-circle-small" class="mr-2"></v-icon>
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
              <v-select label="Выбрать категорию" variant="outlined" density="comfortable" hide-details class="mb-4"></v-select>

              <label class="text-caption font-weight-bold text-grey-darken-1 mb-2 d-block">Тип товара</label>
              <v-text-field placeholder="Например, Футболки" variant="outlined" density="comfortable" hide-details class="mb-4"></v-text-field>

              <label class="text-caption font-weight-bold text-grey-darken-1 mb-2 d-block">Производитель</label>
              <v-text-field placeholder="Например, Nike" variant="outlined" density="comfortable" hide-details class="mb-4"></v-text-field>

              <label class="text-caption font-weight-bold text-grey-darken-1 mb-2 d-block">Коллекции</label>
              <v-select label="Найти коллекции" multiple chips variant="outlined" density="comfortable" hide-details class="mb-4"></v-select>

              <label class="text-caption font-weight-bold text-grey-darken-1 mb-2 d-block">Теги</label>
              <v-text-field placeholder="Винтаж, Хлопок, Лето" variant="outlined" density="comfortable" hide-details></v-text-field>
            </div>
          </v-card>

        </v-col>
      </v-row>

    </v-container>
  </MainLayout>
</template>

<script setup lang="ts">
import MainLayout from '@/layouts/MainLayout.vue';
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
</style>
