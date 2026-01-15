<template>
  <MainLayout>
    <div class="d-flex justify-space-between align-center mb-6">
      <h1 class="text-h4 font-weight-bold">Мои магазины</h1>
      <v-btn
        color="#2A1A8E"
        prepend-icon="mdi-plus"
        class="text-none text-white px-6"
        rounded="lg"
        @click="openCreateDialog"
      >
        Создать магазин
      </v-btn>
    </div>

    <!-- Список магазинов (Заглушка или из стора) -->
    <v-row>
      <v-col cols="12" md="4" v-for="store in stores" :key="store.id">
        <v-card class="rounded-xl border hover-card" elevation="0">
          <v-card-item class="pa-4">
            <template v-slot:prepend>
              <v-avatar color="#E8EAF6" size="48" rounded="lg">
                <v-icon icon="mdi-store" color="#2A1A8E" size="28"></v-icon>
              </v-avatar>
            </template>
            <v-card-title class="font-weight-bold">{{ store.name }}</v-card-title>
            <v-card-subtitle class="text-caption mt-1">{{ store.subdomain }}.localhost</v-card-subtitle>
             <template v-slot:append>
               <v-chip size="small" :color="store.active ? 'green' : 'grey'" label class="font-weight-bold">
                 {{ store.active ? 'Активен' : 'Неактивен' }}
               </v-chip>
             </template>
          </v-card-item>

          <v-divider></v-divider>

          <v-card-actions class="pa-4 pt-2">
            <v-btn 
              variant="text" 
              size="small" 
              class="text-none" 
              color="grey-darken-1"
              :href="`http://${store.subdomain}.localhost:3000/shop/preview`"
              target="_blank"
            >
              <v-icon icon="mdi-open-in-new" size="small" class="mr-1"></v-icon>
              Открыть
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              variant="flat"
              class="text-none font-weight-bold bg-grey-lighten-4"
              color="#2A1A8E"
              rounded="lg"
              :to="`/builder?storeId=${store.id}`"
            >
              Конструктор
            </v-btn>
             <v-btn
              v-if="!store.active"
              variant="flat"
              class="text-none font-weight-bold ml-2"
              color="orange-darken-1"
              rounded="lg"
              @click="openPaymentDialog(store.id)"
            >
              Оплатить
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Диалог создания -->
    <v-dialog v-model="createDialog" max-width="900" persistent>
      <v-card class="rounded-xl overflow-visible">
        <v-card-title class="pa-6 pb-2 d-flex justify-space-between align-center">
            <span class="text-h5 font-weight-bold">Создание магазина</span>
            <div class="d-flex align-center">
                <v-chip size="small" :color="step === 1 ? 'indigo' : 'grey-lighten-2'" class="mr-2 font-weight-bold">1. Данные</v-chip>
                <v-icon icon="mdi-chevron-right" size="small" class="mr-2 text-grey-lighten-1"></v-icon>
                <v-chip size="small" :color="step === 2 ? 'indigo' : 'grey-lighten-2'" class="mr-2 font-weight-bold">2. Дизайн</v-chip>
                <v-icon icon="mdi-chevron-right" size="small" class="mr-2 text-grey-lighten-1"></v-icon>
                <v-chip size="small" :color="step === 3 ? 'indigo' : 'grey-lighten-2'" class="font-weight-bold">3. Товары</v-chip>
            </div>
        </v-card-title>
        
        <v-divider></v-divider>

        <v-window v-model="step" class="pa-6">
            <!-- ШАГ 1: Основные данные -->
            <v-window-item :value="1">
                <p class="text-body-1 text-grey-darken-1 mb-6">Придумайте название и адрес для вашего будущего магазина.</p>
                
                <v-row>
                    <v-col cols="12" md="6">
                        <label class="font-weight-bold text-caption mb-1 d-block">Название магазина</label>
                        <v-text-field
                            v-model="newStore.name"
                            variant="outlined"
                            placeholder="Мой крутой магазин"
                            rounded="lg"
                            bg-color="grey-lighten-5"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                        <label class="font-weight-bold text-caption mb-1 d-block">Поддомен</label>
                        <v-text-field
                            v-model="newStore.subdomain"
                            variant="outlined"
                            placeholder="myshop"
                            suffix=".localhost"
                            rounded="lg"
                            bg-color="grey-lighten-5"
                        ></v-text-field>
                    </v-col>
                </v-row>
            </v-window-item>

            <!-- ШАГ 2: Дизайн и Шаблон -->
            <v-window-item :value="2">
                <v-row>
                    <!-- Settings Column -->
                    <v-col cols="12" md="7">
                        <p class="text-body-1 text-grey-darken-1 mb-4">Выберите старт: готовый шаблон или свой стиль.</p>
                        
                        <div class="mb-6">
                            <label class="font-weight-bold text-caption mb-3 d-block text-grey-darken-2">ШАБЛОНЫ</label>
                            <v-slide-group show-arrows center-active class="pa-1">
                                <v-slide-group-item
                                    v-for="template in THEME_TEMPLATES"
                                    :key="template.id"
                                    v-slot="{ isSelected, toggle }"
                                >
                                    <v-card
                                        width="200"
                                        height="140"
                                        class="ma-2 rounded-xl position-relative d-flex flex-column hover-card border transition-swing"
                                        :class="{'ring-2 ring-indigo border-indigo': newStore.templateId === template.id}"
                                        :elevation="newStore.templateId === template.id ? 4 : 0"
                                        @click="selectTemplate(template)"
                                        variant="flat"
                                        color="white"
                                    >
                                        <!-- Visual Preview -->
                                        <div class="flex-grow-1 d-flex flex-column" :style="`background-color: ${template.settings.backgroundColor}`">
                                            <div class="pa-2 d-flex justify-space-between align-center border-b">
                                               <div class="rounded-pill bg-grey-lighten-3" style="width: 16px; height: 6px;"></div>
                                            </div>
                                            <div class="pa-2 d-flex align-center justify-center flex-grow-1">
                                                 <div class="text-center w-100">
                                                    <div class="mb-1 mx-auto rounded" :style="`width: 60%; height: 8px; background-color: ${template.settings.primaryColor}`"></div>
                                                    <div class="mx-auto rounded opacity-50" :style="`width: 40%; height: 6px; background-color: ${template.settings.secondaryColor}`"></div>
                                                 </div>
                                            </div>
                                        </div>
                                        <div class="pa-3 bg-white border-t">
                                            <div class="text-subtitle-2 font-weight-bold">{{ template.name }}</div>
                                        </div>
                                        <div v-if="newStore.templateId === template.id" class="position-absolute top-0 right-0 ma-1 bg-white rounded-circle">
                                            <v-icon icon="mdi-check-circle" color="indigo" size="20"></v-icon>
                                        </div>
                                    </v-card>
                                </v-slide-group-item>
                            </v-slide-group>
                        </div>

                        <v-expansion-panels variant="outlined" class="mb-4 rounded-lg border-0">
                            <v-expansion-panel elevation="0" class="border-0 bg-grey-lighten-5 rounded-lg">
                                <v-expansion-panel-title class="font-weight-bold text-body-2">
                                   <v-icon icon="mdi-tune" size="small" class="mr-2"></v-icon>
                                   Ручная настройка стиля
                                </v-expansion-panel-title>
                                <v-expansion-panel-text class="pt-4">
                                    
                                    <v-row>
                                        <v-col cols="12" md="6">
                                             <!-- Основной цвет -->
                                            <label class="text-caption font-weight-bold text-grey-darken-1 mb-1 d-block">Основной цвет</label>
                                            <ColorPicker v-model="newStore.primaryColor" class="mb-4 bg-white" />
                                        </v-col>
                                        <v-col cols="12" md="6">
                                             <!-- Вторичный цвет -->
                                            <label class="text-caption font-weight-bold text-grey-darken-1 mb-1 d-block">Вторичный цвет</label>
                                            <ColorPicker v-model="newStore.secondaryColor" class="mb-4 bg-white" />
                                        </v-col>
                                    </v-row>

                                    <v-row>
                                        <v-col cols="12" md="6">
                                              <!-- Фон -->
                                              <label class="text-caption font-weight-bold text-grey-darken-1 mb-1 d-block">Цвет фона</label>
                                              <v-btn-toggle v-model="newStore.settings.backgroundColor" mandatory class="flex-wrap mb-4 bg-white" density="compact">
                                                <v-btn value="#FFFFFF" size="small" class="rounded-lg text-none">
                                                  <v-sheet width="16" height="16" color="#FFFFFF" rounded="circle" class="border mr-2"></v-sheet>
                                                  Белый
                                                </v-btn>
                                                <v-btn value="#FAFAFA" size="small" class="rounded-lg text-none">
                                                  <v-sheet width="16" height="16" color="#FAFAFA" rounded="circle" class="border mr-2"></v-sheet>
                                                  Серый
                                                </v-btn>
                                                <v-btn value="#121212" size="small" class="rounded-lg text-none">
                                                  <v-sheet width="16" height="16" color="#121212" rounded="circle" class="border mr-2"></v-sheet>
                                                  Тёмный
                                                </v-btn>
                                              </v-btn-toggle>
                                        </v-col>
                                        <v-col cols="12" md="6">
                                              <!-- Цвет текста -->
                                              <label class="text-caption font-weight-bold text-grey-darken-1 mb-1 d-block">Цвет текста</label>
                                              <v-btn-toggle v-model="newStore.settings.textColor" mandatory density="compact" class="bg-white">
                                                <v-btn value="#212121" size="small" class="text-none">Тёмный</v-btn>
                                                <v-btn value="#FFFFFF" size="small" class="text-none">Светлый</v-btn>
                                              </v-btn-toggle>
                                        </v-col>
                                    </v-row>

                                </v-expansion-panel-text>
                            </v-expansion-panel>
                        </v-expansion-panels>
                    </v-col>

                    <!-- Preview Column -->
                    <v-col cols="12" md="5" class="d-none d-md-block">
                        <div style="position: sticky; top: 16px;">
                            <label class="font-weight-bold text-caption mb-3 d-block text-grey-darken-2 text-center">ПРЕДПРОСМОТР</label>
                            <StorePreview
                                :name="newStore.name"
                                :subdomain="newStore.subdomain || 'myshop'"
                                :primary-color="newStore.primaryColor"
                                :secondary-color="newStore.secondaryColor"
                                :background-color="newStore.settings.backgroundColor"
                                :text-color="newStore.settings.textColor"
                            />
                        </div>
                    </v-col>
                </v-row>
            </v-window-item>

            <!-- ШАГ 3: Товары -->
            <v-window-item :value="3">
                <p class="text-body-1 text-grey-darken-1 mb-4">Добавьте первые товары в ваш магазин.</p>
                
                <!-- Список добавленных товаров -->
                <div v-if="newStore.products.length > 0" class="mb-4">
                    <v-card v-for="(product, index) in newStore.products" :key="index" class="mb-2 border rounded-lg" elevation="0">
                        <v-card-item class="pa-3">
                            <template v-slot:prepend>
                                <v-avatar size="48" rounded="lg" color="grey-lighten-3">
                                    <v-img v-if="product.imageUrl" :src="product.imageUrl" cover></v-img>
                                    <v-icon v-else icon="mdi-image" color="grey"></v-icon>
                                </v-avatar>
                            </template>
                            <v-card-title class="text-body-1 font-weight-bold">{{ product.name }}</v-card-title>
                            <v-card-subtitle>{{ product.price }} ₽</v-card-subtitle>
                            <template v-slot:append>
                                <v-btn icon="mdi-pencil" variant="text" size="small" @click="editProduct(index)"></v-btn>
                                <v-btn icon="mdi-delete" variant="text" size="small" color="red" @click="removeProduct(index)"></v-btn>
                            </template>
                        </v-card-item>
                    </v-card>
                </div>

                <!-- Пустое состояние -->
                <v-card v-else class="border-dashed rounded-xl pa-8 text-center bg-grey-lighten-5" elevation="0">
                    <v-icon icon="mdi-package-variant" size="48" color="grey-lighten-1" class="mb-3"></v-icon>
                    <p class="text-body-2 text-grey">Пока нет товаров. Добавьте первый!</p>
                </v-card>

                <v-btn
                    color="indigo"
                    variant="outlined"
                    class="text-none mt-4"
                    rounded="lg"
                    prepend-icon="mdi-plus"
                    @click="openProductDialog()"
                >
                    Добавить товар
                </v-btn>

            </v-window-item>
        </v-window>

        <v-divider></v-divider>

        <v-card-actions class="pa-6">
          <v-btn variant="text" class="text-none text-grey" rounded="lg" @click="createDialog = false">Отмена</v-btn>
          <v-spacer></v-spacer>
          
          <v-btn 
            v-if="step === 1"
            color="indigo" 
            variant="flat" 
            class="text-none px-6" 
            rounded="lg"
            @click="step = 2"
            :disabled="!newStore.name || !newStore.subdomain"
          >
            Далее
            <v-icon icon="mdi-arrow-right" end></v-icon>
          </v-btn>

          <v-btn 
            v-if="step === 2"
            variant="text" 
            class="text-none mr-2" 
            rounded="lg"
            @click="step = 1"
          >
            Назад
          </v-btn>

          <v-btn 
            v-if="step === 2"
            color="indigo" 
            variant="flat" 
            class="text-none px-6" 
            rounded="lg"
            @click="step = 3"
          >
            Далее
            <v-icon icon="mdi-arrow-right" end></v-icon>
          </v-btn>

          <v-btn 
            v-if="step === 3"
            variant="text" 
            class="text-none mr-2" 
            rounded="lg"
            @click="step = 2"
          >
            Назад
          </v-btn>

          <v-btn 
            v-if="step === 3"
            color="#2A1A8E" 
            variant="flat" 
            class="text-none text-white px-8" 
            rounded="lg"
            @click="handleCreate"
            :loading="creating"
          >
            Создать магазин
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Диалог оплаты (Заглушка) -->
    <v-dialog v-model="paymentDialog" max-width="400">
      <v-card class="rounded-xl pa-4 text-center">
        <v-card-text class="d-flex flex-column align-center pt-8">
           <v-icon icon="mdi-credit-card-outline" size="64" color="#2A1A8E" class="mb-4"></v-icon>
           <h3 class="text-h5 font-weight-bold mb-2">Требуется оплата</h3>
           <p class="text-body-2 text-grey mb-6">Чтобы подключить свой поддомен, необходимо оплатить подписку.</p>
           
           <v-btn 
             color="#2A1A8E" 
             variant="flat" 
             class="text-none text-white w-100 mb-3" 
             rounded="lg" 
             height="48"
             :loading="paying"
             @click="handlePayment"
            >
             Оплатить 199 ₽
           </v-btn>
           <v-btn variant="text" class="text-none text-grey" size="small" @click="paymentDialog = false">Отмена</v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Диалог добавления/редактирования товара -->
    <v-dialog v-model="productDialog" max-width="500" persistent>
      <v-card class="rounded-xl">
        <v-card-title class="pa-6 pb-3 font-weight-bold">
          {{ editingProductIndex !== null ? 'Редактировать товар' : 'Добавить товар' }}
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pa-6">
          <v-text-field
            v-model="currentProduct.name"
            label="Название товара"
            variant="outlined"
            rounded="lg"
            class="mb-3"
          ></v-text-field>
          <v-text-field
            v-model.number="currentProduct.price"
            label="Цена (₽)"
            variant="outlined"
            rounded="lg"
            type="number"
            class="mb-3"
          ></v-text-field>
          <v-textarea
            v-model="currentProduct.description"
            label="Описание"
            variant="outlined"
            rounded="lg"
            rows="2"
            class="mb-3"
          ></v-textarea>
          <v-text-field
            v-model="currentProduct.imageUrl"
            label="URL изображения"
            variant="outlined"
            rounded="lg"
            placeholder="https://..."
          ></v-text-field>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="pa-6">
          <v-btn variant="text" class="text-none" @click="productDialog = false">Отмена</v-btn>
          <v-spacer></v-spacer>
          <v-btn 
            color="indigo" 
            variant="flat" 
            class="text-none px-6" 
            rounded="lg"
            @click="saveProduct"
            :disabled="!currentProduct.name || currentProduct.price <= 0"
          >
            Сохранить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </MainLayout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, defineComponent, h } from 'vue'
import MainLayout from '@/layouts/MainLayout.vue'
import { sitesService } from '@/services/sites'
import { useShopStore, THEME_TEMPLATES } from '@/stores/shop'
import { useRouter } from 'vue-router'
import { paymentsService } from '@/services/payments'

const router = useRouter()
const shopStore = useShopStore()
const createDialog = ref(false)
const paymentDialog = ref(false)
const paying = ref(false)
const creating = ref(false)
const loading = ref(false)
const selectedStoreId = ref<string | null>(null)
const step = ref(1) // For stepper

// Тип для магазина (упрощенный)
interface StoreItem {
  id: string
  name: string
  subdomain: string
  active: boolean
  pattern: string
  config: any
}

const stores = ref<StoreItem[]>([])

const newStore = reactive({
  name: '',
  subdomain: '',
  templateId: 'minimal-light',
  primaryColor: '#2A1A8E',
  secondaryColor: '#7C4DFF',
  settings: {
      backgroundColor: '#FFFFFF',
      textColor: '#212121',
  },
  // Add type for product including id
  products: [] as Array<{id: string, name: string, price: number, description: string, imageUrl: string}>
})

// Диалог товара
const productDialog = ref(false)
const editingProductIndex = ref<number | null>(null)
const currentProduct = reactive({
    id: '',
    name: '',
    price: 0,
    description: '',
    imageUrl: ''
})

const openProductDialog = (index?: number) => {
    if (index !== undefined) {
        editingProductIndex.value = index
        const p = newStore.products[index]
        currentProduct.id = p.id || crypto.randomUUID()
        currentProduct.name = p.name
        currentProduct.price = p.price
        currentProduct.description = p.description
        currentProduct.imageUrl = p.imageUrl
    } else {
        editingProductIndex.value = null
        currentProduct.id = crypto.randomUUID()
        currentProduct.name = ''
        currentProduct.price = 0
        currentProduct.description = ''
        currentProduct.imageUrl = ''
    }
    productDialog.value = true
}

const saveProduct = () => {
    const product = { ...currentProduct }
    if (editingProductIndex.value !== null) {
        newStore.products[editingProductIndex.value] = product
    } else {
        newStore.products.push(product)
    }
    productDialog.value = false
}

const editProduct = (index: number) => openProductDialog(index)

const removeProduct = (index: number) => {
    newStore.products.splice(index, 1)
}

const currentTemplate = computed(() => 
  THEME_TEMPLATES.find(t => t.id === newStore.templateId) || THEME_TEMPLATES[0]
)

const fetchStores = async () => {
  loading.value = true
  try {
    const response = await sitesService.getUserSites()
    
    // Support both { sites: [...] } and [...]
    const sitesRaw = Array.isArray(response) ? response : (response.sites || [])

    const apiStores: StoreItem[] = sitesRaw.map((s: any) => ({
        id: s.id,
        name: s.config?.name || s.name || 'Магазин',
        subdomain: s.subdomain,
        active: s.is_active || s.active || false,
        pattern: s.pattern || 'minimal-light',
        config: s.config || {}
    }))
    
    stores.value = apiStores

    // Синхронизация с локальным стором (для demo/localhost)
    if (shopStore.settings.subdomain) {
        const exists = stores.value.find(s => s.subdomain === shopStore.settings.subdomain)
        if (!exists) {
            stores.value.unshift({
                id: 'local-current',
                name: shopStore.settings.name,
                subdomain: shopStore.settings.subdomain,
                active: true,
                pattern: 'minimal-light',
                config: shopStore.settings
            })
        }
    }
  } catch (e) {
    console.error('Ошибка загрузки магазинов', e)
    // Fallback?
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchStores()
})

const openCreateDialog = () => {
  newStore.name = ''
  newStore.subdomain = ''
  newStore.templateId = 'minimal-light'
  newStore.products = [] // Сброс товаров
  
  // Set defaults from first template
  const def = THEME_TEMPLATES[0]
  if (def) {
    newStore.primaryColor = def.settings.primaryColor
    newStore.secondaryColor = def.settings.secondaryColor
    newStore.settings.backgroundColor = def.settings.backgroundColor
    newStore.settings.textColor = def.settings.textColor
  }
  
  step.value = 1
  createDialog.value = true
}

const selectTemplate = (template: any) => {
    newStore.templateId = template.id
    newStore.primaryColor = template.settings.primaryColor
    newStore.secondaryColor = template.settings.secondaryColor
    newStore.settings.backgroundColor = template.settings.backgroundColor
    newStore.settings.textColor = template.settings.textColor
}

const handleCreate = async () => {
  creating.value = true
  try {
    const selectedTemplate = THEME_TEMPLATES.find(t => t.id === newStore.templateId)
    const baseSettings = selectedTemplate ? { ...selectedTemplate.settings } : {}

    const payload = {
        subdomain: newStore.subdomain,
        pattern: newStore.templateId,
        config: {
            ...baseSettings,
            name: newStore.name,
            subdomain: newStore.subdomain,
            primaryColor: newStore.primaryColor,
            secondaryColor: newStore.secondaryColor,
            backgroundColor: newStore.settings.backgroundColor,
            textColor: newStore.settings.textColor,
            products: newStore.products, // Товары
        } as any
    }
    
    const response = await sitesService.saveSite(payload)

    createDialog.value = false
    
    // Сразу открываем оплату
    if (response && response.id) {
       // Добавляем в список (как неактивный)
       stores.value.unshift({
           id: response.id,
           name: newStore.name,
           subdomain: newStore.subdomain,
           active: false,
           pattern: payload.pattern,
           config: payload.config
       })
       
       // Запоминаем ID и открываем диалог
       selectedStoreId.value = response.id
       paymentDialog.value = true
    }
    
  } catch (e: any) {
    console.error(e)
    alert(e.message || 'Ошибка при создании магазина. Возможно поддомен занят.')
  } finally {
    creating.value = false
  }
}

const openPaymentDialog = (id: string) => {
    selectedStoreId.value = id
    paymentDialog.value = true
}

const handlePayment = async () => {
    if (!selectedStoreId.value) return
    
    paying.value = true
    try {
        const targetStore = stores.value.find(s => s.id === selectedStoreId.value)
        
        const response = await paymentsService.createPayment({
            site_id: selectedStoreId.value,
            description: `Оплата магазина: ${targetStore?.name || 'Без названия'}`,
            return_url: window.location.origin + '/stores'
        })
        
        if (response.confirmation_url) {
             window.location.href = response.confirmation_url
             return
        }
        
        paymentDialog.value = false
        alert('Оплата инициирована.')
        
    } catch (e: any) {
        console.error('Payment error:', e)
        alert(e.message || 'Ошибка оплаты')
    } finally {
        paying.value = false
    }
}

// Компонент выбора цвета (Ported from BuilderView)
const ColorPicker = defineComponent({
  props: {
    modelValue: { type: String, default: '#000000' }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () => h('div', { class: 'd-flex align-center border rounded pa-2 cursor-pointer' }, [
      h('input', {
        type: 'color',
        value: props.modelValue,
        onInput: (e: Event) => emit('update:modelValue', (e.target as HTMLInputElement).value),
        style: 'width: 32px; height: 32px; border: none; cursor: pointer; border-radius: 4px;'
      }),
      h('span', { class: 'text-body-2 ml-3' }, props.modelValue.toUpperCase())
    ])
  }
})

import StorePreview from '@/components/StorePreview.vue'
</script>

<style scoped>
.hover-card {
  transition: all 0.2s;
  cursor: pointer;
}
.hover-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.08) !important;
  border-color: #2A1A8E !important;
}
</style>
