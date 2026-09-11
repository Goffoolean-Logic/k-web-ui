import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    target: 'es2022',
    sourcemap: true,
    emptyOutDir: false,
    lib: {
      entry: 'src/components/js/index.ts',
      formats: ['es'],
      fileName: 'index',
    },
    outDir: 'dist/js',
  },
  plugins: [dts({ include: ['src/components/js'] })],
});
