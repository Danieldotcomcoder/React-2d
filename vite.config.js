import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import vitePluginRestart from 'vite-plugin-restart';


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),
    vitePluginRestart({
      restart: ['src/main.js'], // Specify files or globs that trigger restarts
    }),
  ],
  
})
