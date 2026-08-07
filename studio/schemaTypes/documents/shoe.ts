import { defineArrayMember, defineField, defineType } from 'sanity'
import {
  SCENES,
  SHOE_CATEGORIES,
  SHOE_STATUS,
  TRANSITION_DIFFICULTY,
} from '../../lib/constants'

/**
 * シューズDBの中核ドキュメント。
 * 記事に書く実測値・比較表・Product/Review 構造化データは
 * すべてこのドキュメントを唯一の出所とする（REQUIREMENTS §2）。
 */
export const shoe = defineType({
  name: 'shoe',
  title: 'シューズ（モデル）',
  type: 'document',
  groups: [
    { name: 'basic', title: '基本', default: true },
    { name: 'spec', title: 'スペック' },
    { name: 'test', title: '畑テスト' },
    { name: 'commerce', title: '価格・リンク' },
    { name: 'rnd', title: '製品開発メモ' },
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'モデル名',
      type: 'string',
      group: 'basic',
      description: '例: Vapor Glove 6',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'nameJa',
      title: 'カナ表記',
      type: 'string',
      group: 'basic',
      description: '例: ベイパーグローブ6',
    }),
    defineField({
      name: 'slug',
      title: 'スラッグ',
      type: 'slug',
      group: 'basic',
      options: { source: 'name', maxLength: 64 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'brand',
      title: 'ブランド',
      type: 'reference',
      group: 'basic',
      to: [{ type: 'brand' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: '分類',
      type: 'string',
      group: 'basic',
      options: { list: [...SHOE_CATEGORIES] },
      description: '定義柱記事のD1表と連動',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'status',
      title: 'ステータス',
      type: 'string',
      group: 'basic',
      options: { list: [...SHOE_STATUS], layout: 'radio', direction: 'horizontal' },
      initialValue: 'testing',
      description: 'published のモデルだけがサイトに出る',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'summary',
      title: '一行まとめ',
      type: 'text',
      rows: 2,
      group: 'basic',
      description: '一覧・比較表の説明列に出る。数値を1つ以上入れる',
      validation: (Rule) => Rule.max(120).warning('120字以内'),
    }),
    defineField({
      name: 'imageMain',
      title: '主画像',
      type: 'image',
      group: 'basic',
      options: { hotspot: true },
      description: '自前撮影が原則',
      fields: [
        defineField({
          name: 'alt',
          title: '代替テキスト',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({ name: 'shotAt', title: '撮影日', type: 'date', options: { dateFormat: 'YYYY-MM-DD' } }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'images',
      title: '追加画像',
      type: 'array',
      group: 'basic',
      of: [defineArrayMember({ type: 'datedImage' })],
      description: '摩耗経過写真など。撮影日をキャプションに出す',
    }),

    // --- スペック ---
    defineField({ name: 'specOfficial', title: '公称スペック', type: 'specOfficial', group: 'spec' }),
    defineField({ name: 'specMeasured', title: '実測スペック', type: 'specMeasured', group: 'spec' }),
    defineField({
      name: 'miScore',
      title: 'ミニマリストインデックス（0〜100）',
      type: 'number',
      group: 'spec',
      description: 'The Running Clinic 基準（LLMO H5）',
      validation: (Rule) => Rule.min(0).max(100),
    }),
    defineField({
      name: 'transitionDifficulty',
      title: '慣らし難易度',
      type: 'string',
      group: 'spec',
      options: { list: [...TRANSITION_DIFFICULTY], layout: 'radio', direction: 'horizontal' },
      description: 'H1比較表の列',
    }),

    // --- 畑テスト ---
    defineField({ name: 'fieldTest', title: '畑テスト計測値', type: 'fieldTest', group: 'test' }),
    defineField({ name: 'ratings', title: '評価（5軸）', type: 'ratings', group: 'test' }),
    defineField({
      name: 'recommendedScenes',
      title: '適したシーン',
      type: 'array',
      group: 'test',
      of: [{ type: 'string' }],
      options: { list: [...SCENES] },
    }),
    defineField({
      name: 'sceneMatrix',
      title: 'シーン別マトリクス（◎○△×）',
      type: 'array',
      group: 'test',
      of: [defineArrayMember({ type: 'sceneFit' })],
      description: 'H3マトリクスの生成元。適したシーンより優先して使われる',
    }),
    defineField({
      name: 'pros',
      title: '良かった点',
      type: 'array',
      group: 'test',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'cons',
      title: '合わなかった点',
      type: 'array',
      group: 'test',
      of: [{ type: 'string' }],
      description: '空のまま公開しない。欠点を書かないレビューは信頼を落とす',
    }),

    // --- 価格・リンク ---
    defineField({
      name: 'priceJpy',
      title: '参考価格（円・税込）',
      type: 'number',
      group: 'commerce',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'priceCheckedAt',
      title: '価格の取得日',
      type: 'date',
      group: 'commerce',
      options: { dateFormat: 'YYYY-MM-DD' },
      description: 'C7。「2026.08時点」として表示される',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'priceNote',
      title: '価格の注記',
      type: 'string',
      group: 'commerce',
      description: '変動・セール等の但し書き',
    }),
    defineField({ name: 'affiliate', title: 'アフィリエイト', type: 'affiliate', group: 'commerce' }),
    defineField({
      name: 'isProvided',
      title: 'メーカー提供品',
      type: 'boolean',
      group: 'commerce',
      description: 'ステマ規制対応。ONにすると記事とDB詳細に「提供品」表記が自動で出る',
      initialValue: false,
    }),

    // --- 参照 ---
    defineField({
      name: 'reviewArticle',
      title: '単体レビュー記事',
      type: 'reference',
      group: 'basic',
      to: [{ type: 'post' }],
      description: '比較⇔レビューのハブ構造（H6）',
    }),

    // --- 製品開発 ---
    defineField({
      name: 'missingRequirements',
      title: '欠落要件（製品開発R&D）',
      type: 'array',
      group: 'rnd',
      of: [defineArrayMember({ type: 'missingRequirement' })],
      description: 'STRATEGY 7-2。市販品が満たせなかった要件を蓄積する',
    }),
  ],
  orderings: [
    { title: '更新が新しい順', name: 'updatedDesc', by: [{ field: '_updatedAt', direction: 'desc' }] },
    { title: '価格が安い順', name: 'priceAsc', by: [{ field: 'priceJpy', direction: 'asc' }] },
  ],
  preview: {
    select: {
      name: 'name',
      brand: 'brand.name',
      status: 'status',
      media: 'imageMain',
      price: 'priceJpy',
    },
    prepare: ({ name, brand, status, media, price }) => {
      const statusLabel =
        SHOE_STATUS.find((s) => s.value === status)?.title ?? status ?? '—'
      return {
        title: [brand, name].filter(Boolean).join(' '),
        subtitle: `${statusLabel}${price ? ` / ¥${price.toLocaleString('ja-JP')}` : ''}`,
        media,
      }
    },
  },
})
