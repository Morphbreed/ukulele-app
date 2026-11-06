import { defineConfig } from 'vite';

// Relative Pfade, damit die App unter https://<user>.github.io/<repo>/ läuft.
export default defineConfig({
  base: './',
  build: { chunkSizeWarningLimit: 1000 }, // VexFlow ist groß
  server: { port: 5173 },
});
