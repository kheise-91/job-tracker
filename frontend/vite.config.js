import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  server: {
    allowedHosts: ['.heise.home'],
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,

    proxy: {
      '/api': {
        target: 'http://192.168.0.91:5000',
        changeOrigin: true,
        secure: false
      }
    }
  }
})