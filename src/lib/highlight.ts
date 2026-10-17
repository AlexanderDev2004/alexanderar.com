// Shared TanStack Highlight highlighter.
//
// `createHighlighter` is synchronous and deterministic, and this module-level
// instance is created once per process — the SSR pass and the browser render
// the exact same token markup from it, so hydration never mismatches and no
// async "highlighter loading" state exists.
//
// Only the languages the site's content actually uses are registered: fenced
// code across blogs and reports is bash (→ shell), php, and diff. Any other
// fence (or an untagged indented block) falls back to plaintext instead of
// shipping tokenizers no one needs.
import { createHighlighter, type Highlighter } from '@tanstack/highlight';
import { diff } from '@tanstack/highlight/languages/diff';
import { php } from '@tanstack/highlight/languages/php';
import { shell } from '@tanstack/highlight/languages/shell';

export const highlighter: Highlighter = createHighlighter({
  fallbackLanguage: 'plaintext',
  languages: [shell, php, diff],
});
