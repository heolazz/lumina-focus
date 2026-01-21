import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // Aplikasi akan update otomatis jika ada versi baru
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'], // File tambahan yang mau di-cache
      
      // Manifest untuk tampilan Install & Icon
      manifest: {
        name: 'Lumina Focus',
        short_name: 'Lumina',
        description: 'Your personal focus timer with a friendly mascot.',
        theme_color: '#608f3f', // Warna status bar (Hijau Nature)
        background_color: '#ffffff',
        display: 'standalone', // Tampilan seperti aplikasi native (tanpa bar browser)
        orientation: 'portrait',
        start_url: '/',
        icons: [
          {
            src: 'images/logo.png', // Pastikan path ini sesuai file kamu
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'images/logo.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'images/logo.png', // Icon untuk maskable (Android adaptif)
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },

      // Konfigurasi Workbox (Mesin Offline)
      workbox: {
        // Pola file yang akan disimpan offline (HTML, JS, CSS, Gambar, Font)
        globPatterns: ['**/*.{js,css,html,ico,png,svg,mp3}'],
        
        // Batas ukuran file yang boleh di-cache (opsional, default 2MB)
        maximumFileSizeToCacheInBytes: 3000000, // 3MB (untuk cover file audio mp3)
        
        // Cache untuk Audio External (Mixkit) - Opsional tapi bagus
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/assets\.mixkit\.co\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'audio-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 30 // Simpan selama 30 hari
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ]
});