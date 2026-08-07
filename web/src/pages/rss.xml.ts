import rss from '@astrojs/rss'
import type { APIRoute } from 'astro'
import { getAllPosts, getSiteSettings } from '../lib/queries'

export const GET: APIRoute = async (context) => {
  const [site, posts] = await Promise.all([getSiteSettings(), getAllPosts()])

  return rss({
    title: site.siteName,
    description: site.description,
    site: context.site ?? site.url,
    trailingSlash: true,
    items: posts.map((post) => ({
      title: post.title,
      description: post.leadDefinition ?? '',
      pubDate: new Date(post.publishedAt),
      link: `/articles/${post.slug}/`,
      categories: post.category ? [post.category.title] : undefined,
    })),
    customData: '<language>ja</language>',
  })
}
