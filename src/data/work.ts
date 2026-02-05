export interface WorkItem {
  company: string;
  jobTitle: string;
  status: string[];
  startDate: string;
  endDate: string | null;
  link: string;
  description: string[];
  tags: string[];
}

export const works: WorkItem[] = [
  {
    company: "Ariverse Studio",
    jobTitle: "Game Developer",
    status: ["REMOTE", "PART TIME"],
    startDate: "Sep 2025",
    endDate: null,
    link: "https://www.ariversestudio.com/",
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
    company: "PT XYZ",
    jobTitle: "Full Stack Developer",
    status: ["ON-SITE", "FULL-TIME"],
    startDate: "Jan 2026",
    endDate: null,
    link: "",
    description: [
      "Building scalable backend services with Django",
      "Creating responsive frontend interfaces with React",
      "Managing PostgreSQL databases and optimization",
      "Implementing RESTful APIs and authentication systems"
    ],
    tags: [
      "Django",
      "Python",
      "React",
      "PostgreSQL"
    ]
  }
];
