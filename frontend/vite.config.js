import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  // Allow .js files to contain JSX without needing .jsx extension
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.[jt]sx?$/,
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: { '.js': 'jsx' },
    },
  },

  build: {
    outDir: 'dist',
    // Generate source maps for production debugging (remove if you prefer smaller bundles)
    sourcemap: false,
    // Raise the chunk size warning limit slightly — router + react is ~300kb before gzip
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        // Split vendor libs into a separate chunk for better caching
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },

  // Dev server — proxy /api to backend so VITE_API_URL=/api works in both envs
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
