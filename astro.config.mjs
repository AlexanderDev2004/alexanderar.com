// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import svelte from '@astrojs/svelte';
import icon from 'astro-icon';
import remarkTermPopover from './src/lib/remark-term-popover.ts';
// https://astro.build/config
export default defineConfig({
  integrations: [svelte(), icon()],

  devToolbar: {
    enabled: false,
  },

  vite: {
    plugins: [tailwindcss()]
  },

  markdown: {
    syntaxHighlight: 'prism',
    remarkPlugins: [remarkTermPopover],
  },

  output: 'static',
});