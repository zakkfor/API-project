import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const isNetlify = process.env.NETLIFY === 'true'

export default defineConfig({
  plugins: [react()],
  base: isNetlify ? '/' : '/static/',
  build: {
    outDir: isNetlify ? 'dist' : '../static',
    emptyOutDir: true,
  },
})
