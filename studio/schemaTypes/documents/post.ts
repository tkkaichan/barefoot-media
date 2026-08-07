import { defineArrayMember, defineField, defineType } from 'sanity'
import { ARTICLE_TYPES, CONTENT_TIERS, LEAD_MAGNETS } from '../../lib/constants'

export const post = defineType({
  name: 'post',
  title: '記事',
  type: 'document',
  groups: [
    { name: 'content', title: '本文', default: true },
    { name: 'meta', title: '分類・導線' },
    { name: 'faq', title: 'FAQ' },
    { name: 'seo', title: 'SEO・公開' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'タイトル',
      type: 'string',
      group: 'content',
      validation: (Rule) =>
        Rule.required().max(60).warning('60字以内が目安（検索結果での省略を避ける）'),
    }),
    defineField({
      name: 'slug',
      title: 'スラッグ',
      type: 'slug',
      group: 'content',
      options: { source: 'title', maxLength: 80 },
      description: 'URL: /articles/<slug>/。日本語は避けて英数字ハイフンで',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'leadDefinition',
      title: '冒頭定義文',
      type: 'text',
      rows: 3,
      group: 'content',
      description:
        'C1: 80〜120字・数値を1つ以上入れる。AI検索に抜かれる前提で、これ単体で問いに答える文にする',
      validation: (Rule) =>
        Rule.required()
          .min(70)
          .warning('80字以上が目安（C1）')
          .max(140)
          .warning('120字以内が目安（C1）')
          .custom((value: string | undefined) =>
            !value || /[0-9０-９]/.test(value) ? true : '数値を1つ以上入れてください（C1）',
          ),
    }),
    defineField({
      name: 'mainImage',
      title: 'メイン画像',
      type: 'image',
      group: 'content',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: '代替テキスト',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({ name: 'caption', title: 'キャプション', type: 'string' }),
        defineField({ name: 'shotAt', title: '撮影日', type: 'date', options: { dateFormat: 'YYYY-MM-DD' } }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'body',
      title: '本文',
      type: 'blockContent',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),

    // --- 分類・導線 ---
    defineField({
      name: 'category',
      title: 'ハブ',
      type: 'reference',
      group: 'meta',
      to: [{ type: 'category' }],
      description: 'パンくず・カードラベル・カテゴリ一覧に使う',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'topics',
      title: 'トピック',
      type: 'array',
      group: 'meta',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'topic' }] })],
      description: '先頭のトピックがカードラベル右側（例: REVIEW / MERRELL）に出る',
    }),
    defineField({
      name: 'articleType',
      title: '記事タイプ',
      type: 'string',
      group: 'meta',
      options: { list: [...ARTICLE_TYPES] },
      description: 'LLMOテンプレ（D/H/R/M）との対応。テンプレの構成部品の出し分けに使う',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'contentTier',
      title: 'コンテンツ層',
      type: 'string',
      group: 'meta',
      options: { list: [...CONTENT_TIERS], layout: 'radio' },
      description: '集客8割：差別化2割の比率管理用',
      initialValue: 'traffic',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'series',
      title: '連載',
      type: 'reference',
      group: 'meta',
      to: [{ type: 'series' }],
    }),
    defineField({
      name: 'shoes',
      title: '扱うモデル',
      type: 'array',
      group: 'meta',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'shoe' }] })],
      description: 'Product / ItemList スキーマの生成元。レビュー記事は1件必須',
    }),
    defineField({
      name: 'author',
      title: '著者',
      type: 'reference',
      group: 'meta',
      to: [{ type: 'author' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'supervisor',
      title: '監修者',
      type: 'reference',
      group: 'meta',
      to: [{ type: 'author' }],
      description: '健康系記事（M2）は必須。Person 型の reviewedBy に出力される',
    }),
    defineField({
      name: 'leadMagnet',
      title: 'CTAの振り分け',
      type: 'string',
      group: 'meta',
      options: { list: [...LEAD_MAGNETS], layout: 'radio' },
      initialValue: 'LM1',
    }),
    defineField({
      name: 'relatedPosts',
      title: 'この記事の次に読む',
      type: 'array',
      group: 'meta',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'post' }] })],
      description: '記事末の導線に出る。2本が基本（design-brief 9節）',
      validation: (Rule) => Rule.max(4).warning('4本まで。多いと選べなくなる'),
    }),

    // --- FAQ ---
    defineField({
      name: 'faq',
      title: 'FAQ',
      type: 'array',
      group: 'faq',
      of: [defineArrayMember({ type: 'faqItem' })],
      description: 'C4: 最低5問。健康系は7問以上。FAQPage スキーマの生成元',
    }),

    // --- SEO・公開 ---
    defineField({
      name: 'publishedAt',
      title: '公開日時',
      type: 'datetime',
      group: 'seo',
      validation: (Rule) => Rule.required(),
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'updatedAt',
      title: '更新日時',
      type: 'datetime',
      group: 'seo',
      description: '実質的な加筆修正をしたときだけ更新する（dateModified に出力）',
    }),
    defineField({
      name: 'isPickup',
      title: 'トップのPICKUPに出す',
      type: 'boolean',
      group: 'seo',
      description: '2枚まで。3枚以上ONにすると新しい2件が使われる',
      initialValue: false,
    }),
    defineField({ name: 'seo', title: 'SEO・OGP', type: 'seo', group: 'seo' }),
  ],
  orderings: [
    { title: '公開日が新しい順', name: 'publishedDesc', by: [{ field: 'publishedAt', direction: 'desc' }] },
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category.labelEn',
      date: 'publishedAt',
      media: 'mainImage',
      tier: 'contentTier',
    },
    prepare: ({ title, category, date, media, tier }) => ({
      title,
      subtitle: [
        category,
        date ? new Date(date).toLocaleDateString('ja-JP') : '未設定',
        tier === 'differentiation' ? '差別化' : '集客',
      ]
        .filter(Boolean)
        .join(' / '),
      media,
    }),
  },
  validation: (Rule) =>
    Rule.custom((doc: Record<string, any> | undefined) => {
      if (!doc) return true
      if (doc.articleType === 'health' && !doc.supervisor) {
        return { message: '健康系記事には監修者が必要です（M2）', level: 'warning' } as any
      }
      if (doc.articleType === 'review' && (!doc.shoes || doc.shoes.length === 0)) {
        return 'レビュー記事には扱うモデルの指定が必要です（Product/Review スキーマの生成元）'
      }
      const faqMin = doc.articleType === 'health' ? 7 : 5
      if (Array.isArray(doc.faq) && doc.faq.length > 0 && doc.faq.length < faqMin) {
        return { message: `FAQは${faqMin}問以上が目安です（C4）`, level: 'warning' } as any
      }
      return true
    }),
})
