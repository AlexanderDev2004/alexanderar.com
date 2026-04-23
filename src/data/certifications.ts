export interface CertificationItem {
  id: string;
  title: string;
  year: string;
  description: string;
  certificateLink: string; // can be empty string
  certificateImage?: string; // path to certificate image in /public
  tags: string[];
}

export const certifications: CertificationItem[] = [
  {
    id: "MTCA-certification",
    title: "MTCA - Certified Mikrotik Academy",
    year: "2023",
    description: "Certified Mikrotik Academy",
    certificateLink: "https://mikrotik.com/training/certificates/c256554c0bbc217fe241",
    certificateImage: "Certifications/MTCNA_Mikrotik.png",
    tags: ["Mikrotik", "Networking" ]
  },
  {
    id: "SQL-Basic-certification",
    title: "SQL Basic Certification",
    year: "2024",
    description: "Certified SQL Basic from Hackerrank",
    certificateLink: "https://www.hackerrank.com/certificates/iframe/f1568de0c5e5",
    certificateImage: "Certifications/Sql_Basic.png",
    tags: ["SQL", "Hackerrank"]
  }
  
];
