import { defineField, defineType } from 'sanity'

/** トップページ下部の「連載」帯（SERIES 01 / 02）とその一覧ページ。 */
export const series = defineType({
  name: 'series',
  title: '連載',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'タイトル',
      type: 'string',
      description: '例: 畑テスト — 泥・雨・砂利の30日',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'スラッグ',
      type: 'slug',
      options: { maxLength: 40 },
      description: 'URL: /series/<slug>/',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'number',
      title: '連載番号',
      type: 'number',
      description: 'カードの「SERIES 01」に出る。2桁ゼロ埋めで表示される',
      validation: (Rule) => Rule.required().integer().min(1),
    }),
    defineField({
      name: 'description',
      title: '説明文',
      type: 'text',
      rows: 2,
      validation: (Rule) => Rule.max(60).warning('カード内は1〜2行。60字以内が目安'),
    }),
    defineField({
      name: 'image',
      title: 'サムネイル（正方形）',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: '代替テキスト',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroImage',
      title: '連載トップの全面写真',
      type: 'image',
      options: { hotspot: true },
      description: '全面写真ヒーローが許可されているのは連載トップのみ',
      fields: [
        defineField({ name: 'alt', title: '代替テキスト', type: 'string' }),
      ],
    }),
    defineField({
      name: 'showOnHome',
      title: 'トップページに出す',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  orderings: [
    { title: '連載番号', name: 'numberAsc', by: [{ field: 'number', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'title', subtitle: 'number', media: 'image' },
    prepare: ({ title, subtitle, media }) => ({
      title,
      subtitle: subtitle ? `SERIES ${String(subtitle).padStart(2, '0')}` : undefined,
      media,
    }),
  },
})
