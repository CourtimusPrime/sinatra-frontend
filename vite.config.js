import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
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
      '/meta-genre-schema': 'http://localhost:8000',
    },
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: 'index.html',
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});