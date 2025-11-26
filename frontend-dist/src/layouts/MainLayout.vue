<template>
  <v-app>
    <!-- === ШАПКА (Header) === -->
    <v-app-bar color="#2A1A8E" height="64" flat class="px-4">
      <!-- Логотип / Иконка меню -->
      <div class="d-flex align-center mr-6">
        <v-avatar color="white" size="40">
          <v-icon icon="mdi-cart-outline" color="black" size="24"></v-icon>
        </v-avatar>
      </div>

      <v-spacer></v-spacer>

      <!-- Поиск по центру -->
      <v-responsive max-width="600" class="mx-4 w-100">
        <v-text-field
          density="compact"
          variant="solo"
          placeholder="введите запрос"
          single-line
          hide-details
          rounded="lg"
          bg-color="white"
          class="custom-search"
          height="40"
        >
          <!-- Иконка поиска -->
          <template v-slot:append-inner>
            <div class="d-flex align-center justify-center ml-2" style="height: 100%;">
              <v-icon icon="mdi-magnify" color="black" size="24"></v-icon>
            </div>
          </template>
        </v-text-field>
      </v-responsive>

      <v-spacer></v-spacer>

      <!-- === БЛОК АВТОРИЗАЦИИ === -->
      <div class="d-flex align-center">
        <template v-if="isAuthenticated">
          <!-- Кнопка "Мои заказы" (видна только если вошел) -->
          <v-btn
            class="text-none mr-4 px-6 font-weight-medium text-body-2"
            color="#7C84D4"
            variant="flat"
            rounded="pill"
            height="36"
          >
            мои заказы
          </v-btn>

          <!-- Аватар Пользователя с Меню (Dropdown) -->
          <v-menu min-width="200px" rounded offset-y>
            <template v-slot:activator="{ props }">
              <v-btn icon v-bind="props">
                <v-avatar color="#7C84D4" size="42" class="cursor-pointer">
                  <span class="text-white text-h6 font-weight-medium">N</span>
                </v-avatar>
              </v-btn>
            </template>
            <v-card>
              <v-card-text>
                <div class="mx-auto text-center">
                  <v-avatar color="#7C84D4" class="mb-3">
                    <span class="text-white text-h6">N</span>
                  </v-avatar>
                  <h3>Пользователь</h3>
                  <p class="text-caption mt-1 text-grey">
                    user@example.com
                  </p>
                  <v-divider class="my-3"></v-divider>
                  <v-btn rounded variant="text" block color="red" @click="logout">
                    Выйти
                  </v-btn>
                </div>
              </v-card-text>
            </v-card>
          </v-menu>
        </template>

        <!-- Если НЕ авторизован (Текст "Войти" и "Создать магазин") -->
        <template v-else>
          <router-link
            to="/login"
            class="text-white font-weight-bold text-body-1 text-decoration-none mr-6 hover-opacity"
          >
            Войти
          </router-link>
          <router-link
            to="/login"
            class="text-white font-weight-bold text-body-1 text-decoration-none hover-opacity"
          >
            Создать магазин
          </router-link>
        </template>
      </div>

    </v-app-bar>

    <!-- === БОКОВОЕ МЕНЮ (Sidebar) === -->
    <v-navigation-drawer
      permanent
      color="#E0E0E0"
      width="280"
      class="border-none pt-6 px-3"
    >
      <v-list class="bg-transparent">
        <!-- Пункт: Главное -->
        <v-list-item class="pa-0 mb-2" :ripple="false">
          <router-link to="/dashboard" custom v-slot="{ navigate, isActive }">
            <div
              @click="navigate"
              class="sidebar-item d-flex align-center px-4 py-3 rounded-lg cursor-pointer"
              :class="{ 'active': isActive }"
            >
              <span class="font-weight-bold text-body-2 mr-auto">главное</span>
              <v-icon icon="mdi-store" size="small"></v-icon>
            </div>
          </router-link>
        </v-list-item>

        <v-divider class="mb-2 border-opacity-50" color="grey"></v-divider>

        <!-- Пункт: Каталог -->
        <v-list-item class="pa-0 mb-2" :ripple="false">
          <router-link to="/catalog" custom v-slot="{ navigate, isActive }">
            <div
              @click="navigate"
              class="sidebar-item d-flex align-center px-4 py-3 rounded-lg cursor-pointer"
              :class="{ 'active': isActive }"
            >
              <span class="font-weight-bold text-body-2 mr-auto">каталог товаров</span>
              <v-icon icon="mdi-storefront-outline" size="small"></v-icon>
            </div>
          </router-link>
        </v-list-item>

        <v-divider class="mb-2 border-opacity-50" color="grey"></v-divider>

        <!-- Пункт: Конструктор -->
        <v-list-item class="pa-0 mb-2" :ripple="false">
          <router-link to="/builder" custom v-slot="{ navigate, isActive }">
            <div
              @click="navigate"
              class="sidebar-item d-flex align-center px-4 py-3 rounded-lg cursor-pointer"
              :class="{ 'active': isActive }"
            >
              <span class="font-weight-bold text-body-2">конструктор магазина</span>
            </div>
          </router-link>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- === ОСНОВНОЙ КОНТЕНТ === -->
    <v-main class="bg-white">
      <div class="pa-8 h-100">
        <slot></slot>
      </div>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isAuthenticated = ref(false);

// Проверяем авторизацию при загрузке
onMounted(() => {
  isAuthenticated.value = localStorage.getItem('is_authenticated') === 'true';
});

const logout = () => {
  localStorage.removeItem('is_authenticated');
  isAuthenticated.value = false;
  router.push('/login');
};
</script>

<style scoped lang="scss">
/* Кастомные стили для поиска */
.custom-search :deep(.v-field) {
  box-shadow: none !important;
  padding-right: 0 !important;
}

/* Выравнивание иконки поиска внутри инпута */
.custom-search :deep(.v-field__append-inner) {
  padding-top: 0;
  align-items: center;
}

/* Эффект наведения на текстовые ссылки */
.hover-opacity {
  transition: opacity 0.2s;
  &:hover {
    opacity: 0.8;
  }
}

/* Стили для пунктов меню */
.sidebar-item {
  transition: all 0.2s ease;
  color: #000;

  &.active {
    background-color: #4527A0;
    color: white !important;

    .v-icon {
      color: white !important;
    }
  }

  &:hover:not(.active) {
    background-color: rgba(0,0,0,0.05);
  }
}

.cursor-pointer {
  cursor: pointer;
}
</style>
