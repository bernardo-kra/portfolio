import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/portfolio/',
  resolve: {
    alias: {
      '@src': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@assets': resolve(__dirname, 'src/assets'),
      '@pages': resolve(__dirname, 'src/Pages'),
      '@theme': resolve(__dirname, 'src/components/theme'),
    },
  },
})
