import { defineField, defineType } from 'sanity'

/**
 * 細目タグ。サイドバーのカテゴリチップと、カードラベルの右側
 *（「REVIEW / MERRELL」「HEALTH / 外反母趾」の後半）に使う。
 */
export const topic = defineType({
  name: 'topic',
  title: 'トピック（チップ）',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: '表示名',
      type: 'string',
      description: '例: 外反母趾 / 足底筋膜炎 / MERRELL',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'スラッグ',
      type: 'slug',
      options: { source: 'title', maxLength: 40 },
      description: 'URL: /topic/<slug>/',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'labelShort',
      title: 'カードラベル用の短縮表記',
      type: 'string',
      description: '空なら表示名を使う。ブランド名は大文字英字が望ましい（例: MERRELL）',
    }),
    defineField({
      name: 'description',
      title: '説明文',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'showInSidebar',
      title: 'サイドバーのチップに出す',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({ name: 'order', title: '並び順', type: 'number', initialValue: 10 }),
  ],
  orderings: [
    { title: '並び順', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
  ],
  preview: { select: { title: 'title', subtitle: 'labelShort' } },
})
