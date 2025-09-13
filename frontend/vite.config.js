import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    port:3001,
    proxy:{
      '/api': { // 👈 all requests starting with /user go to backend
        target: 'http://localhost:3000',
        changeOrigin: true,
        //secure: false,
      },
    },
  },
})
