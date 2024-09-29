import { createRouter, createWebHistory } from 'vue-router'
import SearchView from '../views/SearchView.vue'
import BookingView from '@/views/BookingView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'search',
      component: SearchView
    },
    {
      path: '/booking',
      name: 'booking',
      component: BookingView
    }
  ]
})

export default router
