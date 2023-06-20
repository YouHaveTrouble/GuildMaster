import {createRouter, createWebHashHistory} from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'guild',
      component: () => import('@/views/HomeView.vue')
    },
    {
      path: '/quests',
      name: 'quests',
      component: () => import('@/views/QuestView.vue')
    },
    {
      path: '/adventurers',
      name: 'adventurers',
      component: () => import('@/views/AdventurerView.vue')
    },
    {
      path: '/technical',
      name: 'technical',
      component: () => import('@/views/TechnicalView.vue')
    }
  ]
})

export default router
