import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

// `npm run build`         → dist/: the site split into files, three.js and
//                           the Spline runtime loaded lazily.
// `npm run build:single`  → dist-single/index.html: everything (code, images,
//                           fonts) in one file that opens with a double-click.
export default defineConfig(({ mode }) => ({
  // Relative paths so the build works from any folder (e.g. GitHub Pages).
  base: './',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      // The single file leaves out the Spline runtime (several MB); the
      // scenes fall back to the figure video.
      ...(mode === 'single'
        ? { '@splinetool/react-spline': fileURLToPath(new URL('./src/react/spline-stub.tsx', import.meta.url)) }
        : {}),
    },
  },
  plugins: [react(), tailwindcss(), ...(mode === 'single' ? [viteSingleFile()] : [])],
  build:
    mode === 'single'
      ? { outDir: 'dist-single', chunkSizeWarningLimit: 6000 }
      : { chunkSizeWarningLimit: 2500 },
}));
