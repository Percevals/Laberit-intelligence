import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Laberit-intelligence/',
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: false,
    open: false
  },
  optimizeDeps: {
    exclude: ['@dii/visualizations']
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false
  }
})