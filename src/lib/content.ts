// Content access layer — the markdown parsing itself runs at BUILD time in
// scripts/generate-content.mjs, which writes src/data/content.json. This
// module only types and serves that pre-rendered data, so none of the
// gray-matter / unified / remark toolchain ships to the browser.
//
// To add or edit content, change the .md files under src/content and let
// `bun run build` (or `bun run generate:content`) regenerate the JSON.
import raw from '../data/content.json';
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
  /** Cover intrinsic size, parsed at build time — reserves the exact box. */
  imageWidth?: number;
  imageHeight?: number;
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

const content = raw as {
  blogs: BlogPost[];
  projects: Project[];
  reports: Report[];
};

export const blogs: BlogPost[] = content.blogs;
export const projects: Project[] = content.projects;
export const reports: Report[] = content.reports;

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
