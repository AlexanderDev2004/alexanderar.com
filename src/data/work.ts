export interface WorkRole {
  title: string;
  /** Small pill next to the role name, e.g. "Current" or the campus program name. */
  badge?: string;
  /** "solid" for the current/primary role, "outline" for secondary roles. */
  badgeStyle?: 'solid' | 'outline';
  startDate: string;
  endDate: string | null;
  /** Work mode for this role, e.g. "Remote · Part-time". */
  mode: string;
}

export interface WorkItem {
  company: string;
  jobTitle: string;
  country: string;
  status: string[];
  startDate: string;
  endDate: string | null;
  link: string;
  /** Set when one company covered several roles; rendered as sub-rows. */
  roles?: WorkRole[];
  description: string[];
  tags: string[];
}

export const works: WorkItem[] = [
  {
    company: "Ariverse Studio",
    jobTitle: "Game Developer & Game Programmer Intern",
    country: "Indonesia",
    // Two roles with different modes — each sub-role states its own, so the
    // entry header stays mode-neutral.
    status: [],
    startDate: "Sep 2025",
    endDate: null,
    link: "https://www.ariversestudio.com/",
    roles: [
      {
        title: "Game Developer",
        badge: "Current",
        badgeStyle: "solid",
        startDate: "Sep 2025",
        endDate: null,
        mode: "Remote · Part-time",
      },
      {
        title: "Game Programmer Intern",
        badge: "Program internship Campus (Polinema)",
        badgeStyle: "outline",
        startDate: "Jul 2026",
        endDate: null,
        mode: "On-site · Internship",
      },
    ],
    description: [
      "Developed engaging and interactive games using Unity and C#.",
      "Collaborated with designers and artists to create immersive gaming experiences.",
      "Optimized game performance for various platforms including mobile and desktop."
    ],
    tags: [
      "UNITY",
      "C#",
      "GAME DEVELOPMENT",
      "Game Design"
    ]
  },
  {
    company: "PT. Surabaya Autocomp Indonesia - Internship",
    jobTitle: "Full Stack Developer",
    country: "Indonesia",
    status: ["ON-SITE", "FULL-TIME"],
    startDate: "Jan 2026",
    endDate: "June 2026",
    link: "https://www.yazaki-group.com/en/company/index.html",
    description: [
      "Building scalable backend services with Django",
      "Managing PostgreSQL databases and optimization",
      "Implementing RESTful APIs and authentication systems"
    ],
    tags: [
      "Django",
      "Python",
      "PostgreSQL"
    ]
  }
];
