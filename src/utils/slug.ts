import { pinyin } from 'pinyin-pro';

export const toSlug = (text: string) =>
  pinyin(text, { toneType: 'none', type: 'array', nonZh: 'consecutive' })
    .join('-')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

export const tagPath = (tag: string) => `/tags/${toSlug(tag)}/`;
