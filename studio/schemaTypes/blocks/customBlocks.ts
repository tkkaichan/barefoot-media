import { defineArrayMember, defineField, defineType } from 'sanity'

/**
 * 本文中に差し込むカスタムブロック。
 * REQUIREMENTS §2-3 の post.body に列挙された5種＋図版。
 */

/** 比較表（shoe参照の配列から自動生成・LLMO H1/H3）。 */
export const comparisonTable = defineType({
  name: 'comparisonTable',
  title: '比較表（DBから生成）',
  type: 'object',
  fields: [
    defineField({
      name: 'caption',
      title: '表のキャプション',
      type: 'string',
      description: '<caption> に出る。何を比べた表かを1文で',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'shoes',
      title: '比較するモデル',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'shoe' }] })],
      validation: (Rule) => Rule.required().min(2),
    }),
    defineField({
      name: 'columns',
      title: '表示する列',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: '価格', value: 'priceJpy' },
          { title: '実測重量', value: 'weightG' },
          { title: '実測ソール厚', value: 'soleThicknessMm' },
          { title: 'ドロップ', value: 'dropMm' },
          { title: 'トゥボックス幅', value: 'toeboxWidthMm' },
          { title: '防水性', value: 'waterproof' },
          { title: '慣らし難易度', value: 'transitionDifficulty' },
          { title: 'ミニマリストインデックス', value: 'miScore' },
          { title: '雨天グリップ', value: 'wetGripScore' },
          { title: '浸水時間', value: 'waterIntrusionMin' },
          { title: '総合評価', value: 'overall' },
        ],
      },
      initialValue: ['priceJpy', 'weightG', 'soleThicknessMm', 'dropMm', 'waterproof', 'transitionDifficulty'],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'layout',
      title: '形式',
      type: 'string',
      options: {
        list: [
          { title: 'スペック比較表（H1）', value: 'spec' },
          { title: 'シーン別マトリクス ◎○△×（H3）', value: 'sceneMatrix' },
        ],
        layout: 'radio',
      },
      initialValue: 'spec',
    }),
  ],
  preview: {
    select: { title: 'caption', layout: 'layout' },
    prepare: ({ title, layout }) => ({
      title: title || '比較表',
      subtitle: layout === 'sceneMatrix' ? 'シーン別マトリクス' : 'スペック比較表',
    }),
  },
})

/** テスト条件ブロック（LLMO R2）。記事冒頭の4項目ストリップ。 */
export const testConditionBlock = defineType({
  name: 'testConditionBlock',
  title: 'テスト条件（R2）',
  type: 'object',
  description: 'テスト条件を明示する枠。テストポリシーページへのリンクが自動で付く',
  fields: [
    defineField({
      name: 'shoe',
      title: '対象モデル',
      type: 'reference',
      to: [{ type: 'shoe' }],
      description: '指定するとテスト値をDBから自動表示する（手入力より優先）',
    }),
    defineField({
      name: 'items',
      title: '手動で表示する項目',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'condItem',
          fields: [
            defineField({ name: 'label', title: '英字ラベル', type: 'string' }),
            defineField({ name: 'value', title: '値', type: 'string' }),
          ],
          preview: { select: { title: 'label', subtitle: 'value' } },
        }),
      ],
      description: 'モデル未指定のとき、または上書きしたいときだけ入力する',
    }),
  ],
  preview: {
    select: { shoe: 'shoe.name' },
    prepare: ({ shoe }) => ({ title: 'テスト条件', subtitle: shoe || '手動入力' }),
  },
})

/** 主張×根拠レベル表（LLMO D3）。 */
export const claimEvidenceTable = defineType({
  name: 'claimEvidenceTable',
  title: '主張×根拠レベル表（D3）',
  type: 'object',
  fields: [
    defineField({
      name: 'caption',
      title: 'キャプション',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'rows',
      title: '行',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'claimRow',
          fields: [
            defineField({ name: 'claim', title: '主張', type: 'string', validation: (R) => R.required() }),
            defineField({
              name: 'evidenceLevel',
              title: '根拠レベル',
              type: 'string',
              options: {
                list: [
                  { title: 'RCT・メタ分析', value: 'rct' },
                  { title: '観察研究', value: 'observational' },
                  { title: '専門家見解', value: 'expert' },
                  { title: '当サイトの実測', value: 'ownMeasurement' },
                  { title: '個人の体験', value: 'anecdote' },
                  { title: '根拠不十分', value: 'insufficient' },
                ],
              },
              validation: (R) => R.required(),
            }),
            defineField({ name: 'note', title: '補足・出典', type: 'text', rows: 2 }),
            defineField({ name: 'sourceUrl', title: '出典URL', type: 'url' }),
          ],
          preview: { select: { title: 'claim', subtitle: 'evidenceLevel' } },
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: { title: 'caption' },
    prepare: ({ title }) => ({ title: title || '主張×根拠レベル表', subtitle: 'D3' }),
  },
})

/** エビデンステーブル（LLMO M5・健康系記事の出典一覧）。 */
export const evidenceTable = defineType({
  name: 'evidenceTable',
  title: 'エビデンステーブル（M5）',
  type: 'object',
  fields: [
    defineField({
      name: 'caption',
      title: 'キャプション',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'rows',
      title: '行',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'evidenceRow',
          fields: [
            defineField({ name: 'finding', title: 'わかっていること', type: 'text', rows: 2, validation: (R) => R.required() }),
            defineField({ name: 'studyType', title: '研究デザイン', type: 'string' }),
            defineField({ name: 'sampleSize', title: '対象数', type: 'string' }),
            defineField({ name: 'year', title: '発表年', type: 'string' }),
            defineField({ name: 'source', title: '出典（誌名・著者）', type: 'string', validation: (R) => R.required() }),
            defineField({ name: 'sourceUrl', title: '出典URL', type: 'url' }),
          ],
          preview: { select: { title: 'finding', subtitle: 'source' } },
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: { title: 'caption' },
    prepare: ({ title }) => ({ title: title || 'エビデンステーブル', subtitle: 'M5' }),
  },
})

/** 記事中のメール登録CTA（反転ブロック）。 */
export const ctaBlock = defineType({
  name: 'ctaBlock',
  title: 'CTA（メール登録）',
  type: 'object',
  fields: [
    defineField({
      name: 'leadMagnet',
      title: 'リードマグネット',
      type: 'string',
      options: {
        list: [
          { title: '記事の設定を継承', value: 'inherit' },
          { title: 'LM1: 移行30日カレンダー', value: 'LM1' },
          { title: 'LM2: 足指トレーニング', value: 'LM2' },
        ],
        layout: 'radio',
      },
      initialValue: 'inherit',
    }),
    defineField({
      name: 'headline',
      title: '見出し',
      type: 'string',
      description: '空なら siteSettings の既定文言を使う',
    }),
  ],
  preview: {
    select: { subtitle: 'leadMagnet', title: 'headline' },
    prepare: ({ title, subtitle }) => ({ title: title || 'メール登録CTA', subtitle }),
  },
})

/** 購入ボタン枠（記事内のアフィリエイトブロック）。 */
export const buyBlock = defineType({
  name: 'buyBlock',
  title: '購入ボタン枠',
  type: 'object',
  fields: [
    defineField({
      name: 'shoe',
      title: 'モデル',
      type: 'reference',
      to: [{ type: 'shoe' }],
      description: '価格・リンクはDBから引く。価格の取得日も自動表示される',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: 'shoe.name' },
    prepare: ({ title }) => ({ title: title || '（モデル未選択）', subtitle: '購入ボタン枠' }),
  },
})

/** 引用（フィールドノートからの実ログ引用枠）。 */
export const fieldNoteQuote = defineType({
  name: 'fieldNoteQuote',
  title: 'フィールドノート引用',
  type: 'object',
  fields: [
    defineField({
      name: 'text',
      title: '引用文',
      type: 'text',
      rows: 4,
      description: '運営者の実ログからそのまま引く。創作しないこと',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'source',
      title: '出典',
      type: 'string',
      description: '例: フィールドノート 2026.07.26',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: { select: { title: 'text', subtitle: 'source' } },
})

/** 汎用の2列テーブル（運営者概要など・固定ページ用）。 */
export const infoTable = defineType({
  name: 'infoTable',
  title: '項目テーブル（2列）',
  type: 'object',
  fields: [
    defineField({ name: 'caption', title: 'キャプション', type: 'string' }),
    defineField({
      name: 'rows',
      title: '行',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'infoRow',
          fields: [
            defineField({ name: 'label', title: '項目', type: 'string', validation: (R) => R.required() }),
            defineField({ name: 'value', title: '内容', type: 'text', rows: 2, validation: (R) => R.required() }),
          ],
          preview: { select: { title: 'label', subtitle: 'value' } },
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: { title: 'caption' },
    prepare: ({ title }) => ({ title: title || '項目テーブル' }),
  },
})

/** 実測スペック表（1モデル・DBから生成）。 */
export const specTable = defineType({
  name: 'specTable',
  title: '実測スペック表（1モデル）',
  type: 'object',
  fields: [
    defineField({
      name: 'shoe',
      title: 'モデル',
      type: 'reference',
      to: [{ type: 'shoe' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'showOfficial',
      title: '公称値も併記する',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: { title: 'shoe.name' },
    prepare: ({ title }) => ({ title: title || '（モデル未選択）', subtitle: '実測スペック表' }),
  },
})
