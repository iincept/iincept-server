import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    proxy: {
      '/api': {
        target: 'https://iincept-1.onrender.com',
        changeOrigin: true
      },
      '/uploads': {
        target: 'https://iincept-1.onrender.com',
        changeOrigin: true
      }
    }
  }
})
