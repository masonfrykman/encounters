import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        map: resolve(__dirname, 'public/map.html'),
        search: resolve(__dirname, 'public/search.html')
      }
    }
  },
})