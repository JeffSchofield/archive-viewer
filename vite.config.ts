import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { colorSuitePlugin } from 'tailwindcss-color-suite'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

export default defineConfig({
  plugins: [
    vue(),
    colorSuitePlugin(),
    createSvgIconsPlugin({
      iconDirs: [resolve(process.cwd(), 'src/assets/icons')],
      customDomId: 'svg-icons'
    })
  ],
  publicDir: 'swf',
  envPrefix: 'VIEWER_'
})
