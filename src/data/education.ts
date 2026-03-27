export interface EducationItem {
  degree: string;
  institution: string;
  startDate: string;
  endDate: string | null;
  gpa?: string;
  relevantCoursework?: string[];
  skills?: string[];
}

export const education: EducationItem[] = [
  {
    degree: "Diploma 4 Informatics Engineering",
    institution: "Information Technology, Malang State Polytechnic",
    startDate: "2023",
    endDate: null,
    gpa: "3.51 / 4.00",
    relevantCoursework: [
      "Data Structures",
      "Algorithms",
      "Database Systems",
      "Software Engineering",
      "Computer Networks",
      "Operating Systems",
      "Artificial Intelligence",
      "Machine Learning"
    ],
    skills: [
      "Team Communication",
      "Good Project Management",
      "Collaborative Problem Solving",
    ]
  }
];
