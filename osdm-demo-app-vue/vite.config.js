import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // 1. Tell Vite that all components starting with "sbb-" are webcomponents
          isCustomElement: (tag) => tag.startsWith('sbb-')
        }
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@sbb-esta': fileURLToPath(new URL('./node_modules/@sbb-esta', import.meta.url))
    }
  }
})
