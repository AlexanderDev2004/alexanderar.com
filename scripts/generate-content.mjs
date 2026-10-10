// Build-time content pipeline: parse all markdown under src/content ONCE and
// write the rendered result to src/data/content.json.
//
// Why: src/lib/content.ts used to run gray-matter + the unified/remark/rehype
// toolchain inside the client bundle (raw markdown sources included). Content
// is fully static — it only changes at build time — so shipping a markdown
// engine to every visitor was ~300 KB of avoidable JavaScript that dominated
// hydration (Lighthouse main-thread work 2.3 s).
//
// The JSON it writes is committed (same pattern as src/data/github.json), so
// `vite dev` works without running this script first; `bun run build`
// regenerates it. The "Issue to Blog Post" GitHub workflow keeps working
// unchanged: it writes .md files, and the next build picks them up.
//
// NOTE: keep the frontmatter mapping, sorting, and slug logic in sync with
// src/lib/content.ts (they used to live in one place).
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, basename } from 'node:path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';

const root = process.cwd();
const outPath = join(root, 'src', 'data', 'content.json');

// Same as normalizeSlug in src/lib/slug.ts — keep in sync.
const normalizeSlug = (value) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeRaw)
  .use(rehypeStringify);

/** Blog media lives in src/content/blogs/media — served from /blogs/media. */
function rewriteMedia(source) {
  return source.replaceAll('](./media/', '](/blogs/media/').replaceAll('](media/', '](/blogs/media/');
}

async function renderMarkdown(source) {
  const file = await processor.process(rewriteMedia(source));
  return String(file);
}

function asString(value, fallback = '') {
  return typeof value === 'string' ? value : fallback;
}

function asStringArray(value) {
  return Array.isArray(value) ? value.filter((v) => typeof v === 'string') : [];
}

function isoDate(value) {
  const parsed = value instanceof Date ? value : new Date(String(value ?? ''));
  return Number.isNaN(parsed.getTime()) ? new Date(0).toISOString() : parsed.toISOString();
}

function readDir(dir) {
  try {
    return readdirSync(dir).filter((f) => f.endsWith('.md'));
  } catch {
    return [];
  }
}

const slugOf = (path) => normalizeSlug(basename(path, '.md'));

const blogs = [];
for (const file of readDir(join(root, 'src', 'content', 'blogs'))) {
  const raw = readFileSync(join(root, 'src', 'content', 'blogs', file), 'utf8');
  const { data, content } = matter(raw);
  blogs.push({
    slug: slugOf(file),
    title: asString(data.title, 'Untitled'),
    date: isoDate(data.date),
    description: asString(data.description),
    tags: asStringArray(data.tags),
    html: await renderMarkdown(content),
  });
}
blogs.sort((a, b) => b.date.localeCompare(a.date));

const projects = [];
for (const file of readDir(join(root, 'src', 'content', 'projects'))) {
  const raw = readFileSync(join(root, 'src', 'content', 'projects', file), 'utf8');
  const { data, content } = matter(raw);
  const technologies = Array.isArray(data.technologies)
    ? data.technologies.map((t) => ({
        name: asString(t?.name),
        icon: asString(t?.icon),
        docLink: asString(t?.docLink) || undefined,
      }))
    : [];
  projects.push({
    slug: slugOf(file),
    title: asString(data.title, 'Untitled').trim(),
    year: asString(data.year),
    description: asString(data.description),
    fullDescriptionHtml: await renderMarkdown(content),
    image: asString(data.image) || undefined,
    projectLink: asString(data.projectLink) || undefined,
    repoLink: asString(data.repoLink) || undefined,
    technologies,
  });
}
projects.sort((a, b) => {
  const yearDiff = Number.parseInt(b.year, 10) - Number.parseInt(a.year, 10);
  if (Number.isFinite(yearDiff) && yearDiff !== 0) return yearDiff;
  return a.title.localeCompare(b.title);
});

const reports = [];
for (const file of readDir(join(root, 'src', 'content', 'reports'))) {
  const raw = readFileSync(join(root, 'src', 'content', 'reports', file), 'utf8');
  const { data, content } = matter(raw);
  reports.push({
    slug: slugOf(file),
    title: asString(data.title, 'Untitled'),
    date: isoDate(data.date),
    author: asString(data.author),
    severity: asString(data.severity),
    cwe: asString(data.cwe),
    owasp: asString(data.owasp),
    tags: asStringArray(data.tags),
    html: await renderMarkdown(content),
  });
}
reports.sort((a, b) => b.date.localeCompare(a.date));

writeFileSync(outPath, JSON.stringify({ blogs, projects, reports }, null, 2) + '\n');
console.log(`[content] src/data/content.json (${blogs.length} blogs, ${projects.length} projects, ${reports.length} reports)`);
