import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import expressiveCode from 'astro-expressive-code';

export default defineConfig({
  site: 'https://yizhichan-blog.vercel.app',
  integrations: [sitemap(), expressiveCode()],
});
