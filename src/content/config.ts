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

export const collections = {
  work: workCollection,
};
