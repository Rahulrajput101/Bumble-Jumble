import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Build timestamp: 2026-03-19
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://localhost:5000'
    }
  }
})
