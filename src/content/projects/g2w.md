---
title: "G2W — Game to Website"
year: "2026"
description: "Open-source, TypeScript-first game framework for the browser — zero-dependency core, renderer-agnostic (WebGL/Canvas/WebGPU), 8 npm packages, CLI scaffold, and a live docs site."
fullDescription: "g2w (Game to Website) is an open-source, TypeScript-first framework for building and shipping browser games. Its core has zero runtime dependencies, the renderer is a tested contract (WebGL, Canvas, and WebGPU backends run the same conformance suite), and the ecosystem ships as 8 npm packages in a pnpm monorepo — including a CLI scaffold, devtools, gamepad input, and web audio — with 453 tests, npm trusted publishing, and a live documentation site."
image: "/images/g2w.webp"
projectLink: "https://g2w.alexanderar.com"
repoLink: "https://github.com/AlexanderDev2004/g2w"
technologies:
  - name: "TypeScript"
    icon: "simple-icons:typescript"
    docLink: "https://www.typescriptlang.org/"
  - name: "pnpm"
    icon: "simple-icons:pnpm"
    docLink: "https://pnpm.io/"
  - name: "PixiJS"
    icon: "simple-icons:pixijs"
    docLink: "https://pixijs.com/"
  - name: "Effect"
    icon: "simple-icons:effect"
    docLink: "https://effect.website/"
  - name: "Vitest"
    icon: "simple-icons:vitest"
    docLink: "https://vitest.dev/"
  - name: "Astro"
    icon: "simple-icons:astro"
    docLink: "https://astro.build/"
  - name: "Cloudflare Pages"
    icon: "simple-icons:cloudflare"
    docLink: "https://pages.cloudflare.com/"
---

## Project Summary

**g2w (Game to Website)** is an open-source, TypeScript-first framework for building and shipping HTML5 games — 2D first, 3D planned — for desktop and mobile web browsers. Instead of installing a multi-gigabyte engine, you run `pnpm create g2w my-game` and your game runs directly in the browser, TypeScript end to end. Live docs at [g2w.alexanderar.com](https://g2w.alexanderar.com), source on [GitHub](https://github.com/AlexanderDev2004/g2w), published to npm under the [@g2w](https://www.npmjs.com/org/g2w) organization.

## The Problem

Browser-game tooling sits at two extremes: all-in-one engines (Phaser) bundle everything and decide everything for you, while pure renderers (PixiJS) leave every architectural decision to you. Neither gives you a framework *structure* — game loop, scenes, input, audio, lifecycle, devtools — that survives changing the rendering technology underneath.

## The Solution

g2w is the middle layer: a framework skeleton with a **zero-dependency core** where the renderer is not an implementation detail but a **tested contract** — the same conformance suite (12 features per backend) runs against WebGL, Canvas, and WebGPU backends in real headless browsers. Architecture rules are enforced by tests themselves: `@g2w/core` cannot depend on PixiJS, the DOM, or Effect, and an architecture test fails the build if that ever changes.

## Key Features

- **Renderer-agnostic core** — swap WebGL/Canvas/WebGPU backends behind one tested contract; core has zero runtime dependencies.
- **8 npm packages** — core, Effect-based runtime, Pixi renderer, DOM + gamepad input, web audio, devtools, and the `create-g2w` CLI scaffold.
- **453/453 tests** — architecture rules, lifecycle/disposal ownership, and cross-backend conformance all enforced in CI on every commit.
- **npm trusted publishing** — OIDC-based release workflow with fail-safe version validation gates.
- **Live docs site** — Astro documentation with Ctrl+K search, playground, benchmarks, and an honest roadmap, deployed to Cloudflare Pages via CI.
- **Real benchmarks** — headless Chrome CDP harness, median-of-3: 60 fps up to 5,000 sprites; cross-framework comparison against raw PixiJS, Phaser 4, and Three.js on identical workloads.

## Technologies Used

- [TypeScript (strict)](https://www.typescriptlang.org/) — end to end, no un-justified `any`.
- [pnpm workspaces](https://pnpm.io/) — monorepo for the 8-package ecosystem.
- [PixiJS 8](https://pixijs.com/) — first renderer backend (WebGL/Canvas/WebGPU).
- [Effect](https://effect.website/) — application runtime lifecycle (`G2WGame`), kept out of the core.
- [Vitest](https://vitest.dev/) — 453 tests including the architecture-enforcement suite.
- [Astro](https://astro.build/) — documentation website with search and playground.
- [Cloudflare Pages](https://pages.cloudflare.com/) — CI/CD deployment for the docs site.
