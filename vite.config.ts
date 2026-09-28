import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react()],
    // Not: Gemini anahtarı istemci paketine GÖMÜLMEZ (eski `define` kaldırıldı).
    // Anahtar yalnızca Supabase Edge Function secret'ı olarak sunucuda yaşar.
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            ui: ['framer-motion', 'lucide-react'],
            supabase: ['@supabase/supabase-js']
          }
        }
      },
      chunkSizeWarningLimit: 600
    }
  };
});
