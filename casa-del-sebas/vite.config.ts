import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

// `npm run build`          → dist/: the site split into files; Spline loads lazily.
// `npm run build:single`   → dist-single/index.html: everything in one file.
// `npm run build:artifact` → dist-artifact/: like dist/ but without the Spline
//                            runtime, for hosts that block external requests.
export default defineConfig(({ mode }) => {
  const single = mode === 'single';
  return {
    // Relative paths so the build works from any folder (e.g. GitHub Pages).
    base: './',
    plugins: [react(), tailwindcss(), ...(single ? [viteSingleFile()] : [])],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, 'src'),
        ...(mode === 'artifact' ? { '@splinetool/react-spline': path.resolve(import.meta.dirname, 'src/lib/spline-unavailable.tsx') } : {}),
      },
    },
    build: single
      ? { outDir: 'dist-single', chunkSizeWarningLimit: 6000 }
      : // The Spline runtime is big and ships in its own lazily loaded chunk.
        { outDir: mode === 'artifact' ? 'dist-artifact' : 'dist', chunkSizeWarningLimit: 2500, assetsInlineLimit: 0 },
  };
});
