import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    dedupe: ['react', 'react-dom', 'react-router-dom', 'react-redux', 'lucide-react'],
    alias: {
      '@': path.resolve(__dirname, './src'),
      'react': path.resolve(__dirname, './node_modules/react'),
      'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
      'react-router-dom': path.resolve(__dirname, './node_modules/react-router-dom'),
      'react-redux': path.resolve(__dirname, './node_modules/react-redux'),
      'lucide-react': path.resolve(__dirname, './node_modules/lucide-react'),
      // Point to client admin pages to avoid duplicating large files
      '@admin-pages': path.resolve(__dirname, '../client/src/pages/admin'),
      // Services and redux from THIS admin project (correct standalone imports)
      '@admin-services': path.resolve(__dirname, './src/services'),
      '@admin-redux': path.resolve(__dirname, './src/redux'),
    }
  },
  server: {
    port: 5174,
    host: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5088',
        changeOrigin: true,
        secure: false
      },
      '/uploads': {
        target: 'http://127.0.0.1:5088',
        changeOrigin: true,
        secure: false
      },
      '/ipad_nav': {
        target: 'http://127.0.0.1:5088',
        changeOrigin: true,
        secure: false
      },
      '/mac_nav': {
        target: 'http://127.0.0.1:5088',
        changeOrigin: true,
        secure: false
      },
      '/iphone_nav': {
        target: 'http://127.0.0.1:5088',
        changeOrigin: true,
        secure: false
      },
      '/watch_nav': {
        target: 'http://127.0.0.1:5088',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
