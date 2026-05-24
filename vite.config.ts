import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // Demo 站点产物，避免覆盖 npm 包的 dist/
  build: {
    outDir: 'dist-demo',
  },
  plugins: [
    react(),          // React 支持
    tailwindcss(),    // 开启 Tailwind CSS 处理
  ],
})
