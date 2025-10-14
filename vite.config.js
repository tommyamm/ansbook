// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react( ),
    tailwindcss(),
    viteStaticCopy({
      targets: [
        {
          src: 'src/assets/types',
          dest: 'src/assets'
        }
      ]
    })
  ],
  base: '/', // ИЗМЕНИТЕ ЭТУ СТРОКУ НА '/'
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
