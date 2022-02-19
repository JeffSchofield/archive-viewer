import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { colorSuitePlugin } from 'tailwindcss-color-suite'

export default defineConfig({
  plugins: [
    vue(),
    colorSuitePlugin(),
  ],
  publicDir: 'swf',
  envPrefix: 'VIEWER_'
})
