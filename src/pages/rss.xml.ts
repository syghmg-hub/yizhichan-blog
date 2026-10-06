import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { marked } from 'marked';
import { siteConfig } from '../config';

export async function GET(context) {
  const posts = (await getCollection('posts', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime()
  );

  return rss({
    title: siteConfig.title,
    description: siteConfig.description,
    site: context.site,
    items: await Promise.all(
      posts.map(async (post) => ({
        title: post.data.title,
        description: post.data.description,
        pubDate: post.data.date,
        link: `/posts/${post.id}/`,
        categories: [post.data.category, ...post.data.tags],
        // 全文转HTML放进 content 字段，阅读器里可直接读完，不用点进网站
        content: `<p>${marked.parse(post.body ?? '')}</p>`,
      }))
    ),
    customData: `<language>zh-CN</language>`,
  });
}