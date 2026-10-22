---
title: "LogBook Internship"
year: "2026"
description: "Web app that replaces the manual Typst/Word log book workflow for Program internship Campus — daily activities, AI text refinement, three-party signing, and PDF export in the official format."
fullDescription: "LogBook Internship replaces the manual Typst/Word log book workflow for Program internship Campus (Polinema): write daily activities, polish wording with AI, collect three required signatures through private single-use links, and export the signed PDF in the exact official format."
image: "/images/logbook-internship.webp"
projectLink: "https://logbook.alexanderar.com"
repoLink: "https://github.com/AlexanderDev2004/logbook-internship"
technologies:
  - name: "TanStack Start"
    icon: "simple-icons:tanstack"
    docLink: "https://tanstack.com/start"
  - name: "React"
    icon: "simple-icons:react"
    docLink: "https://react.dev/"
  - name: "TypeScript"
    icon: "simple-icons:typescript"
    docLink: "https://www.typescriptlang.org/"
  - name: "Effect"
    icon: "simple-icons:effect"
    docLink: "https://effect.website/"
  - name: "Drizzle ORM"
    icon: "simple-icons:drizzle"
    docLink: "https://orm.drizzle.team/"
  - name: "Cloudflare Workers"
    icon: "simple-icons:cloudflare"
    docLink: "https://workers.cloudflare.com/"
---

## Project Summary

**LogBook Internship** is a web app that replaces the manual Typst/Word log book workflow for **Program internship Campus** (Polinema). Students write daily activities, let AI polish the wording, collect the three required signatures, and export the signed PDF in the exact official format — no more copy-pasting between documents or chasing signatures over chat. Live at [logbook.alexanderar.com](https://logbook.alexanderar.com).

## The Problem

The internship log book at Polinema is still a manual document: a Word/Typst template that must be filled weekly, printed, signed by three different parties (student, field supervisor, academic advisor), then scanned and archived. The workflow is slow, signatures get lost, revisions mean rewriting whole pages, and the layout constantly breaks.

## The Solution

A self-contained log book platform: weekly pages match the official Polinema template exactly (letterhead, student info table, activities table with Hari/Tanggal, Jam Masuk, Jam Pulang, Kegiatan, and the three-party signature block). Entries can be refined with AI in one click — each user brings their own API key (OpenRouter, [OI], Claude, Groq, and more), stored server-side and never sent to the browser. Each party signs through a private, single-use link with a drawn signature; weeks lock once signed. The final PDF is compiled in the browser with the Typst WASM compiler using metric-compatible fonts (Liberation Serif, Carlito), so the export is pixel-faithful to the official template.

## Key Features

- **Official template fidelity** — weekly log book pages replicate the Polinema letterhead, student info table, activities table, and signature block exactly.
- **AI text refinement** — one click per entry or per week; BYO API key with a provider/model picker, keys stored server-side only.
- **Three-step signing** — student, Pembimbing Lapangan, and Dosen Pembimbing each sign via private single-use links drawn in the browser; signed weeks lock from editing.
- **PDF export** — Typst WASM compilation in the browser with bundled metric-compatible fonts; export a single week or everything at once.
- **Fully customizable** — letterhead logo and lines, titles, fonts, student identity, supervisor names, and a stored personal signature.
- **Page-shaped signature editor** — drag, resize, and rotate signature boxes on a live page preview with scale support.

## Technologies Used

- [TanStack Start](https://tanstack.com/start) — SSR framework with type-safe file-based routing.
- [Effect](https://effect.website/) — the AI service layer with typed errors.
- [Drizzle ORM](https://orm.drizzle.team/) on Cloudflare D1 — data layer.
- [Typst (WASM)](https://typst.app/) — in-browser PDF generation.
- [Alchemy](https://alchemy.run/) — infrastructure-as-code deployment to Cloudflare Workers.
