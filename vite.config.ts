import { defineConfig } from 'vite'

export default defineConfig({
  base: './', // важно для GitHub Pages
  build: {
    outDir: 'dist'
  }
})