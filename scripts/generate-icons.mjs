// Collects every iconify icon id used anywhere (string literals in src/, the
// content and GitHub JSON data) and writes the resolved SVG path bodies to
// src/data/icons.json. src/components/Icon.tsx renders them as inline SVG, so
// no icon runtime (script from code.iconify.design + API fetches) ships to
// the browser.
//
// Run automatically by `bun run build` (and `generate:icons`). Committed like
// the other generated data files so `vite dev` works without running it.
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const outPath = join(root, 'src', 'data', 'icons.json');

const collections = {
  mdi: JSON.parse(readFileSync(join(root, 'node_modules', '@iconify-json', 'mdi', 'icons.json'), 'utf8')),
  'simple-icons': JSON.parse(
    readFileSync(join(root, 'node_modules', '@iconify-json', 'simple-icons', 'icons.json'), 'utf8'),
  ),
};

function walk(dir, files = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) walk(p, files);
    else if (/\.(ts|tsx|css|json|md)$/.test(entry.name)) files.push(p);
  }
  return files;
}

const sources = new Set();
for (const dir of ['src/routes', 'src/components', 'src/lib', 'src/data']) {
  try {
    for (const f of walk(join(root, dir))) sources.add(f);
  } catch {
    /* directory may not exist */
  }
}

const used = new Set();
const idPattern = /\b(mdi|simple-icons):([a-z0-9-]+)\b/g;
for (const file of sources) {
  const text = readFileSync(file, 'utf8');
  for (const match of text.matchAll(idPattern)) used.add(`${match[1]}:${match[2]}`);
}

const icons = {};
const missing = [];
for (const id of [...used].sort()) {
  const [prefix, name] = id.split(':');
  const body = collections[prefix]?.icons?.[name]?.body;
  if (body) icons[id] = body;
  else missing.push(id);
}

if (missing.length) {
  console.warn(`[icons] missing from collections: ${missing.join(', ')}`);
}

writeFileSync(outPath, JSON.stringify(icons, null, 2) + '\n');
console.log(`[icons] src/data/icons.json (${Object.keys(icons).length} icons)`);
