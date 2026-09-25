import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

// `npm run build`         → dist/: the site split into files; three.js and the
//                           Spline runtime load lazily, only when needed.
// `npm run build:single`  → dist-single/index.html: everything (code, images,
//                           fonts) in one file that opens with a double-click.
export default defineConfig(({ mode }) => ({
  // Relative paths so the build works from any folder (e.g. GitHub Pages).
  base: './',
  plugins: [react(), tailwindcss(), ...(mode === 'single' ? [viteSingleFile()] : [])],
  resolve: {
    alias: { '@': path.resolve(import.meta.dirname, 'src') },
  },
  build:
    mode === 'single'
      ? { outDir: 'dist-single', chunkSizeWarningLimit: 8000 }
      : // three.js and the Spline runtime ship in their own lazy chunks.
        { chunkSizeWarningLimit: 2500 },
}));
