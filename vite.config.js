import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [react(),
  tailwindcss(),
  VitePWA({
    registerType: 'autoUpdate',
    manifest: {
      name: 'Subham\'s Music Player',
      short_name: 'Music Player',
      description: 'A beautiful music player app',
      start_url: '/',
      display: 'standalone',
      background_color: '#ffffff',
      theme_color: '#000000',
      icons: [
        {
          src: '/pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any maskable'
        },
        {
          src: '/pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable'
        }
      ],
      screenshots: [
        {
          src: '/screenshots/desktop-screenshot.png',
          sizes: '1366x768',
          type: 'image/png',
          form_factor: 'wide',
          label: 'Desktop view'
        },
        {
          src: '/screenshots/mobile-screenshot.jpg',
          sizes: '720x1640',
          type: 'image/jpeg',
          form_factor: 'narrow',
          label: 'Mobile view'
        }
      ]
    }
  })
  ]
})