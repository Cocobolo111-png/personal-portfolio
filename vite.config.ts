import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => ({
  base: loadEnv(mode, '.', 'PORTFOLIO_').PORTFOLIO_BASE || '/',
  plugins: [react()],
}))
