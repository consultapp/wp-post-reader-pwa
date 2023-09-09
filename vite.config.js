import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import { VitePWA } from 'vite-plugin-pwa'
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'customSW.js',
      // devOptions: {
      //   enabled: true,
      //   type: 'module',
      // },
      manifest: {
        name: 'PWA | Wordpress posts reader',
        short_name: 'PWA WP post reader',
        start_url: '/',
        display: 'standalone',
        background_color: '#000000',
        lang: 'ru',
        scope: '/',
        theme_color: '#ffffff',
        orientation: 'portrait',
        icons: [
          {
            src: '/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },

      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
      },
    }),
  ],
})
