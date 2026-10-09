// What I use day to day — rendered as tables on the /uses page (uses.tech style).
// Edit the arrays below to add, remove, or reword entries; the page picks it up
// automatically. `icon` uses an Iconify MDI name (https://icon-sets.iconify.design/mdi/).

export interface UseItem {
  name: string;
  description: string;
}

export interface UseCategory {
  id: string;
  title: string;
  icon: string;
  items: UseItem[];
}

export const uses: UseCategory[] = [
  {
    id: "hardware",
    title: "Hardware",
    icon: "mdi:laptop",
    items: [
      {
        name: "Laptop HP Presario CQ42-105TU",
        description:
          "This was my first machine that I used for serious work. I still have it laying around at my house, mostly used by my little brother.",
      },
      {
        name: "Laptop Asus Tuf Gaming F15",
        description:
          "In addition to gaming, I use this laptop for programming and various tasks ranging from light to heavy workloads; it is currently performing well, and this is the device I am using right now.",
      },
      {
        name: "Vivo Y29 128 GB, 8 GB",
        description:
          "I like this phone because it is designed to be durable enough to withstand drops, and I use it for both daily tasks and gaming.",
      },
    ],
  },
  {
    id: "agents",
    title: "Agents",
    icon: "mdi:robot-outline",
    items: [
      {
        name: "OpenCode",
        description:
          "My go-to open-source AI coding agent in the terminal — quick edits, refactors, and shell work without leaving the CLI.",
      },
      {
        name: "AMPCode",
        description:
          "The agent I reach for on bigger jobs — large refactors, new features, and shipping this very site.",
      },
      {
        name: "Pi",
        description:
          "A lightweight assistant I keep around for quick questions, drafting, and brainstorming on the go.",
      },
    ],
  },
];
