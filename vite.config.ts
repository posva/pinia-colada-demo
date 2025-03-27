import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import VueRouter from 'unplugin-vue-router/vite'
import VueDevtools from 'vite-plugin-vue-devtools'
import TailwindCSS from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    //
    VueRouter(),
    Vue(),
    // bug in vite taliwindcss plugin
    // TailwindCSS(),
    VueDevtools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
