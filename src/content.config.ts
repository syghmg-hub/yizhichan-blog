import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { toSlug } from './utils/slug';

/** 栏目定义：改这里即可同时影响 schema 校验、首页筛选器、后台可选值 */
export const CATEGORIES = [
  { value: '随笔', label: '随笔' },
  { value: '项目经验', label: '项目经验' },
] as const;

const posts = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/posts',
    generateId: ({ data, entry }) => {
      // 优先用frontmatter 里显式写的 slug，其次用文件名，最后才回退到整条路径
      const explicit = (data as { slug?: string }).slug;
      const raw = explicit ?? entry.replace(/\.md$/, '');
      return toSlug(raw) || entry.replace(/\.md$/, '');
    },
  }),
  schema: z.object({
    title: z.string(),
    /** 显式网址片段。为空时自动取文件名转拼音 */
    slug: z.string().optional(),
    description: z.string().optional(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    category: z.enum(['随笔', '项目经验']),
    tags: z.array(z.string()).default([]),
    cover: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

// 相册：每张照片一个 .yml 文件，可在写作后台增删改
const photos = defineCollection({
  loader: glob({ pattern: '**/*.{yml,yaml}', base: './src/content/photos' }),
  schema: z.object({
    title: z.string(),
    date: z.string().optional(),
    image: z.string(),
    alt: z.string().optional(),
    order: z.number().optional(),
  }),
});

export const collections = { posts, photos };