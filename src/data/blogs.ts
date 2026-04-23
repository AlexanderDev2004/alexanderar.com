export interface BlogItem {
  id: string;
  title: string;
  date: string;
  description: string;
  content: string;
  tags: string[];
  slug: string;
}

export const blogs: BlogItem[] = [
  {
    id: 'from-neovim-to-helix',
    title: 'From Neovim To Helix',
    date: '28 October 2025',
    description: 'Reasons why I\'m leaving Neovim in favour of Helix editor due to its simplicity',
    content: '<p>After years of using Neovim with countless plugins and configurations, I decided to switch to Helix. This post explores the reasons behind this decision and my experience with the transition.</p><p>Helix brings a fresh approach to modal editing with built-in features that would require extensive plugin setup in Neovim. The language server support is seamless, and the keybindings feel more intuitive for everyday development.</p>',
    tags: ['neovim', 'editor', 'helix'],
    slug: 'from-neovim-to-helix',
  },
  {
    id: 'turning-issues-into-posts',
    title: 'Turning Issues Into Posts',
    date: '10 April 2025',
    description: 'Github issues combined with a simple workflow script to manage contents',
    content: '<p>Discover how to transform GitHub issues into blog posts using a simple workflow script. This approach helps in managing content and keeping track of ideas in one place.</p><p>By leveraging GitHub\'s issue tracking system alongside automation, you can streamline your content creation process and maintain better organization of your writing projects.</p>',
    tags: ['website'],
    slug: 'turning-issues-into-posts',
  },
  {
    id: 'college-hitting-different-lately',
    title: 'College Be Hitting Different Lately',
    date: '9 April 2025',
    description: 'Endless things to learn, explore, and forget by next week, with zero time to process any of it :)',
    content: '<p>College life has changed significantly. There\'s so much to learn in such a short time, and sometimes it feels overwhelming to keep up with everything.</p><p>In this post, I reflect on the challenges of modern education and how to better manage the information overload while maintaining sanity and enjoying the learning experience.</p>',
    tags: ['life', 'random'],
    slug: 'college-hitting-different-lately',
  },
  {
    id: 'japanese-fulltext-search-sqlite',
    title: 'Japanese Full-Text Search In SQLite',
    date: '19 May 2022',
    description: 'A simple example of how you can make Japanese full-text-search in SQLite.',
    content: '<p>Japanese text search in SQLite can be tricky due to the nature of the language. This post provides practical examples of implementing full-text search functionality for Japanese content.</p><p>Learn about the techniques and libraries that make Japanese search efficient and accurate in your SQLite databases.</p>',
    tags: ['japanese', 'sqlite', 'csharp'],
    slug: 'japanese-fulltext-search-sqlite',
  },
  {
    id: 'path-alias-javascript-typescript',
    title: 'Path Alias In Javascript And Typescript',
    date: '4 March 2022',
    description: 'Have you ever got tired of writing relative paths that look like ..././? No worries, path alias to the rescue!',
    content: '<p>Tired of maintaining confusing relative paths in your JavaScript and TypeScript projects? Path aliases are the solution you\'ve been looking for.</p><p>This guide covers how to set up and use path aliases to make your imports cleaner and your code more maintainable across different project structures.</p>',
    tags: ['javascript', 'typescript'],
    slug: 'path-alias-javascript-typescript',
  },
  {
    id: 'year-of-japanese-well-kinda',
    title: 'A Year Of Japanese... Well, Kinda',
    date: '31 October 2021',
    description: 'A post where I write my journey on learning Japanese. Man, I forgot how did I learn a foreign language.',
    content: '<p>One year into learning Japanese, and I\'ve made significant progress while also realizing how much more there is to learn. This post is a reflection on my language learning journey.</p><p>I share the challenges, breakthroughs, and lessons learned throughout this adventure of language acquisition.</p>',
    tags: ['japanese', 'random'],
    slug: 'year-of-japanese-well-kinda',
  },
  {
    id: 'combining-adonis-svelte-inertiajs',
    title: 'Combining Adonis And Svelte Using InertiaJS',
    date: '29 August 2021',
    description: 'A short guide to build modern monolithic app using InertiaJS with Adonis and Svelte',
    content: '<p>InertiaJS bridges the gap between front-end and back-end development, allowing you to build modern single-page applications with server-side routing. This post explores how to combine Adonis and Svelte using InertiaJS.</p><p>Learn the setup process, best practices, and how to leverage the power of both frameworks together.</p>',
    tags: ['svelte', 'website'],
    slug: 'combining-adonis-svelte-inertiajs',
  },
  {
    id: 'migrating-sapper-sveltekit',
    title: 'Migrating From Sapper To SvelteKit',
    date: '14 April 2021',
    description: 'A post about my experience migrating my blog from Sapper to SvelteKit.',
    content: '<p>SvelteKit represents the next generation of Svelte applications with improved performance and developer experience. This post documents my migration journey from Sapper to SvelteKit.</p><p>I cover the challenges faced, breaking changes to be aware of, and the benefits gained from upgrading to the newer framework.</p>',
    tags: ['svelte', 'website'],
    slug: 'migrating-sapper-sveltekit',
  },
  {
    id: 'utterances-comment-section',
    title: 'Utterances - Comment Section That Just Works',
    date: '22 February 2021',
    description: 'I\'ve been waiting to add a comment section to my website, but only realized',
    content: '<p>Adding comments to a static blog can be challenging, but Utterances makes it simple by leveraging GitHub discussions. This post explains why I chose Utterances and how to integrate it.</p><p>Learn about the benefits of this approach and how it improves reader engagement while maintaining simplicity and control over your blog.</p>',
    tags: ['website'],
    slug: 'utterances-comment-section',
  },
];
