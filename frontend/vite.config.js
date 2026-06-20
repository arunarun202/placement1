import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  // Backend URL: use VITE_API_URL env var if set, otherwise default to localhost:8000
  // Local Docker:   VITE_API_URL not set → http://localhost:8000
  // Local Supabase: VITE_API_URL=http://localhost:8000 (backend runs directly)
  // Production:     VITE_API_URL=https://your-service.onrender.com
  const backendTarget = env.VITE_API_URL || 'http://localhost:8000'

  return {
    base: '/placement1/',
    plugins: [
      react(),
      tailwindcss(),
    ],
    server: {
      proxy: {
        '/api': {
          target: backendTarget,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
        '/media': {
          target: backendTarget,
          changeOrigin: true,
        }
      }
    }
  }
});