import { defineConfig } from 'vite';

export default defineConfig({
  // Relative paths so the build works from any folder (e.g. GitHub Pages).
  base: './',
  // three.js ships in its own lazily loaded chunk for the hero.
  build: { chunkSizeWarningLimit: 700 },
});
