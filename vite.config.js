import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    assetsInlineLimit: 4096,
    cssCodeSplit: true,
  },
  test: {
    environment: 'jsdom',
    globals: true,
  },
});
