<template>
  <v-container fill-height fluid class="d-flex align-center justify-center">
    <v-card width="450" elevation="10" class="pa-6 rounded-xl">
      <h2 class="text-h5 text-center mb-6 font-weight-bold">Вход в систему</h2>

      <v-form @submit.prevent="handleSubmit">

        <div v-if="step === 1">
          <p class="text-body-2 text-grey mb-4 text-center">
            Введите почту, чтобы получить код доступа
          </p>

          <v-text-field
            v-model="email"
            label="E-mail"
            variant="outlined"
            type="email"
            placeholder="name@example.com"
            prepend-inner-icon="mdi-email-outline"
            density="comfortable"
            :rules="[v => !!v || 'Обязательное поле', v => /.+@.+\..+/.test(v) || 'Некорректный E-mail']"
            autofocus
            :error-messages="authStore.error"
          ></v-text-field>

          <v-btn
            type="submit"
            color="#542F99"
            block
            size="large"
            class="mt-4 text-white text-none font-weight-bold"
            rounded="lg"
            :loading="authStore.loading"
            elevation="0"
          >
            Получить код
          </v-btn>
        </div>

        <div v-else>
          <div class="text-center mb-6">
            <div class="text-body-1 font-weight-bold mb-1">Введите код</div>
            <div class="text-caption text-grey">
              Мы отправили его на {{ email }}
            </div>
          </div>

          <v-otp-input
            v-model="otpCode"
            length="6"
            class="mb-6 justify-center"
            variant="outlined"
            color="primary"
            :disabled="authStore.loading"
          ></v-otp-input>

          <div v-if="authStore.error" class="text-red text-center text-caption mb-2">
            {{ authStore.error }}
          </div>

          <v-btn
            type="submit"
            color="#542F99"
            block
            size="large"
            class="mt-2 text-white text-none font-weight-bold"
            rounded="lg"
            :loading="authStore.loading"
            elevation="0"
          >
            Войти
          </v-btn>

          <v-btn
            variant="text"
            block
            size="small"
            class="mt-4 text-grey"
            @click="step = 1; authStore.error = ''"
          >
            ← Изменить почту
          </v-btn>
        </div>

      </v-form>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
// Импортируем наш новый стор
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

// Локальное состояние компонента
const step = ref(1);
const email = ref('');
const otpCode = ref('');

const handleSubmit = async () => {
  if (step.value === 1) {
    // Логика 1 шага через Store
    const success = await authStore.sendLoginRequest(email.value);
    if (success) {
      step.value = 2;
    }
  } else {
    // Логика 2 шага через Store
    if (!otpCode.value || otpCode.value.length < 5) return;

    const success = await authStore.verifyCode(email.value, otpCode.value);
    if (success) {
      router.push('/dashboard');
    }
  }
};
</script>
