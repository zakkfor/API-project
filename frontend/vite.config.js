import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// When building for Netlify (NETLIFY=true is injected automatically),
// serve assets from the root and output to 'dist' inside the frontend dir.
// When building for the FastAPI server, keep the '/static/' base so
// FastAPI's StaticFiles mount at /static serves them correctly.
const isNetlify = process.env.NETLIFY === 'true'

export default defineConfig({
  plugins: [react()],
  base: isNetlify ? '/' : '/static/',
  build: {
    outDir: isNetlify ? 'dist' : '../static',
    emptyOutDir: true,
  },
})
