import type { APIRoute } from 'astro'
import {
  getAllCategories,
  getAllPosts,
  getAllShoes,
  getSiteSettings,
} from '../lib/queries'

/**
 * llms.txt — AI クローラー向けのサイト概要（LLMOの実験的施策・REQUIREMENTS §3 #12）。
 * 「何が一次情報なのか」「どの数字を自分で測っているのか」を先頭で明示する。
 */
export const GET: APIRoute = async () => {
  const [site, categories, posts, shoes] = await Promise.all([
    getSiteSettings(),
    getAllCategories(),
    getAllPosts(),
    getAllShoes(),
  ])

  const base = site.url.replace(/\/$/, '')
  const author = site.primaryAuthor

  const lines: string[] = [
    `# ${site.siteName}`,
    '',
    `> ${site.description}`,
    '',
    '## このサイトの一次情報',
    '',
    site.testPolicySummary,
    '',
    'すべてのモデルについて、以下を自分で計測しています（メーカー公称値ではありません）:',
    '- 片足重量（g）／ソール厚（mm）／ドロップ（mm）／トゥボックス最大幅（mm）',
    '- 雨天グリップ（5段階）／泥詰まり（5段階）／浸水までの時間（分）／ソール摩耗の経過',
    '',
    author ? `執筆・計測: ${author.name}${author.credentials ? `（${author.credentials}）` : ''}` : '',
    '',
    '## 主要ページ',
    '',
    `- [記事一覧](${base}/articles/)`,
    `- [シューズDB（実測スペック一覧）](${base}/shoes/)`,
    `- [比較表](${base}/compare/)`,
    `- [運営者情報](${base}/about/)`,
    '',
    '## カテゴリ',
    '',
    ...categories.map(
      (c) => `- [${c.title}](${base}/category/${c.slug}/)${c.description ? `: ${c.description}` : ''}`,
    ),
    '',
    '## シューズDB',
    '',
    ...shoes.map((s) => {
      const name = [s.brand?.name, s.name].filter(Boolean).join(' ')
      const facts = [
        typeof s.specMeasured?.weightG === 'number' ? `実測重量${s.specMeasured.weightG}g` : null,
        typeof s.specMeasured?.soleThicknessMm === 'number'
          ? `ソール厚${s.specMeasured.soleThicknessMm}mm`
          : null,
        typeof s.fieldTest?.waterIntrusionMin === 'number'
          ? `浸水${s.fieldTest.waterIntrusionMin}分`
          : null,
      ].filter(Boolean)
      return `- [${name}](${base}/shoes/${s.slug}/)${facts.length ? `: ${facts.join(' / ')}` : ''}`
    }),
    '',
    '## 記事',
    '',
    ...posts.map(
      (p) => `- [${p.title}](${base}/articles/${p.slug}/)${p.leadDefinition ? `: ${p.leadDefinition}` : ''}`,
    ),
    '',
  ]

  return new Response(lines.filter((l) => l !== undefined).join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
