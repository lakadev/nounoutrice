import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'

export default defineConfig({
  base: '/nounoutrice/', // Nécessaire pour GitHub Pages
  server: {
    allowedHosts: ['clark-plasma-manufacture-dirt.trycloudflare.com', 'train-despite-tulsa-thoughts.trycloudflare.com', 'trycloudflare.com']
  },
  plugins: [
    vue({
      template: { transformAssetUrls }
    }),
    quasar({
      sassVariables: false
    })
  ],
  resolve: {
    alias: {
      '@': '/data/.openclaw/workspace/dev/nounoutrice/source/src'
    }
  }
})
