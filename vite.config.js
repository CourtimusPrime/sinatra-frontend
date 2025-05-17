// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: './',
  server: {
    proxy: {
      '/me': 'http://localhost:8000',
      '/playlists': 'http://localhost:8000',
      '/complete-onboarding': 'http://localhost:8000',
      '/playback': 'http://localhost:8000',
      '/user-playlists': 'http://localhost:8000',
      '/delete-user': 'http://localhost:8000',
      '/refresh-session': 'http://localhost:8000',
      '/login': 'http://localhost:8000',
      '/callback': 'http://localhost:8000',
      '/recently-played': 'http://localhost:8000',
      '/genres': 'http://localhost:8000',
      '/public-playlist': 'http://localhost:8000',
      '/playlist-info': 'http://localhost:8000',
      '/dashboard': 'http://localhost:8000',
      '/save-theme': 'http://localhost:8000',
      '/pause': 'http://localhost:8000',
      '/play': 'http://localhost:8000',
      '/analyze-genres': 'http://localhost:8000',
      '/get-theme': 'http://localhost:8000',
      '/genre-map': 'http://localhost:8000',
    },
  },
  plugins: [react({ jsxImportSource: 'react' })],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
})