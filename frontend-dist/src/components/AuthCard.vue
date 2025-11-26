<template>
  <v-container fill-height fluid class="d-flex align-center justify-center">
    <v-card width="450" elevation="10" class="pa-6 rounded-xl">
      <h2 class="text-h5 text-center mb-6 font-weight-bold">Вход в систему</h2>

      <v-form @submit.prevent="handleSubmit">

        <!-- ШАГ 1: Ввод почты -->
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
          ></v-text-field>

          <v-btn
            type="submit"
            color="#542F99"
            block
            size="large"
            class="mt-4 text-white text-none font-weight-bold"
            rounded="lg"
            :loading="loading"
            elevation="0"
          >
            Получить код
          </v-btn>
        </div>

        <!-- ШАГ 2: Ввод кода -->
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
          ></v-otp-input>

          <v-btn
            type="submit"
            color="#542F99"
            block
            size="large"
            class="mt-2 text-white text-none font-weight-bold"
            rounded="lg"
            :loading="loading"
            elevation="0"
          >
            Войти
          </v-btn>

          <v-btn
            variant="text"
            block
            size="small"
            class="mt-4 text-grey"
            @click="step = 1"
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

const router = useRouter();

// --- СОСТОЯНИЕ ---
const step = ref(1);
const loading = ref(false);
const email = ref('');
const otpCode = ref('');

// --- ЛОГИКА ---

const handleSubmit = () => {
  if (step.value === 1) {
    sendLoginRequest();
  } else {
    verifyCode();
  }
};

// ШАГ 1: Отправка запроса на логин
const sendLoginRequest = async () => {
  if (!email.value) return;

  loading.value = true;

  try {
    // Используем существующий эндпоинт логина
    const response = await fetch('/api/v1/auth/login/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value })
    });

    if (response.ok) {
      step.value = 2; // Переход к вводу кода
    } else {
      const error = await response.json();
      alert(error.detail || 'Ошибка запроса. Проверьте почту.');
    }
  } catch (e) {
    console.error(e);
    alert('Нет связи с сервером');
  } finally {
    loading.value = false;
  }
};

// ШАГ 2: Подтверждение кода
const verifyCode = async () => {
  if (!otpCode.value || otpCode.value.length < 5) return alert('Введите полный код!');
  loading.value = true;

  try {
    const payload = {
      email: email.value,
      code: Number(otpCode.value)
    };

    const response = await fetch('/api/v1/auth/login/confirmation/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      const userData = await response.json();
      console.log('Успешный вход:', userData);

      // === ВАЖНО: СОХРАНЕНИЕ ТОКЕНА ===
      localStorage.setItem('is_authenticated', 'true');

      // Если бэкенд возвращает токен в поле 'token' или 'access_token', сохраняем его:
      // localStorage.setItem('jwt_token', userData.token);

      // Для примера, предположим, что токен есть в ответе:
      if (userData.token) {
        localStorage.setItem('jwt_token', userData.token);
      }

      router.push('/dashboard');
    } else {
      alert('Неверный код. Попробуйте еще раз.');
    }
  } catch (e) {
    console.error(e);
    alert('Ошибка сети');
  } finally {
    loading.value = false;
  }
};
</script>
