// What I use day to day — rendered as tables on the /uses page (uses.tech style).
// Edit the arrays below to add, remove, or reword entries; the page picks it up
// automatically. `icon` uses an Iconify MDI name (https://icon-sets.iconify.design/mdi/).

export interface UseItem {
  name: string;
  description: string;
  /** Optional external link (official site / repo) shown next to the name. */
  link?: string;
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
    id: "software",
    title: "Software",
    icon: "mdi:apps",
    items: [
      {
        name: "Raycast + Vicinae",
        link: "https://www.raycast.com",
        description:
          "One launcher to rule both my operating systems: Raycast keeps Windows snappy, Vicinae gives Linux the same superpowers, and my muscle memory has never been this confused yet this productive.",
      },
      {
        name: "Ghostty",
        link: "https://ghostty.org",
        description:
          "omg is cool. A terminal so fast it finishes rendering my excuses before I even finish typing them.",
      },
      {
        name: "Brave",
        link: "https://brave.com",
        description:
          "It blocks ads so aggressively that the web finally feels peaceful — my battery lasts past lunch and my sanity made a full recovery.",
      },
      {
        name: "Zed",
        link: "https://zed.dev",
        description:
          "A Rust-powered editor that opens my project before my finger leaves the Enter key. Waiting for a load bar is now a vintage experience.",
      },
      {
        name: "Herdr",
        link: "https://herdr.dev",
        description:
          "The runtime my coding agents live on — real terminals that stay alive when the laptop lid closes, ready to reattach from any tty. My agents now work harder than my sleep schedule.",
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
        link: "https://opencode.ai",
        description:
          "My go-to open-source AI coding agent in the terminal — quick edits, refactors, and shell work without leaving the CLI.",
      },
      {
        name: "AMPCode",
        link: "https://ampcode.com",
        description:
          "The agent I reach for on bigger jobs — large refactors, new features, and shipping this very site.",
      },
      {
        name: "Pi",
        link: "https://pi.dev",
        description:
          "A lightweight assistant I keep around for quick questions, drafting, and brainstorming on the go.",
      },
    ],
  },
];
