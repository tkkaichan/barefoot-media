import { defineField, defineType } from 'sanity'
import { SCENES, SCENE_FITS, WATERPROOF_LEVELS } from '../../lib/constants'

/** 公称スペック（メーカー発表値）。 */
export const specOfficial = defineType({
  name: 'specOfficial',
  title: '公称スペック',
  type: 'object',
  options: { collapsible: true, collapsed: false },
  fields: [
    defineField({ name: 'weightG', title: '重量（g・片足）', type: 'number' }),
    defineField({ name: 'soleThicknessMm', title: 'ソール厚（mm）', type: 'number' }),
    defineField({ name: 'dropMm', title: 'ドロップ（mm）', type: 'number' }),
    defineField({
      name: 'waterproof',
      title: '防水性',
      type: 'string',
      options: { list: [...WATERPROOF_LEVELS], layout: 'radio' },
    }),
    defineField({
      name: 'sizesAvailable',
      title: '展開サイズ',
      type: 'string',
      description: '例: 24.0〜29.0cm（0.5cm刻み）',
    }),
    defineField({
      name: 'sourceUrl',
      title: '出典URL',
      type: 'url',
      description: '公称値をどこから取ったか。C7（出典明示）対応',
    }),
  ],
})

/** 実測値。差別化の核（LLMO H2）。 */
export const specMeasured = defineType({
  name: 'specMeasured',
  title: '実測スペック',
  type: 'object',
  options: { collapsible: true, collapsed: false },
  fields: [
    defineField({ name: 'weightG', title: '実測重量（g・片足）', type: 'number' }),
    defineField({ name: 'soleThicknessMm', title: '実測ソール厚（mm）', type: 'number' }),
    defineField({ name: 'dropMm', title: '実測ドロップ（mm）', type: 'number' }),
    defineField({ name: 'toeboxWidthMm', title: 'トゥボックス最大幅（mm）', type: 'number' }),
    defineField({
      name: 'measuredSizeCm',
      title: '実測に使ったサイズ（cm）',
      type: 'number',
      description: '実測値はサイズ依存。必ず記録すること',
    }),
    defineField({
      name: 'measuredAt',
      title: '実測日',
      type: 'date',
      options: { dateFormat: 'YYYY-MM-DD' },
      description: 'C7: 記事・DB詳細ページに必ず表示される',
    }),
    defineField({
      name: 'measuredWith',
      title: '計測器具',
      type: 'string',
      description: '例: キッチンスケール・ノギス（自前）',
    }),
  ],
  validation: (Rule) =>
    Rule.custom((value: Record<string, unknown> | undefined) => {
      if (!value) return true
      const hasNumbers = ['weightG', 'soleThicknessMm', 'dropMm', 'toeboxWidthMm'].some(
        (k) => typeof value[k] === 'number',
      )
      if (hasNumbers && !value.measuredAt) {
        return '実測値を入れたら実測日（measuredAt）も必須です（C7）'
      }
      return true
    }),
})

/** 畑テストの定型計測（LLMO H7 / STRATEGY 第5節）。 */
export const fieldTest = defineType({
  name: 'fieldTest',
  title: '畑テスト計測値',
  type: 'object',
  options: { collapsible: true, collapsed: false },
  fields: [
    defineField({
      name: 'wetGripScore',
      title: '雨天グリップ（1〜5）',
      type: 'number',
      validation: (Rule) => Rule.min(1).max(5),
    }),
    defineField({
      name: 'mudCloggingScore',
      title: '泥詰まり（1〜5・低いほど詰まる）',
      type: 'number',
      validation: (Rule) => Rule.min(1).max(5),
    }),
    defineField({
      name: 'waterIntrusionMin',
      title: '浸水までの時間（分）',
      type: 'number',
      description: '非防水は0も可',
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'soleWearNote',
      title: 'ソール摩耗の経過',
      type: 'text',
      rows: 3,
    }),
    defineField({ name: 'testDays', title: 'テスト日数', type: 'number' }),
    defineField({ name: 'testDistanceKm', title: 'テスト距離（km）', type: 'number' }),
    defineField({
      name: 'surfaceBreakdown',
      title: '路面内訳',
      type: 'string',
      description: '例: 畑60% / 砂利20% / 舗装20%',
    }),
    defineField({
      name: 'testPeriod',
      title: 'テスト期間',
      type: 'string',
      description: '例: 2026-09-01〜09-30',
    }),
    defineField({ name: 'weatherNote', title: '天候条件', type: 'string' }),
  ],
})

/** レビュー評価5軸（LLMO R4）。0.5刻み。 */
export const ratings = defineType({
  name: 'ratings',
  title: '評価（5軸）',
  type: 'object',
  options: { collapsible: true, collapsed: false },
  fields: [
    defineField({ name: 'groundFeel', title: '接地感', type: 'number', validation: (R) => R.min(0).max(5) }),
    defineField({ name: 'durability', title: '耐久性', type: 'number', validation: (R) => R.min(0).max(5) }),
    defineField({ name: 'waterResistance', title: '耐水性', type: 'number', validation: (R) => R.min(0).max(5) }),
    defineField({ name: 'easeOfTransition', title: '慣らしやすさ', type: 'number', validation: (R) => R.min(0).max(5) }),
    defineField({ name: 'costPerformance', title: 'コスパ', type: 'number', validation: (R) => R.min(0).max(5) }),
    defineField({
      name: 'overall',
      title: '総合',
      type: 'number',
      description: 'Review スキーマの reviewRating に使う',
      validation: (R) => R.min(0).max(5),
    }),
  ],
})

/** アフィリエイトリンク。 */
export const affiliate = defineType({
  name: 'affiliate',
  title: 'アフィリエイト',
  type: 'object',
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({ name: 'amazonUrl', title: 'Amazon URL', type: 'url' }),
    defineField({
      name: 'amazonCommissionNote',
      title: 'Amazon料率メモ',
      type: 'string',
      description: '8%/4%の区分・上限1,000円該当の有無',
    }),
    defineField({ name: 'rakutenUrl', title: '楽天 URL', type: 'url' }),
    defineField({ name: 'yahooUrl', title: 'Yahoo! URL', type: 'url' }),
    defineField({ name: 'officialUrl', title: '公式 URL', type: 'url' }),
    defineField({
      name: 'preferredLink',
      title: '第一リンク',
      type: 'string',
      options: {
        list: [
          { title: 'Amazon', value: 'amazon' },
          { title: '楽天', value: 'rakuten' },
          { title: '公式', value: 'official' },
        ],
        layout: 'radio',
      },
      description: '12,500円超は楽天を既定にする（affiliate-programs.md）',
      initialValue: 'amazon',
    }),
  ],
})

/** シーン適合（◎○△×マトリクス・LLMO H3）。 */
export const sceneFit = defineType({
  name: 'sceneFit',
  title: 'シーン適合',
  type: 'object',
  fields: [
    defineField({
      name: 'scene',
      title: 'シーン',
      type: 'string',
      options: { list: [...SCENES] },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'fit',
      title: '適合度',
      type: 'string',
      options: { list: [...SCENE_FITS], layout: 'radio', direction: 'horizontal' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'note', title: '補足', type: 'string' }),
  ],
  preview: {
    select: { title: 'scene', subtitle: 'fit' },
  },
})

/** 市販品の欠落要件（製品開発R&D・STRATEGY 7-2）。 */
export const missingRequirement = defineType({
  name: 'missingRequirement',
  title: '欠落要件',
  type: 'object',
  fields: [
    defineField({
      name: 'requirement',
      title: '満たせなかった要件',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'scene', title: '困るシーン', type: 'string' }),
    defineField({
      name: 'persona',
      title: '該当ペルソナ',
      type: 'string',
      options: {
        list: [
          { title: 'P1 健康志向の一般層', value: 'P1' },
          { title: 'P2 立ち仕事', value: 'P2' },
          { title: 'P3 ランナー', value: 'P3' },
          { title: 'P4 外仕事・ガーデニング', value: 'P4' },
        ],
      },
    }),
    defineField({
      name: 'severity',
      title: '深刻度（1〜3）',
      type: 'number',
      validation: (Rule) => Rule.min(1).max(3),
    }),
    defineField({ name: 'note', title: 'メモ', type: 'text', rows: 3 }),
  ],
  preview: {
    select: { title: 'requirement', subtitle: 'persona' },
  },
})

/** 撮影日つき画像（摩耗経過写真など）。 */
export const datedImage = defineType({
  name: 'datedImage',
  title: '写真（撮影日つき）',
  type: 'image',
  options: { hotspot: true },
  fields: [
    defineField({
      name: 'alt',
      title: '代替テキスト',
      type: 'string',
      description: '図解の場合は内容を完全に記述する（D4）',
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'caption', title: 'キャプション', type: 'string' }),
    defineField({
      name: 'shotAt',
      title: '撮影日',
      type: 'date',
      options: { dateFormat: 'YYYY-MM-DD' },
      description: 'C7・R5。キャプションに撮影日として表示される',
    }),
  ],
})

/** FAQ 1問（FAQPage スキーマの生成元・LLMO C4）。 */
export const faqItem = defineType({
  name: 'faqItem',
  title: 'FAQ',
  type: 'object',
  fields: [
    defineField({
      name: 'question',
      title: '質問',
      type: 'string',
      description: '検索される口語形のまま書く（例: 雨の日でも履けますか？）',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'answer',
      title: '回答',
      type: 'text',
      rows: 4,
      description: 'C4: 120〜200字で単体完結させる（引用されたときに文脈なしで成立するように）',
      validation: (Rule) =>
        Rule.required()
          .min(80)
          .warning('120字以上が目安（C4）')
          .max(260)
          .warning('200字以内が目安（C4）'),
    }),
  ],
  preview: { select: { title: 'question', subtitle: 'answer' } },
})

/** SEO / OGP。 */
export const seo = defineType({
  name: 'seo',
  title: 'SEO・OGP',
  type: 'object',
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: 'metaDescription',
      title: 'meta description',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(140).warning('120字前後が目安'),
    }),
    defineField({
      name: 'ogImage',
      title: 'OG画像',
      type: 'image',
      description: '空なら記事のメイン画像 → siteSettings の既定OG画像の順で使われる',
    }),
    defineField({
      name: 'canonicalUrl',
      title: 'canonical URL',
      type: 'url',
      description: '他サイトに一次掲載がある場合のみ',
    }),
    defineField({
      name: 'noindex',
      title: 'noindex にする',
      type: 'boolean',
      initialValue: false,
    }),
  ],
})
