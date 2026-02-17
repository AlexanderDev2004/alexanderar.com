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
    id: 'Games',
    name: 'Games - Tech & Design',
    icon: 'mdi:gamepad-variant',
    items: [
      {
        id: 'Game Desain',
        title: 'Game desain',
        description: 'Game Design is a discipline involved in game development. Game Design is primarily concerned with player psychology: how will players feel when they experience this?',
        url: 'https://danielzklein.medium.com/what-is-game-design-441522cf1aa0',
        preview: 'https://api.microlink.io?url=https://danielzklein.medium.com/what-is-game-design-441522cf1aa0&screenshot=true&meta=false&embed=screenshot.url',
        tags: ['design', 'game'],
      },
      
    ],
  },
];
