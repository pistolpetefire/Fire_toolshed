import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * GitHub Pages layout (both groups live on the same site):
 *   Fire tools portal → https://pistolpetefire.github.io/Fire_toolshed/
 *   Study Buddy SPA   → https://pistolpetefire.github.io/Fire_toolshed/study-buddy/
 *
 * Local dev keeps base at "/".
 * CI sets: VITE_BASE_PATH=/Fire_toolshed/study-buddy/
 */
const base = process.env.VITE_BASE_PATH || '/';

export default defineConfig({
  base,
  plugins: [react()],
});
