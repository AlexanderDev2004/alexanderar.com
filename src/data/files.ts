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
    fileUrl: '/cv_porto/alexander-porto-ats.pdf',
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
