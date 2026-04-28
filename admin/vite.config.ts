import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    vue(),
    {
      name: 'print-admin-url',
      configureServer(server) {
        server.httpServer?.once('listening', () => {
          const addr = server.httpServer?.address()
          const port = typeof addr === 'object' && addr ? addr.port : 5173
          setTimeout(() => {
            console.log(`  ➜  Admin:   http://admin-local.oakrate.com:${port}/`)
          }, 0)
        })
      },
    },
  ],
  server: {
    host: true,
    allowedHosts: ['admin-local.oakrate.com'],
    open: 'http://admin-local.oakrate.com:5173',
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@oakrate/db': fileURLToPath(new URL('../src/lib/database.types', import.meta.url)),
    },
  },
})
