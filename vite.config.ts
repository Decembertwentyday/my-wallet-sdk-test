import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),          // React 支持
    tailwindcss(),    // 开启 Tailwind CSS 处理
  ],
})
