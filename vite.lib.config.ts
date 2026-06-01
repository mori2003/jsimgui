import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'TXMLTSSRenderer',
      fileName: 'index',
      formats: ['es', 'cjs']
    },
    rollupOptions: {
      external: ['https://esm.sh/@mori2003/jsimgui'],
      output: {
        globals: {
          'https://esm.sh/@mori2003/jsimgui': 'jsimgui'
        }
      }
    }
  }
});
