import { createRouter, createWebHistory } from 'vue-router'
import MultiStepForm from '@/views/MultiStepForm.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'multiStepForm',
      component: MultiStepForm,
    },
  ],
})

export default router
