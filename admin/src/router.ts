import { createRouter, createWebHistory } from 'vue-router'

import { useAuth } from '@/composables/useAuth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
    },
    {
      path: '/',
      component: () => import('@/components/AppLayout.vue'),
      children: [
        {
          path: '',
          name: 'dashboard',
          component: () => import('@/views/DashboardView.vue'),
        },
        {
          path: 'restaurants',
          name: 'restaurants',
          component: () => import('@/views/RestaurantsView.vue'),
        },
        {
          path: 'items',
          name: 'items',
          component: () => import('@/views/ItemsView.vue'),
        },
        {
          path: 'ratings',
          name: 'ratings',
          component: () => import('@/views/RatingsView.vue'),
        },
        {
          path: 'categories',
          name: 'categories',
          component: () => import('@/views/CategoriesView.vue'),
        },
      ],
    },
  ],
})

router.beforeEach(async (to) => {
  if (to.name === 'login') return true

  const { ready, user, isAdmin } = useAuth()
  await ready

  if (!user.value) {
    return { name: 'login' }
  }

  if (!isAdmin.value) {
    return { name: 'login', query: { error: 'not-authorized' } }
  }

  return true
})

export default router
