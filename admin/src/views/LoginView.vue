<template>
  <div class="login-container">
    <div class="login-card">
      <h1>OakRank Admin</h1>

      <form @submit.prevent="handleLogin">
        <div class="field">
          <label for="email">Email</label>
          <InputText
            id="email"
            v-model="email"
            type="email"
            placeholder="admin@oakrank.com"
            :disabled="loading"
            fluid
          />
        </div>

        <div class="field">
          <label for="password">Password</label>
          <Password
            id="password"
            v-model="password"
            :feedback="false"
            :disabled="loading"
            toggle-mask
            fluid
          />
        </div>

        <Message v-if="errorMessage" severity="error" :closable="false">
          {{ errorMessage }}
        </Message>

        <Button
          type="submit"
          label="Log in"
          :loading="loading"
          fluid
        />
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Message from 'primevue/message'
import Password from 'primevue/password'

import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const route = useRoute()
const { login, user, isAdmin } = useAuth()

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')

onMounted(() => {
  if (route.query.error === 'not-authorized') {
    errorMessage.value = 'Not authorized. Admin access required.'
  }

  if (user.value && isAdmin.value) {
    router.replace({ name: 'dashboard' })
  }
})

async function handleLogin() {
  errorMessage.value = ''
  loading.value = true

  const { error } = await login(email.value, password.value)

  loading.value = false

  if (error) {
    errorMessage.value = error
    return
  }

  router.replace({ name: 'dashboard' })
}
</script>

<style scoped>
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: var(--p-surface-100);
}

.login-card {
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  background: var(--p-surface-0);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.login-card h1 {
  margin: 0 0 1.5rem;
  font-size: 1.5rem;
  text-align: center;
  color: var(--p-text-color);
}

.field {
  margin-bottom: 1rem;
}

.field label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--p-text-color);
}

form :deep(.p-message) {
  margin-bottom: 1rem;
}
</style>
