import { z, defineCollection } from 'astro:content';

const workCollection = defineCollection({
  type: 'data',
  schema: z.object({
    works: z.array(z.object({
      company: z.string(),
      jobTitle: z.string(),
      status: z.array(z.string()),
      startDate: z.string(),
      endDate: z.string().nullable(),
      link: z.string().url().optional().or(z.literal("")),
      description: z.array(z.string()),
      tags: z.array(z.string()),
    })),
  }),
});

const blogsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    description: z.string(),
    tags: z.array(z.string()),
  }),
});

const projectsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    year: z.string(),
    description: z.string(),
    fullDescription: z.string(),
    image: z.string().optional().or(z.literal('')),
    projectLink: z.string().optional().or(z.literal('')),
    repoLink: z.string().optional().or(z.literal('')),
    technologies: z.array(
      z.object({
        name: z.string(),
        icon: z.string(),
        docLink: z.string(),
      })
    ),
  }),
});

export const collections = {
  work: workCollection,
  blogs: blogsCollection,
  projects: projectsCollection,
};
