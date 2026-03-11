import { defineConfig ,loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({mode}) => {
  // Load environment variables based on the current mode (development, production, etc.)
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    server: {
     
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:6000', // Use the environment variable or fallback to localhost
          changeOrigin: true,
        },
      },
    },
  }
})






 