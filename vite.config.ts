import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    tanstackStart({
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
