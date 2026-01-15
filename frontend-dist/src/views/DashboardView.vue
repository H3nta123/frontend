<template>
  <MainLayout>
    <v-container fluid class="pa-0 mw-1200">
      
      <!-- Welcome Banner -->
      <div class="welcome-banner rounded-xl px-8 py-10 mb-8 d-flex align-center justify-space-between text-white elevation-4">
        <div>
          <h1 class="text-h4 font-weight-bold mb-2">Добро пожаловать, {{ authStore.user?.name || 'Предприниматель' }}!</h1>
          <p class="text-body-1 opacity-90" style="max-width: 600px;">
            Управляйте своим магазином, следите за продажами и развивайте бизнес в одном месте.
          </p>
        </div>
        <v-icon icon="mdi-rocket-launch-outline" size="120" class="opacity-20 hidden-sm-and-down"></v-icon>
      </div>

      <!-- Stats / Status Row -->
      <v-row class="mb-4">
        <v-col cols="12" md="4">
          <v-card class="rounded-xl border pa-4 h-100 d-flex align-center" flat>
             <v-avatar color="indigo-lighten-5" size="56" class="mr-4 rounded-lg">
               <v-icon icon="mdi-wallet" color="#2A1A8E" size="32"></v-icon>
             </v-avatar>
             <div>
               <div class="text-caption text-grey font-weight-bold">ВАШ БАЛАНС</div>
               <div class="text-h5 font-weight-bold">{{ balanceStore.availableBalance }} ₽</div>
             </div>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card class="rounded-xl border pa-4 h-100 d-flex align-center" flat>
             <v-avatar :color="activeStore ? 'green-lighten-5' : 'orange-lighten-5'" size="56" class="mr-4 rounded-lg">
               <v-icon icon="mdi-store" :color="activeStore ? 'green-darken-2' : 'orange-darken-3'" size="32"></v-icon>
             </v-avatar>
             <div>
               <div class="text-caption text-grey font-weight-bold">СТАТУС МАГАЗИНА</div>
               <div class="text-h6 font-weight-bold ml-0">
                 <span v-if="activeStore" class="text-green-darken-1">Активен</span>
                 <span v-else class="text-orange-darken-3">Не активен</span>
               </div>
             </div>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card class="rounded-xl border pa-4 h-100 d-flex align-center" flat>
             <v-avatar color="orange-lighten-5" size="56" class="mr-4 rounded-lg">
               <v-icon icon="mdi-package-variant-closed" color="orange-darken-3" size="32"></v-icon>
             </v-avatar>
             <div>
               <div class="text-caption text-grey font-weight-bold">НОВЫЕ ЗАКАЗЫ</div>
               <div class="text-h5 font-weight-bold">0</div>
             </div>
          </v-card>
        </v-col>
      </v-row>

      <!-- Main Actions -->
      <h2 class="text-h5 font-weight-bold mb-4 mt-4">Быстрые действия</h2>
      <v-row>
        <!-- Карточка конструктора -->
        <v-col cols="12" md="6">
          <v-card 
            class="rounded-xl border pa-0 h-100 cursor-pointer hover-scale overflow-hidden" 
            flat 
            @click="goToBuilder"
          >
            <div class="d-flex h-100">
              <div class="pa-6 d-flex flex-column justify-center" style="flex: 1;">
                 <div class="d-flex align-center mb-3">
                   <v-sheet color="indigo-lighten-5" width="40" height="40" rounded class="d-flex align-center justify-center mr-3">
                     <v-icon icon="mdi-palette" color="#2A1A8E"></v-icon>
                   </v-sheet>
                   <span class="text-overline text-indigo font-weight-bold">Конструктор</span>
                 </div>
                 <h3 class="text-h5 font-weight-bold mb-2">Редактировать магазин</h3>
                 <p class="text-body-2 text-grey-darken-1 mb-4">Настройте дизайн, добавьте товары и управляйте контентом вашего сайта.</p>
                 <div class="d-flex align-center text-indigo font-weight-bold">
                   Перейти в конструктор
                   <v-icon icon="mdi-arrow-right" class="ml-2" size="small"></v-icon>
                 </div>
              </div>
              <div class="bg-indigo-lighten-5 d-none d-sm-flex align-center justify-center" style="width: 160px;">
                 <v-icon icon="mdi-monitor-dashboard" size="80" color="indigo-lighten-3"></v-icon>
              </div>
            </div>
          </v-card>
        </v-col>
        

      </v-row>

    </v-container>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import { useAuthStore } from '@/stores/auth'
import { useBalanceStore } from '@/stores/balance'
import { sitesService } from '@/services/sites'

const router = useRouter()
const authStore = useAuthStore()
const balanceStore = useBalanceStore()
const activeStore = ref<any>(null)

const checkStoreStatus = async () => {
    try {
        const response = await sitesService.getUserSites()
        const sites = Array.isArray(response) ? response : (response.sites || [])
        activeStore.value = sites.find((s: any) => s.is_active || s.active)
    } catch (e) {
        console.error('Error checking store status', e)
    }
}

onMounted(() => {
    checkStoreStatus()
})

const goToBuilder = async () => {
    try {
        const response = await sitesService.getUserSites()
        const sites = Array.isArray(response) ? response : (response.sites || [])
        
        // Filter for active sites (Assuming 'is_active' or similar property, adjusting based on StoresView logic)
        // In StoresView we saw logic: active: s.is_active || s.active || false
        
        const activeSite = sites.find((s: any) => s.is_active || s.active)

        if (activeSite) {
            router.push(`/builder?storeId=${activeSite.id}`)
        } else {
            // No active site -> redirect to stores to pay/create
            router.push('/stores')
        }
    } catch (e) {
        console.error('Error checking sites', e)
        router.push('/stores')
    }
}
</script>

<style scoped>
.mw-1200 {
  max-width: 1200px;
  margin: 0 auto;
}
.welcome-banner {
  background: linear-gradient(135deg, #2A1A8E 0%, #4527A0 50%, #7C4DFF 100%);
  position: relative;
  overflow: hidden;
}
.cursor-pointer {
    cursor: pointer;
}
.hover-scale {
    transition: transform 0.2s, box-shadow 0.2s;
}
.hover-scale:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
}
</style>
