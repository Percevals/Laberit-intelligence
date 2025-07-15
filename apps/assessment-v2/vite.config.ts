import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Laberit-intelligence/apps/assessment-v2/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@core': path.resolve(__dirname, './src/core'),
      '@features': path.resolve(__dirname, './src/features'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@ui': path.resolve(__dirname, './src/ui'),
      '@services': path.resolve(__dirname, './src/services'),
      '@data': path.resolve(__dirname, '../../data'),
      // Prevent @dii/core from being bundled
      '@dii/core': path.resolve(__dirname, './src/database/dummy-core.ts')
    }
  },
  build: {
    rollupOptions: {
      external: [
        // Externalize Node.js modules that shouldn't be in browser
        'pg',
        'pg-pool',
        'fs',
        'path',
        'net',
        'tls',
        'crypto',
        'stream',
        'util',
        'events',
        'dns'
      ]
    }
  },
  optimizeDeps: {
    exclude: ['@dii/core']
  }
})