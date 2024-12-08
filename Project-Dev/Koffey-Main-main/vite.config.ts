import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0', // This allows external access, required for Docker
    port: 5173,      // The port the server will run on
    strictPort: true // Ensures the server fails if the port is already in use
  },
});
