import { fileURLToPath } from 'node:url';

import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/postcss';
import { defineConfig } from 'vite';

const projectRoot = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  base: '/curtis_orchard/',
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': projectRoot,
    },
  },
  build: {
    outDir: 'dist-pages',
    emptyOutDir: true,
  },
});
