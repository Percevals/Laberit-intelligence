import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: '/Laberit-intelligence/quick-assessment/',
  resolve: {
    alias: {
      '@dii/core': path.resolve(__dirname, '../../packages/core/src'),
      '@dii/types': path.resolve(__dirname, '../../packages/types/src'),
      '@dii/ui-kit': path.resolve(__dirname, '../../packages/ui-kit/src')
    }
  },
  optimizeDeps: {
    include: ['@dii/core', '@dii/types', '@dii/ui-kit']
  }
})