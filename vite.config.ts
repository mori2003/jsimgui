import { defineConfig } from 'vite';

export default defineConfig({
  root: 'demo',
  server: {
    port: 3000,
    open: '/demo.html',
    fs: {
      allow: ['..']
    },
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    }
  },
  optimizeDeps: {
    exclude: ['https://esm.sh/@mori2003/jsimgui']
  },
  resolve: {
    alias: {
      '@': new URL('../src', import.meta.url).pathname
    }
  },
  build: {
    rollupOptions: {
      external: ['https://esm.sh/@mori2003/jsimgui']
    }
  }
});
