import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // En GitHub Pages la app se sirve bajo /elaguitas/. Local y APK usan '/'.
  base: process.env.GH_PAGES ? '/elaguitas/' : '/',
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
})
