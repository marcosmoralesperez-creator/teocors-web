import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

// `npm run build`         → dist/: the site split into files, three.js loaded lazily.
// `npm run build:single`  → dist-single/index.html: everything (code, images,
//                           fonts) in one file that opens with a double-click.
export default defineConfig(({ mode }) => ({
  // Relative paths so the build works from any folder (e.g. GitHub Pages).
  base: './',
  plugins: mode === 'single' ? [viteSingleFile()] : [],
  build:
    mode === 'single'
      ? { outDir: 'dist-single', chunkSizeWarningLimit: 4000 }
      : // three.js ships in its own lazily loaded chunk for the hero.
        { chunkSizeWarningLimit: 700 },
}));
