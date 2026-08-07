import { defineField, defineType } from 'sanity'

/**
 * 固定ページ（プライバシー・免責・運営者情報・テストポリシー・LP・完了ページ）。
 * モックの page-privacy / page-company の型（番号付き明朝見出し＋上罫線）で描画する。
 * ※固定ページにパンくずは付けない（IMPLEMENTATION-HANDOFF）。
 */
export const page = defineType({
  name: 'page',
  title: '固定ページ',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'タイトル',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'スラッグ',
      type: 'slug',
      options: { maxLength: 80 },
      description:
        'URL: /<slug>/。既定のルーティング: privacy / disclaimer / about / test-policy / thanks / lp/transition-30days / lp/toe-training',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'labelEn',
      title: '英字ラベル',
      type: 'string',
      description: 'ページ見出しの上に出る mono ラベル（例: PRIVACY POLICY / ABOUT US）',
      validation: (Rule) => Rule.required().uppercase(),
    }),
    defineField({
      name: 'template',
      title: 'テンプレート',
      type: 'string',
      options: {
        list: [
          { title: '標準（番号付き見出しの1カラム）', value: 'doc' },
          { title: '運営者情報（プロフィールカード付き）', value: 'about' },
          { title: 'テストポリシー（全面写真ヒーロー可）', value: 'testPolicy' },
          { title: 'リードマグネットLP', value: 'lp' },
        ],
      },
      initialValue: 'doc',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'lead',
      title: 'リード文',
      type: 'text',
      rows: 2,
      description: 'ページ見出しの下に出る補足（任意）',
    }),
    defineField({
      name: 'effectiveNote',
      title: '制定日・改定日の表記',
      type: 'string',
      description: '例: 制定日: 2026.09.01 ／ 最終改定: 2026.09.01（ポリシー系のみ）',
    }),
    defineField({
      name: 'heroImage',
      title: '全面写真ヒーロー',
      type: 'image',
      options: { hotspot: true },
      description: 'テストポリシーのみ使用可。他のページでは無視される',
      hidden: ({ parent }) => parent?.template !== 'testPolicy',
      fields: [
        defineField({ name: 'alt', title: '代替テキスト', type: 'string' }),
      ],
    }),
    defineField({
      name: 'leadMagnet',
      title: '配布するリードマグネット',
      type: 'string',
      options: {
        list: [
          { title: 'LM1: 移行30日カレンダー', value: 'LM1' },
          { title: 'LM2: 足指トレーニング', value: 'LM2' },
        ],
        layout: 'radio',
      },
      hidden: ({ parent }) => parent?.template !== 'lp',
    }),
    defineField({
      name: 'body',
      title: '本文',
      type: 'blockContent',
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'seo', title: 'SEO・OGP', type: 'seo' }),
    defineField({
      name: 'updatedAt',
      title: '更新日時',
      type: 'datetime',
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'slug.current' },
    prepare: ({ title, subtitle }) => ({ title, subtitle: subtitle ? `/${subtitle}/` : '未設定' }),
  },
})
