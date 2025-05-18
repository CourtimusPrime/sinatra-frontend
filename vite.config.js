import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import compression from 'vite-plugin-compression';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    compression({
      algorithm: 'brotliCompress', // or 'gzip'
      ext: '.br',
      deleteOriginFile: false
    })
  ],
  publicDir: 'public',
  base: '/',
  server: {
    proxy: {
      '/callback': 'http://localhost:8000',
      '/login': 'http://localhost:8000',
      '/me': 'http://localhost:8000',
      '/genres': 'http://localhost:8000',
      '/playlists': 'http://localhost:8000',
      '/recently-played': 'http://localhost:8000',
      '/dashboard': 'http://localhost:8000',
      '/user-playlists': 'http://localhost:8000',
      '/complete-onboarding': 'http://localhost:8000',
      '/playback': 'http://localhost:8000',
      '/delete-user': 'http://localhost:8000',
      '/refresh-session': 'http://localhost:8000',
      '/public-playlist': 'http://localhost:8000',
      '/playlist-info': 'http://localhost:8000',
    },
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: 'index.html',
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          d3: ['d3'],
          lucide: ['lucide-react'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});