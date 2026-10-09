// Build-time markdown content pipeline (replaces Astro Content Collections).
//
// All markdown under src/content is imported raw by Vite's glob API, parsed
// with gray-matter and rendered to HTML with the unified toolchain — the same
// pipeline recommended by the TanStack Start "Rendering Markdown" guide.
//
// The GitHub "Issue to Blog Post" workflow keeps working unchanged: it simply
// writes .md files into src/content/blogs, which this loader picks up.
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';
import { normalizeSlug } from './slug';

export interface BlogPost {
  slug: string;
  title: string;
  date: string; // ISO date
  description: string;
  tags: string[];
  html: string;
}

export interface ProjectTech {
  name: string;
  icon: string;
  docLink?: string;
}

export interface Project {
  slug: string;
  title: string;
  year: string;
  description: string;
  fullDescriptionHtml: string;
  image?: string;
  projectLink?: string;
  repoLink?: string;
  technologies: ProjectTech[];
}

export interface Report {
  slug: string;
  title: string;
  date: string;
  author: string;
  severity: string;
  cwe: string;
  owasp: string;
  tags: string[];
  html: string;
}

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeRaw)
  .use(rehypeStringify);

/** Blog media lives in src/content/blogs/media — served from /blogs/media. */
function rewriteMedia(source: string): string {
  return source
    .replaceAll('](./media/', '](/blogs/media/')
    .replaceAll('](media/', '](/blogs/media/');
}

async function renderMarkdown(source: string): Promise<string> {
  const file = await processor.process(rewriteMedia(source));
  return String(file);
}

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === 'string') : [];
}

function isoDate(value: unknown): string {
  const parsed = value instanceof Date ? value : new Date(String(value ?? ''));
  return Number.isNaN(parsed.getTime()) ? new Date(0).toISOString() : parsed.toISOString();
}

const blogModules = import.meta.glob<string>('/src/content/blogs/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});

const projectModules = import.meta.glob<string>('/src/content/projects/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});

const reportModules = import.meta.glob<string>('/src/content/reports/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});

function slugOf(path: string): string {
  const base = path.split('/').pop() ?? path;
  return normalizeSlug(base.replace(/\.md$/, ''));
}

export const blogs: BlogPost[] = (
  await Promise.all(
    Object.entries(blogModules).map(async ([path, raw]) => {
      const { data, content } = matter(raw);
      return {
        slug: slugOf(path),
        title: asString(data.title, 'Untitled'),
        date: isoDate(data.date),
        description: asString(data.description),
        tags: asStringArray(data.tags),
        html: await renderMarkdown(content),
      } satisfies BlogPost;
    }),
  )
).sort((a, b) => b.date.localeCompare(a.date));

export const projects: Project[] = (
  await Promise.all(
    Object.entries(projectModules).map(async ([path, raw]) => {
      const { data, content } = matter(raw);
      const technologies = Array.isArray(data.technologies)
        ? data.technologies.map((t) => {
            const tech = t as Record<string, unknown>;
            return {
              name: asString(tech.name),
              icon: asString(tech.icon),
              docLink: asString(tech.docLink) || undefined,
            };
          })
        : [];
      return {
        slug: slugOf(path),
        title: asString(data.title, 'Untitled').trim(),
        year: asString(data.year),
        description: asString(data.description),
        fullDescriptionHtml: await renderMarkdown(content),
        image: asString(data.image) || undefined,
        projectLink: asString(data.projectLink) || undefined,
        repoLink: asString(data.repoLink) || undefined,
        technologies,
      } satisfies Project;
    }),
  )
).sort((a, b) => {
  const yearDiff = Number.parseInt(b.year, 10) - Number.parseInt(a.year, 10);
  if (Number.isFinite(yearDiff) && yearDiff !== 0) return yearDiff;
  return a.title.localeCompare(b.title);
});

export const reports: Report[] = (
  await Promise.all(
    Object.entries(reportModules).map(async ([path, raw]) => {
      const { data, content } = matter(raw);
      return {
        slug: slugOf(path),
        title: asString(data.title, 'Untitled'),
        date: isoDate(data.date),
        author: asString(data.author),
        severity: asString(data.severity),
        cwe: asString(data.cwe),
        owasp: asString(data.owasp),
        tags: asStringArray(data.tags),
        html: await renderMarkdown(content),
      } satisfies Report;
    }),
  )
).sort((a, b) => b.date.localeCompare(a.date));

export function getBlog(slug: string): BlogPost | undefined {
  return blogs.find((b) => b.slug === normalizeSlug(slug));
}

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === normalizeSlug(slug));
}

export function getReport(slug: string): Report | undefined {
  return reports.find((r) => r.slug === normalizeSlug(slug));
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function formatDateShort(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
