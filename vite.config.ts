import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    target: 'esnext',
    outDir: 'dist',
    lib: {
      entry: 'src/index.ts',
      formats: ['cjs'],
      fileName: 'index'
    },
    rollupOptions: {
      external: ['@hono/node-server', 'hono', '@google-cloud/functions-framework', 'twitter-api-v2', 'dotenv']
    },
    sourcemap: true
  }
}) 