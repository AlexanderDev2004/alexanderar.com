export interface FileItem {
  id: string;
  title: string;
  description: string;
  fileUrl: string;
  buttonLabel: string;
}

export const files: FileItem[] = [
  {
    id: 'resume',
    title: 'Resume',
    description: 'View and download my resume by clicking on the button below',
    fileUrl: '/cv_porto/Alexander%20Agung%20Raya%20-%20Software%20Developer1%20-%20Resume.pdf',
    buttonLabel: 'Download resume',
  },
  {
    id: 'portfolio',
    title: 'Portfolio',
    description: 'View and download my portfolio by clicking on the button below',
    fileUrl: '/cv_porto/AlexanderAgungRaya_Portfolio.pdf',
    buttonLabel: 'Download portfolio',
  },
];
