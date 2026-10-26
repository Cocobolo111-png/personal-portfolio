import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')
  const proxy = {
    '/api/ask-hy': {
      target: env.ASK_HY_API_TARGET || 'http://127.0.0.1:8790',
      changeOrigin: true,
    },
  }
  return {
    base: env.PORTFOLIO_BASE || '/',
    plugins: [react()],
    server: { proxy },
    preview: { proxy },
  }
})
