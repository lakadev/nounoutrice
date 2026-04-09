import { createRouter, createWebHistory } from 'vue-router'
import IndexPage from './pages/IndexPage.vue'

const routes = [
  { path: '/', component: IndexPage }
]

const router = createRouter({
  history: createWebHistory('/nounoutrice/'), // Ajout du chemin de base
  routes
})

export default router
