import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    target: 'esnext',
    minify: 'terser',
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
          'animation-vendor': ['gsap', '@gsap/react'],
        },
      },
    },
  },
  optimizeDeps: {
    include: ['three', 'gsap', '@react-three/fiber', '@react-three/drei', 'lenis'],
  },
  server: {
    port: 5173,
    open: true,
    cors: true,
  },
  preview: {
    port: 4173,
    cors: true,
  },
})
