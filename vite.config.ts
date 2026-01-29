import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './guidelines/src'),
    },
  },
  server: {
    proxy: {
      // 开发环境代理 /api/dify 到本地 serverless function 模拟
      '/api/dify': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        // 如果有本地开发服务器，可以配置
        // 否则会直接尝试调用，需要单独启动 API 服务器
      },
    },
  },
})
