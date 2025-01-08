// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  root: path.resolve(__dirname, 'src'), // Set the root to 'src'
  base: './', // Relative base for assets
  build: {
    outDir: path.resolve(__dirname, 'dist'), // Output directory outside 'src'
    emptyOutDir: true,
    sourcemap: false,
  },
  server: {
    port: 3000, // You can change this if needed
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
