import { defineArrayMember, defineField, defineType } from 'sanity'

/** シングルトン。トップページのヒーローと手動キュレーション枠。 */
export const homepage = defineType({
  name: 'homepage',
  title: 'トップページ',
  type: 'document',
  groups: [
    { name: 'hero', title: 'ヒーロー', default: true },
    { name: 'curation', title: 'キュレーション' },
  ],
  fields: [
    defineField({
      name: 'heroEyebrow',
      title: 'eyebrow（mono英字）',
      type: 'string',
      group: 'hero',
      initialValue: 'Kumamoto, Yamaga — Field-tested',
    }),
    defineField({
      name: 'heroHeadline',
      title: '見出し',
      type: 'text',
      rows: 2,
      group: 'hero',
      description: '改行位置がそのまま反映される。意味の切れ目（読点）で改行すること',
      initialValue: '裸足の感覚は、\n畑で確かめてからすすめます。',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroLead',
      title: 'リード文',
      type: 'text',
      rows: 3,
      group: 'hero',
      initialValue:
        '熊本・山鹿の農家が、泥・雨・砂利・長時間の立ち仕事のなかでベアフットシューズを履き込んでから書く専門メディアです。',
      validation: (Rule) => Rule.required().max(120).warning('100字以内が目安'),
    }),
    defineField({
      name: 'heroCtaLabel',
      title: 'CTAの文言',
      type: 'string',
      group: 'hero',
      initialValue: 'はじめてのベアフット入門',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroCtaHref',
      title: 'CTAのリンク先',
      type: 'string',
      group: 'hero',
      initialValue: '/guide/',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroImage',
      title: 'ヒーロー写真（4:3）',
      type: 'image',
      group: 'hero',
      options: { hotspot: true },
      description: '畑の実写。全面写真ヒーローにはしない（右カラムに収まる）',
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

    // --- キュレーション ---
    defineField({
      name: 'pickupPosts',
      title: 'PICKUP（編集部おすすめ）',
      type: 'array',
      group: 'curation',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'post' }] })],
      description: '2本ちょうど。空なら post.isPickup がONの新しい2本が使われる',
      validation: (Rule) => Rule.max(2),
    }),
    defineField({
      name: 'startHereTitle',
      title: 'サイドバー枠の見出し',
      type: 'string',
      group: 'curation',
      initialValue: 'まずこの3本から',
    }),
    defineField({
      name: 'startHereLabelEn',
      title: 'サイドバー枠の英字ラベル',
      type: 'string',
      group: 'curation',
      initialValue: 'START HERE',
    }),
    defineField({
      name: 'startHerePosts',
      title: 'まずこの3本から',
      type: 'array',
      group: 'curation',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'post' }] })],
      description: '記事が20本を超えたら人気ランキングに切り替える想定（DESIGN.md）',
      validation: (Rule) => Rule.max(5),
    }),
  ],
  preview: { prepare: () => ({ title: 'トップページ' }) },
})
