import { defineArrayMember, defineField, defineType } from 'sanity'

/**
 * 記事本文（Portable Text）。
 *
 * 見出しは h2 / h3 のみ。h1 は記事タイトルが占めるので使わせない。
 * h2 は Astro 側で mono の連番（01, 02...）と上罫線が自動で付く（モック準拠）。
 */
export const blockContent = defineType({
  name: 'blockContent',
  title: '本文',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        { title: '本文', value: 'normal' },
        { title: 'リード（冒頭の一段落）', value: 'lead' },
        { title: '見出し2', value: 'h2' },
        { title: '見出し3', value: 'h3' },
        { title: '引用', value: 'blockquote' },
      ],
      lists: [
        { title: '箇条書き', value: 'bullet' },
        { title: '番号付き', value: 'number' },
      ],
      marks: {
        decorators: [
          { title: '太字', value: 'strong' },
          { title: '斜体', value: 'em' },
          { title: 'コード', value: 'code' },
        ],
        annotations: [
          defineArrayMember({
            name: 'link',
            title: 'リンク',
            type: 'object',
            fields: [
              defineField({
                name: 'href',
                title: 'URL',
                type: 'url',
                validation: (Rule) =>
                  Rule.required().uri({ scheme: ['http', 'https', 'mailto'], allowRelative: true }),
              }),
              defineField({
                name: 'isAffiliate',
                title: 'アフィリエイトリンク',
                type: 'boolean',
                description: 'rel="sponsored nofollow" と計測イベントが自動で付く',
                initialValue: false,
              }),
            ],
          }),
          defineArrayMember({
            name: 'internalLink',
            title: '内部リンク（記事・モデル）',
            type: 'object',
            fields: [
              defineField({
                name: 'reference',
                title: 'リンク先',
                type: 'reference',
                to: [{ type: 'post' }, { type: 'shoe' }],
                validation: (Rule) => Rule.required(),
              }),
            ],
          }),
        ],
      },
    }),

    // 図版
    defineArrayMember({
      type: 'image',
      name: 'figure',
      title: '写真・図版',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: '代替テキスト',
          type: 'string',
          description: '図解は内容を完全に記述する（D4）',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'caption',
          title: 'キャプション',
          type: 'string',
          description: '載せてよいのは出典・実測値・操作ラベルのみ（雰囲気キャプション禁止）',
        }),
        defineField({
          name: 'shotAt',
          title: '撮影日',
          type: 'date',
          options: { dateFormat: 'YYYY-MM-DD' },
        }),
      ],
    }),

    // カスタムブロック
    defineArrayMember({ type: 'specTable' }),
    defineArrayMember({ type: 'comparisonTable' }),
    defineArrayMember({ type: 'testConditionBlock' }),
    defineArrayMember({ type: 'claimEvidenceTable' }),
    defineArrayMember({ type: 'evidenceTable' }),
    defineArrayMember({ type: 'fieldNoteQuote' }),
    defineArrayMember({ type: 'infoTable' }),
    defineArrayMember({ type: 'buyBlock' }),
    defineArrayMember({ type: 'ctaBlock' }),
  ],
})
