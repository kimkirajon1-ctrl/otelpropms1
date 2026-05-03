import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // API isteklerini otomatik olarak backend'e yönlendirir
      '/api': {
        target: 'http://localhost:10000',
        changeOrigin: true,
      },
      // Socket.io istekleri için proxy
      '/socket.io': {
        target: 'http://localhost:10000',
        ws: true,
      },
    },
  },
  build: {
    outDir: 'dist',
  }
})
