import { copyFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, type Plugin } from 'vite'

/**
 * GitHub Pages serves no history fallback, so a deep link like /map would hit
 * the Pages 404 page. Shipping the same document as 404.html lets the SPA boot
 * and hand the URL to React Router.
 */
function githubPagesSpaFallback(): Plugin {
  let outDir = 'dist'
  return {
    name: 'gh-pages-spa-fallback',
    apply: 'build',
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir)
    },
    closeBundle() {
      copyFileSync(resolve(outDir, 'index.html'), resolve(outDir, '404.html'))
      writeFileSync(resolve(outDir, '.nojekyll'), '')
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  // A GitHub Pages project site lives under /<repo>/. CI injects VITE_BASE;
  // the real production domain will just use the default "/".
  base: process.env.VITE_BASE || '/',
  plugins: [react(), tailwindcss(), githubPagesSpaFallback()],
})
