---
title: "Portofolio Alex"
year: "2026"
description: "My personal portfolio website — rebuilt from scratch with TanStack Start"
fullDescription: "Full rewrite of my portfolio using TanStack Start, React 19, Tailwind CSS 4, and Bun — deployed to Cloudflare Workers via CI/CD"
image: "/images/PortoAlx-v2-tanstack.webp"
projectLink: "https://alexanderar.com"
repoLink: "https://github.com/AlexanderDev2004/alexanderar.com"
technologies:
  - name: "TanStack Start"
    icon: "simple-icons:tanstack"
    docLink: "https://tanstack.com/start"
  - name: "React"
    icon: "simple-icons:react"
    docLink: "https://react.dev/"
  - name: "Tailwind CSS"
    icon: "simple-icons:tailwindcss"
    docLink: "https://tailwindcss.com/"
  - name: "Bun"
    icon: "simple-icons:bun"
    docLink: "https://bun.com/"
  - name: "TypeScript"
    icon: "simple-icons:typescript"
    docLink: "https://www.typescriptlang.org/"
  - name: "Cloudflare Workers"
    icon: "simple-icons:cloudflare"
    docLink: "https://workers.cloudflare.com/"
---

## Project Summary

This is my personal portfolio, fully rewritten from the ground up. The previous version was built with Astro, Svelte, and Tailwind; this one moves the whole site to **TanStack Start with React 19 and TypeScript**, keeps a markdown-driven content flow, and deploys automatically to **Cloudflare Workers** on every push. The visual language stayed in the same family — a warm beige background with a matte sage palette — but everything under the hood is new.

## The Problem

The old portfolio (Astro + Svelte) worked fine as a static site, but I kept running into its ceiling: I wanted live GitHub data on the home page, per-route typed metadata, and a deployment pipeline I didn't have to babysit. Mixing interactive islands into Astro also made every new feature feel bolted on. So instead of patching it, I treated it as a rewrite.

## The Solution

I rebuilt the entire site on TanStack Start with a file-based, type-safe router and React 19. Content stayed in Markdown (projects, blogs, security reports) but now flows through a small typed content pipeline instead of framework-specific collections. GitHub activity and merged pull requests are fetched at build time into a snapshot and silently refreshed on the client with TanStack Query — instant first paint, fresh data after hydration. Every push to `master` builds and deploys to Cloudflare Workers through GitHub Actions.

## Key Features

### Framework & Rendering
- TanStack Start with file-based routing and a generated, fully type-safe route tree.
- Static prerendering for every content page, so first paint is instant.
- Per-route SEO metadata through typed `head()` definitions (canonical, Open Graph, Twitter cards).

### Content Pipeline
- Markdown sources for projects, blogs, and security reports with consistent frontmatter.
- A small typed loader that parses frontmatter into `Project` / `BlogPost` objects at build time.
- Slug normalization kept consistent between URLs, content lookups, and OG image filenames.

### Live GitHub Integration
- Contributions heatmap (365 days) rendered as a lightweight CSS grid.
- Merged pull requests grouped per repository, with additions/deletions and merge dates.
- Build-time snapshot + TanStack Query client refresh: fast by default, fresh when data changes.

### OG Image Generation
- Build-time Python (Pillow) script that renders a 1200×630 card for the home page and every blog, project, and report.
- Cards use the site's own palette and fonts, so link previews match the site.
- Versioned image URLs (`?v=YYMMDD`) so crawlers re-fetch after redesigns.

### Design & UX
- Matte sage/beige design system with flat hairline lists instead of heavy card boxes.
- Collapsible sections (work experience, open source contributions) with keyboard support.
- A looping "Hideout" pattern background revealed inside blurred circle masks, with a subtle mouse parallax — fully disabled under `prefers-reduced-motion`.
- Responsive down to small phones, including responsive embeds for YouTube/video/audio inside articles.

### Deployment & Ops
- GitHub Actions CI/CD: install → fetch GitHub data → generate OG images → typecheck → build → `wrangler deploy`.
- Hosted on Cloudflare Workers with a custom domain (alexanderar.com).

## Challenges & Learnings
- Migrating from Astro + Svelte to TanStack Start taught me how far you can push a type-safe router — routes, params, and loaders are all checked at compile time.
- Learned to keep hydration deterministic: randomized UI (like the background mask) is generated from a seeded PRNG so server and client agree.
- Got practical experience with edge deployment: static prerender + Workers assets, with CI doing the heavy lifting on every push.
