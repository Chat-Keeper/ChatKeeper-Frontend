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
          children: [
            {
              path: '/home/groups/:group_id',
              name: 'group-detail',
              component: () => import('@/views/GroupDetailView.vue'),
            }
          ]
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
        },
        {
          path: '/:pathMatch(.*)*',
          name: 'not-found',
          component: () => import('@/views/NotFoundView.vue'),
        }
      ],
    },
  ],
})

export default router
