import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { toSlug } from './utils/slug';

const posts = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/posts',
    generateId: ({ data, entry }) => {
      const raw = (data as { slug?: string }).slug ?? entry.replace(/\.md$/, '');
      return toSlug(raw) || entry.replace(/\.md$/, '');
    },
  }),
  schema: z.object({
    title: z.string(),
    slug: z.string().optional(),
    description: z.string().optional(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    category: z.enum(['随笔', '技术笔记']),
    tags: z.array(z.string()).default([]),
    cover: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts };
