import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * GitHub Pages (project site) needs the repo name as base:
 *   https://pistolpetefire.github.io/Fire_toolshed/
 * Local dev keeps base at "/".
 *
 * Set via: VITE_BASE_PATH=/Fire_toolshed/ npm run build
 */
const base = process.env.VITE_BASE_PATH || '/';

export default defineConfig({
  base,
  plugins: [react()],
});
