---
title: "LearnMap"
year: "2026"
description: "Modern reimplementation of the KitBuild Concept Map platform — automatic map diagnosis, kit generation, and research analytics for formative assessment. Built as a thesis, survived the defense."
fullDescription: "LearnMap is a modern, researcher-friendly reimplementation of the KitBuild Concept Map platform (Hiroshima University) built for my bachelor thesis — goal-map editor, automatic kit generation and diagnosis, segmentation experiments, and research dashboards on Cloudflare Workers. The thesis passed. The deadline anxiety is now open source."
image: "/images/learnmap.webp"
projectLink: ""
repoLink: "https://github.com/AlexanderDev2004/Learmap-kitbuild"
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

**LearnMap** is a modern reimplementation of the [KitBuild Concept Map](https://collab.kit-build.net/) platform, originally developed by the Learning Engineering Laboratory at Hiroshima University. Built as part of my bachelor thesis, it recreates the proven KitBuild pedagogy — concept map reconstruction for formative assessment — on a modern web stack, and extends it with the segmentation experiment that my research focuses on.

Yes, this is a *thesis project*. That sentence alone explains the git history at 3 AM. But unlike most thesis projects, this one didn't get abandoned two weeks after the defense — it's deployed, it runs, and it diagnoses student misconceptions better than my sleep schedule ever diagnosed itself.

## The Problem

The original KitBuild system has been operational since 2009 and is used across 1700+ institutions, but its stack shows its age. Researchers who want to run concept-map experiments need external tools for questionnaires, manual kit preparation, and offline score analysis. My thesis also needed a platform that could compare two segmentation models (Paragraph vs Depth-Topic) for distributing kit segments to students — something the original system does not support.

## The Solution

LearnMap reimplements the full KitBuild workflow: instructors draw a goal map in a visual concept-map editor, the system disassembles it into student-ready kits, students reconstruct the map, and the engine automatically diagnoses the result against the goal map to surface misconceptions. The thesis experiment is built in as a first-class feature: a goal map can be segmented into ordered kit segments using either the Paragraph or the Depth-Topic model, so both conditions can run on the same platform and the same data model. Everything — pre-test, post-test, delayed test, questionnaires, analytics, CSV export — lives in one place, deployed on Cloudflare Workers with LibSQL/Turso, so no VPS is required.

## Key Features

- **Concept Map Editor** — visual editor for goal maps with bi-directional and multi-link support, named/colored visual frames, and drag-and-drop canvas built on XYFlow.
- **Automatic Kit Generation & Diagnosis** — goal maps are disassembled into kits; learner maps are automatically compared against the goal map with targeted feedback.
- **Segmentation Models** — Paragraph and Depth-Topic segmentation split a goal map into the kit segments students work through, in order — the core of the thesis experiment.
- **Extended Assessments** — quiz builder for MCQ, short answer, and Likert-scale questions with Aiken format import/export and "Show Answer" review control.
- **Assignment Management** — deadlines, time limits, access control, and per-assignment forms (pretest/posttest/questionnaire).
- **Research Dashboard** — analytics sheets, per-student results, and exportable CSV for research analysis.

## Technologies Used

- [TanStack Start](https://tanstack.com/start) — full-stack React framework with SSR and type-safe routing.
- [Effect](https://effect.website/) — typed functional core for services and error handling.
- [Drizzle ORM](https://orm.drizzle.team/) + LibSQL/Turso — schema-safe data layer.
- [Cloudflare Workers](https://workers.cloudflare.com/) — edge deployment with R2 for material images.
- Tailwind CSS v4 + shadcn/ui for the interface.

## Attribution

All core assessment methods come directly from the original KitBuild research (Hirashima et al.). LearnMap introduces no new pedagogy — it reimplements proven methods in a maintainable form. The procrastination, however, is entirely original work.
