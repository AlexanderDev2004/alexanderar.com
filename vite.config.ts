import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

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
    // gray-matter (frontmatter parsing in src/lib/content.ts) uses the Node
    // Buffer global; route loaders also run in the browser during SPA
    // navigation, so the client bundle needs a Buffer polyfill.
    nodePolyfills({ include: ['buffer', 'process'] }),
  ],
})
