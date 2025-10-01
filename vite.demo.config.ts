import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: 'demo',
  esbuild: {
    jsx: 'transform',
    jsxFactory: 'jsxs',
    jsxFragment: 'Fragment'
  },
  build: {
    outDir: '../dist-demo',
    rollupOptions: {
      input: {
        'working-imgui': resolve(__dirname, 'demo/working-imgui-demo.html'),
        'jsx-working': resolve(__dirname, 'demo/jsx-working-demo.html'),
        'build-time-jsx': resolve(__dirname, 'demo/build-time-jsx-demo.html'),
        'index': resolve(__dirname, 'demo/index.html')
      }
    }
  },
  server: {
    port: 3001,
    open: '/index.html'
  }
});
