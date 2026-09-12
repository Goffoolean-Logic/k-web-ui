import dts from 'vite-plugin-dts';
import { defineConfig } from 'vitest/config';

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
  plugins: [dts({ include: ['src/components/js'], exclude: ['**/*.test.ts'] })],
  test: {
    environment: 'happy-dom',
    include: ['src/components/js/**/*.test.ts'],
  },
});
