import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';

const isProduction = process.env.NODE_ENV === 'production' || process.env.GITHUB_ACTIONS;

export default defineConfig({
  plugins: [react()],
  base: isProduction ? '/portfolio/' : '/',
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
});
