import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'https://lakadev.github.io/nounoutrice/',
    // Augmenter le timeout pour les actions sur la page de production
    actionTimeout: 60000, // 60 secondes
    navigationTimeout: 120000 // 120 secondes pour la navigation
  },
  // Augmenter le timeout global des tests
  globalTimeout: 300000, // 5 minutes
  workers: 1 // Exécuter les tests séquentiellement pour éviter les problèmes d'état partagé
})
