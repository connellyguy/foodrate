<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="sidebar-brand">OakRank</div>

      <nav class="sidebar-nav">
        <RouterLink to="/" class="nav-link">
          <i class="pi pi-home" />
          <span>Dashboard</span>
        </RouterLink>
        <RouterLink to="/restaurants" class="nav-link">
          <i class="pi pi-building" />
          <span>Restaurants</span>
        </RouterLink>
        <RouterLink to="/items" class="nav-link">
          <i class="pi pi-list" />
          <span>Items</span>
        </RouterLink>
        <RouterLink to="/ratings" class="nav-link">
          <i class="pi pi-star" />
          <span>Ratings</span>
        </RouterLink>
      </nav>
    </aside>

    <div class="main">
      <header class="topbar">
        <h1 class="topbar-title">OakRank Admin</h1>
        <Button
          label="Log out"
          icon="pi pi-sign-out"
          severity="secondary"
          text
          @click="handleLogout"
        />
      </header>

      <main class="content">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView, useRouter } from 'vue-router'

import Button from 'primevue/button'

import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { logout } = useAuth()

async function handleLogout() {
  await logout()
  router.replace({ name: 'login' })
}
</script>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 220px;
  background: var(--p-surface-800);
  color: var(--p-surface-0);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.sidebar-brand {
  padding: 1.25rem 1rem;
  font-size: 1.25rem;
  font-weight: 700;
  border-bottom: 1px solid var(--p-surface-700);
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  padding: 0.5rem 0;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: var(--p-surface-300);
  text-decoration: none;
  font-size: 0.9rem;
  transition: background 0.15s, color 0.15s;
}

.nav-link:hover {
  background: var(--p-surface-700);
  color: var(--p-surface-0);
}

.nav-link.router-link-exact-active {
  background: var(--p-surface-700);
  color: var(--p-surface-0);
  font-weight: 600;
}

.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: var(--p-surface-100);
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.5rem;
  background: var(--p-surface-0);
  border-bottom: 1px solid var(--p-surface-200);
}

.topbar-title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--p-text-color);
}

.content {
  padding: 1.5rem;
  flex: 1;
}
</style>
