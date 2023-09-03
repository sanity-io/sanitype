import path from 'node:path'
import {defineConfig} from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3600,
  },
  resolve: {
    alias: {
      sanitype: path.resolve(__dirname, '../../src'),
    },
  },
})
