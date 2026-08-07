// @ts-check
import sitemap from '@astrojs/sitemap'
import { defineConfig } from 'astro/config'

const SITE_URL = process.env.PUBLIC_SITE_URL || 'http://localhost:4321'

export default defineConfig({
  site: SITE_URL,
  output: 'static',
  trailingSlash: 'always',

  integrations: [
    sitemap({
      filter: (page) =>
        // サンクスページと下書きプレビューは sitemap から外す
        !page.includes('/thanks/') && !page.includes('/preview/'),
      serialize(item) {
        if (item.url === `${SITE_URL}/`) item.priority = 1.0
        return item
      },
    }),
  ],

  image: {
    // 画像は Sanity Image CDN 側でリサイズ・WebP/AVIF 変換する（REQUIREMENTS §1）
    domains: ['cdn.sanity.io'],
  },

  build: {
    // CSS を1ファイルに寄せて往復を減らす（トークンは全ページ共通のため）
    inlineStylesheets: 'auto',
  },
})

// Vercel の Web Analytics / ISR を使うなら @astrojs/vercel を追加して
//   adapter: vercel({ webAnalytics: { enabled: true } })
// を足す。静的出力のままなら Vercel 側の自動検出だけでデプロイできる。
