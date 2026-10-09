# alexanderar.com

Portfolio of Alexander Agung Raya — Software Developer.

![screenshot](image.png)

## Stack

- [TanStack Start](https://tanstack.com/start) (React 19 + TanStack Router, fully prerendered to static HTML)
- Tailwind CSS 4
- TanStack Query — silent client-side refresh for the GitHub sections
- Markdown content (`src/content/**`) rendered at build time with the unified toolchain
- Cloudflare Workers static assets deployment

## Content

- **Blogs** — `src/content/blogs/*.md` (frontmatter: `title`, `date`, `description`, `tags`).
  Posts can also be created from GitHub issues via the *Issue to Blog Post* workflow.
- **Projects** — `src/content/projects/*.md` (frontmatter: `title`, `year`, `description`,
  `fullDescription`, `image`, `projectLink`, `repoLink`, `technologies[{name, icon, docLink}]`).
- **Security reports** — `src/content/reports/*.md`.
- **GitHub data** — `scripts/fetch-github.mjs` snapshots merged PRs + the contribution
  calendar into `src/data/github.json` at build time and nightly
  (see *Refresh GitHub Data* workflow); the site then refreshes client-side with a 24h cache.

## Develop

```bash
bun install
bun run dev        # http://localhost:3000
```

## Build & deploy

```bash
bun run build      # fetch GitHub snapshot + generate OG images + typecheck + prerender
bun run deploy     # build + wrangler deploy (serves ./dist/client via Workers assets)
```

Prerendered output lives in `dist/client/`; `wrangler.jsonc` points the Worker's
assets at that folder and serves `404.html` for unknown paths.

Deploys are manual (`bun run deploy`) — the live Worker is `alexanderar-site`,
holding the custom domains `alexanderar.com` / `www.alexanderar.com`. There is no
Git build integration: the old Workers Builds project `alexanderar-com` was deleted
because every push made it redeploy an empty bundle and reclaim the custom domains.
