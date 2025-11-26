<template>
  <v-container fill-height fluid class="d-flex align-center justify-center">
    <v-card width="450" elevation="10" class="pa-6">
      <h2 class="text-h5 text-center mb-6">Вход в систему</h2>

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
            prepend-inner-icon="mdi-email"
            :rules="[v => !!v || 'Обязательное поле']"
            autofocus
          ></v-text-field>

          <v-btn
            type="submit"
            color="#542F99"
            block
            size="large"
            class="mt-2 text-white"
            :loading="loading"
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

          <v-text-field
            v-model="otpCode"
            label="Код из письма"
            variant="outlined"
            placeholder="123456"
            type="number"
            prepend-inner-icon="mdi-lock-check"
            class="text-center"
            autofocus
          ></v-text-field>

          <v-btn
            type="submit"
            color="#542F99"
            block
            size="large"
            class="mt-2 text-white"
            :loading="loading"
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
            ← Вернуться к вводу почты
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
    sendEmail();
  } else {
    verifyCode();
  }
};

// ШАГ 1: Отправка почты
const sendEmail = async () => {
  if (!email.value) return;
  loading.value = true;

  try {
    const response = await fetch('/api/v1/auth/login/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value })
    });

    if (response.ok) {
      step.value = 2;
    } else {
      alert('Ошибка! Проверьте email.');
    }
  } catch (e) {
    console.error(e);
    alert('Нет связи с сервером');
  } finally {
    loading.value = false;
  }
};

const verifyCode = async () => {
  if (!otpCode.value) return alert('Введите код!');
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
      console.log('Успешный вход, пользователь:', userData);

      // 1. СОХРАНЯЕМ ФЛАГ АВТОРИЗАЦИИ
      // В реальном проекте тут мы бы сохранили 'token', но пока ставим метку 'true'
      localStorage.setItem('is_authenticated', 'true');

      // 2. ПЕРЕНАПРАВЛЯЕМ НА ЗАЩИЩЕННУЮ СТРАНИЦУ (ДАШБОРД)
      // Раньше было router.push('/home'), теперь ведем внутрь системы
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
