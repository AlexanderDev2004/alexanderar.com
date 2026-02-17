export interface BookmarkItem {
  id: string;
  title: string;
  description: string;
  url: string;
  image?: string;
  preview?: string; // Website preview/thumbnail
  tags?: string[];
}

export interface BookmarkCategory {
  id: string;
  name: string;
  icon: string;
  items: BookmarkItem[];
}

export const bookmarks: BookmarkCategory[] = [
  {
    id: 'designs',
    name: 'Designs',
    icon: 'mdi:palette',
    items: [
      {
        id: 'ui-animation',
        title: '60fps - UI/UX Animation inspiration for mobile & web apps',
        description: 'Endless collection of delightful details from best-in-class apps',
        url: 'https://60fps.design',
        preview: 'https://api.microlink.io?url=https://60fps.design&screenshot=true&meta=false&embed=screenshot.url',
        tags: ['design', 'animation', 'ui'],
      },
      {
        id: 'architect-guide',
        title: 'A guide to interface design for older adults | Architects Blog',
        description: 'Interface design guidelines specifically for older adults',
        url: 'https://adohitects.co',
        preview: 'https://api.microlink.io?url=https://adohitects.co&screenshot=true&meta=false&embed=screenshot.url',
        tags: ['design', 'accessibility', 'ux'],
      },
      {
        id: 'asset-forge',
        title: 'Asset Forge - Kenney',
        description: 'Completely free, game assets builder',
        url: 'https://kenney.nl',
        preview: 'https://api.microlink.io?url=https://kenney.nl&screenshot=true&meta=false&embed=screenshot.url',
        tags: ['design', 'assets', 'game'],
      },
      {
        id: 'awwwards',
        title: 'Awwwards - Website Awards - Best Web Design Trends',
        description: 'The awards of design, creativity and innovation on the internet',
        url: 'https://awwwards.com',
        preview: 'https://api.microlink.io?url=https://awwwards.com&screenshot=true&meta=false&embed=screenshot.url',
        tags: ['design', 'web', 'awards'],
      },
      {
        id: 'best-websites',
        title: 'Best websites & fonts inspiration feed',
        description: 'Curated collection of best websites and font inspirations',
        url: 'https://maxibest.one',
        preview: 'https://api.microlink.io?url=https://maxibest.one&screenshot=true&meta=false&embed=screenshot.url',
        tags: ['design', 'fonts', 'websites'],
      },
      {
        id: 'chamjo',
        title: 'Chamjo | The ultimate UX inspiration hub for local apps and...',
        description: 'Your go-to source for Design Inspirations',
        url: 'https://chamjo.design',
        preview: 'https://api.microlink.io?url=https://chamjo.design&screenshot=true&meta=false&embed=screenshot.url',
        tags: ['design', 'inspiration', 'ux'],
      },
    ],
  },
  {
    id: 'software-engineering',
    name: 'Software Engineering (Non Tech)',
    icon: 'mdi:cog',
    items: [
      {
        id: 'design-patterns',
        title: 'Design Patterns - Gang of Four',
        description: 'The classic reference book on design patterns',
        url: '#',
        tags: ['engineering', 'patterns', 'architecture'],
      },
      {
        id: 'clean-code',
        title: 'Clean Code Principles',
        description: 'Writing maintainable and readable code',
        url: '#',
        tags: ['engineering', 'code-quality', 'practices'],
      },
      {
        id: 'system-design',
        title: 'System Design Fundamentals',
        description: 'Learn how to design large-scale systems',
        url: '#',
        tags: ['engineering', 'architecture', 'scalability'],
      },
    ],
  },
  {
    id: 'language-learning',
    name: 'Language Learning',
    icon: 'mdi:earth',
    items: [
      {
        id: 'chinese-learning',
        title: 'Learning Chinese - Beginner Guide',
        description: 'A comprehensive guide to start learning Mandarin Chinese',
        url: '#',
        tags: ['language', 'chinese', 'learning'],
      },
      {
        id: 'japanese-resources',
        title: 'Japanese Learning Resources',
        description: 'Curated resources for learning Japanese language',
        url: '#',
        tags: ['language', 'japanese', 'resources'],
      },
      {
        id: 'spanish-immersion',
        title: 'Spanish Language Immersion',
        description: 'Immersive approach to learning Spanish',
        url: '#',
        tags: ['language', 'spanish', 'immersion'],
      },
    ],
  },
];
