import { createRouter, createWebHistory } from 'vue-router'
import IndexPage from './pages/IndexPage.vue'

const routes = [
  { path: '/', component: IndexPage }
]

const router = createRouter({
  history: createWebHistory('/nounoutrice/'), // Chemin de base pour GitHub Pages
  routes
})

export default router
