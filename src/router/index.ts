import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'guild',
      component: HomeView
    },
    {
      path: '/quests',
      name: 'quests',
      component: () => import('../views/QuestView.vue')
    },
    {
      path: '/adventurers',
      name: 'adventurers',
      component: () => import('../views/AdventurerView.vue')
    }
  ]
})

export default router
