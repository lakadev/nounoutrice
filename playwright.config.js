import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'https://lakadev.github.io/nounoutrice/'
  }
})
