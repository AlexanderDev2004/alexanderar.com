export interface ContactItem {
  id: string;
  label: string;
  icon: string;
  href: string;
}

export const contacts: ContactItem[] = [
  {
    id: 'email',
    label: 'Email',
    icon: 'mdi:email-outline',
    href: 'https://mail.google.com/mail/?view=cm&fs=1&to=alexanderagungraya08@gmail.com',
  },
  {
    id: 'github',
    label: 'Github',
    icon: 'mdi:github',
    href: 'https://github.com/AlexanderDev2004',
  },
  {
    id: 'linkedin',
    label: 'Linkedin',
    icon: 'mdi:linkedin',
    href: 'https://www.linkedin.com/in/alexanderagungraya/',
  },
  {
    id: 'X',
    label: 'X',
    icon: 'ri:twitter-x-line',
    href: '/',
  }
];
