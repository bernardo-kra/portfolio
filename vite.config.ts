import { defineConfig, loadEnv } from 'vite'
import { secureEntryHtml } from './build/securityPolicy'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'
import { copyFile, mkdir } from 'node:fs/promises'

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    {
      name: 'production-security-policy',
      apply: 'build',
      transformIndexHtml: {
        order: 'post',
        handler(html) {
          const env = loadEnv(mode, process.cwd(), 'VITE_')
          return secureEntryHtml(html, env.VITE_BACKEND_URL || 'https://portfolio-backed-ll6j.onrender.com')
        },
      },
    },
    {
      name: 'portfolio-route-entry',
      apply: 'build',
      async writeBundle(options) {
        const outputDirectory = resolve(options.dir || 'dist')
        const routeDirectory = resolve(outputDirectory, 'portfolio')
        await mkdir(routeDirectory, { recursive: true })
        await copyFile(
          resolve(outputDirectory, 'index.html'),
          resolve(routeDirectory, 'index.html')
        )
      },
    },
  ],
  base: '/',
  build: {
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },
  },
  resolve: {
    alias: {
      '@src': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@assets': resolve(__dirname, 'src/assets'),
      '@pages': resolve(__dirname, 'src/Pages'),
      '@theme': resolve(__dirname, 'src/components/theme'),
      '@hooks': resolve(__dirname, 'src/hooks'),
      '@context': resolve(__dirname, 'src/context'),
    },
  },
}))
