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
    <v-dialog v-model="createDialog" max-width="500">
      <v-card class="rounded-xl pa-4">
        <v-card-title class="font-weight-bold text-h5 px-4 pt-4">Новый магазин</v-card-title>
        <v-card-text class="px-4">
          <p class="text-body-2 text-grey-darken-1 mb-6">Создайте новый магазин и начните продавать.</p>
          
          <label class="font-weight-bold text-caption mb-1 d-block">Название магазина</label>
          <v-text-field
            v-model="newStore.name"
            variant="outlined"
            density="compact"
            placeholder="Мой крутой магазин"
            class="mb-4"
            rounded="lg"
          ></v-text-field>

          <label class="font-weight-bold text-caption mb-1 d-block">Поддомен</label>
          <v-text-field
            v-model="newStore.subdomain"
            variant="outlined"
            density="compact"
            placeholder="myshop"
            suffix=".localhost"
            class="mb-4"
            rounded="lg"
          ></v-text-field>

        </v-card-text>
        <v-card-actions class="px-4 pb-4">
          <v-spacer></v-spacer>
          <v-btn variant="text" class="text-none text-grey" rounded="lg" @click="createDialog = false">Отмена</v-btn>
          <v-btn 
            color="#2A1A8E" 
            variant="flat" 
            class="text-none text-white px-6" 
            rounded="lg"
            @click="handleCreate"
            :loading="creating"
          >
            Создать
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

  </MainLayout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import MainLayout from '@/layouts/MainLayout.vue'
import { sitesService } from '@/services/sites'
import { useShopStore } from '@/stores/shop'
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
  subdomain: ''
})

const fetchStores = async () => {
  loading.value = true
  try {
    const dashboardData = await sitesService.getDashboard()
    
    // Предполагаем, что бэкенд возвращает список сайтов в поле sites
    const apiStores: StoreItem[] = (dashboardData.sites || []).map((s: any) => ({
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
  createDialog.value = true
}

const handleCreate = async () => {
  creating.value = true
  try {
    const payload = {
        subdomain: newStore.subdomain,
        pattern: 'minimal-light',
        config: {
            name: newStore.name,
            subdomain: newStore.subdomain,
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
