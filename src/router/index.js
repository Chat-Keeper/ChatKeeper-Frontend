import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '@/layout/AppLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: AppLayout,
      children: [
        {
          path: '/',
          name: 'welcome',
          component: () => import('@/views/WelcomeView.vue'),
        },
        {
          path: '/home',
          name: 'home',
          component: () => import('@/views/HomeView.vue'),
        },
        {
          path: '/home/groups',
          name: 'groups',
          component: () => import('@/views/GroupsView.vue'),
        },
        {
          path: '/home/speakers',
          name: 'speakers',
          component: () => import('@/views/SpeakersView.vue'),
        },
        {
          path: '/login',
          name: 'login',
          component: () => import('@/views/LoginView.vue'),
        }
      ],
    },
  ],
})

export default router
