import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        map: resolve(__dirname, 'map.html')
      }
    }
  },

  server: {
    fs: {
      allow: ['.', 'src']
    }
  }
})