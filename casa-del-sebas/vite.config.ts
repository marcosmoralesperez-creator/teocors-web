import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

// `npm run build`         → dist/: the site split into files; Spline loads lazily.
// `npm run build:single`  → dist-single/index.html: everything in one file.
export default defineConfig(({ mode }) => ({
  // Relative paths so the build works from any folder (e.g. GitHub Pages).
  base: './',
  plugins: [react(), tailwindcss(), ...(mode === 'single' ? [viteSingleFile()] : [])],
  resolve: { alias: { '@': path.resolve(import.meta.dirname, 'src') } },
  build:
    mode === 'single'
      ? { outDir: 'dist-single', chunkSizeWarningLimit: 6000 }
      : // The Spline runtime is big and ships in its own lazily loaded chunk.
        { chunkSizeWarningLimit: 2500 },
}));
