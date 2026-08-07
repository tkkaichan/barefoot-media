import { defineField, defineType } from 'sanity'

/**
 * ハブ（グローバルナビ＋ /category/[slug]/ ＋ カード左肩の mono ラベル）。
 * モックのナビ5項目（はじめての方へ / レビュー / 比較・選び方 / 足の悩み / 畑から）に対応。
 * 記事は必ず1つのハブに属する。細目は topic で持つ。
 */
export const category = defineType({
  name: 'category',
  title: 'ハブ（大カテゴリ）',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: '表示名',
      type: 'string',
      description: '例: レビュー（ナビとパンくずに出る）',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'スラッグ',
      type: 'slug',
      options: { maxLength: 40 },
      description: 'URL: /category/<slug>/',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'labelEn',
      title: '英字ラベル',
      type: 'string',
      description: 'カード左肩の mono ラベル。大文字で（例: REVIEW / GUIDE / HEALTH / FIELD）',
      validation: (Rule) =>
        Rule.required()
          .uppercase()
          .max(12)
          .warning('12文字以内。カードのラベル行が折り返します'),
    }),
    defineField({
      name: 'navTitle',
      title: 'ナビでの表示名',
      type: 'string',
      description: '空なら表示名を使う（例: 表示名「入門」／ナビ「はじめての方へ」）',
    }),
    defineField({
      name: 'description',
      title: '説明文',
      type: 'text',
      rows: 3,
      description: 'カテゴリ一覧ページのリード文・meta description に使う',
    }),
    defineField({
      name: 'showInNav',
      title: 'グローバルナビに出す',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'order',
      title: '並び順',
      type: 'number',
      description: '小さい順に並ぶ',
      initialValue: 10,
    }),
  ],
  orderings: [
    { title: '並び順', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'title', subtitle: 'labelEn' },
  },
})
