import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/Laberit-intelligence/',
  server: {
    port: 3000
  }
})