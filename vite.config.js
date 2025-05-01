import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Care4Crisis/',
  build: {
    outDir: 'dist',
  },
}) 