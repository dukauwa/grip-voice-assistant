import { defineConfig } from 'vite'

export default defineConfig({
  root: 'src',
  build: {
    // Puts the built files into a `dist` folder in the project root
    outDir: '../dist',
    emptyOutDir: true
  }
}) 