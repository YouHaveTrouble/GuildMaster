import {createRouter, createWebHashHistory} from 'vue-router'

import HomeView from '@/views/HomeView.vue';
import QuestView from "@/views/QuestView.vue";
import AdventurerView from "@/views/AdventurerView.vue";
import TechnicalView from "@/views/TechnicalView.vue";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'guild',
      component: HomeView,
    },
    {
      path: '/quests',
      name: 'quests',
      component: QuestView,
    },
    {
      path: '/adventurers',
      name: 'adventurers',
      component: AdventurerView,
    },
    {
      path: '/technical',
      name: 'technical',
      component: TechnicalView,
    },
  ]
})

export default router
