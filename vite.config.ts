import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { versionPlugin } from './vite-version-plugin'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    versionPlugin({ includeGitInfo: true })
  ],
  server: {
    host: true,
    port: 5173
  },
  build: {
    // Optimisations de build
    target: 'es2015',
    minify: 'esbuild', // Utiliser esbuild (plus rapide que terser)
    rollupOptions: {
      output: {
        // Code splitting pour réduire la taille des bundles
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['lucide-react'],
          'data-vendor': ['plotly.js', 'react-plotly.js'],
          'supabase': ['@supabase/supabase-js']
        },
        // Cache busting: ajouter des hashes basés sur le contenu
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]'
      }
    },
    // Augmenter la limite d'avertissement des chunks
    chunkSizeWarningLimit: 1000,
    // Optimiser les assets
    assetsInlineLimit: 4096
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'lucide-react']
  }
})
