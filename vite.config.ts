import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  build: {
    // Inline the woff2 as a data URI: the stylesheet is inlined into the
    // prerendered HTML, so the first layout already has the real font. A
    // separate font request made the text (the largest paint) wait for that
    // request, which cost more than the extra few KB in the document.
    assetsInlineLimit: (filePath) => (filePath.endsWith('.woff2') ? true : undefined),
  },
  server: {
    port: 3000,
    // Local dev: the /api/lastfm live proxy only exists on the deployed
    // Cloudflare Worker. Forward it to `bun run dev:worker` (wrangler dev
    // on :8789) so localhost:3000/music/ polls live data too. If the
    // worker is not running, requests fail and the page quietly keeps
    // the build snapshot — same behaviour as before.
    proxy: {
      '/api/lastfm': 'http://localhost:8789',
    },
  },
  plugins: [
    tanstackStart({
      // Inline the single global stylesheet into the server-rendered HTML —
      // removes the last render-blocking request (FCP/LCP win).
      server: { build: { inlineCss: true } },
      prerender: {
        enabled: true,
        crawlLinks: true,
        autoStaticPathsDiscovery: true,
        failOnError: false,
        // Static binaries linked from pages (the CV/portfolio PDFs on the
        // files page) must not be prerendered: the renderer "prints" them
        // through the browser, which replaces the real PDF with a screenshot
        // of the PDF viewer — no text layer, bloated size. Vite already
        // copies public/ verbatim, so just exclude them here.
        filter: (page) => !page.path.endsWith('.pdf'),
      },
      pages: [
        {
          path: '/404',
          prerender: { enabled: true, outputPath: '/404.html' },
        },
      ],
    }),
    // react's vite plugin must come after start's vite plugin
    tailwindcss(),
    viteReact(),
  ],
})
