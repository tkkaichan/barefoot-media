import { defineField, defineType } from 'sanity'

export const brand = defineType({
  name: 'brand',
  title: 'ブランド',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'ブランド名',
      type: 'string',
      description: '例: Merrell',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'nameJa',
      title: 'カナ表記',
      type: 'string',
      description: '例: メレル。検索・同義語併記（LLMO D2）に使う',
    }),
    defineField({
      name: 'slug',
      title: 'スラッグ',
      type: 'slug',
      options: { source: 'name', maxLength: 64 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'country', title: '原産国・本拠地', type: 'string' }),
    defineField({
      name: 'officialUrl',
      title: '公式サイト',
      type: 'url',
      description: '偽サイト対策として正規URLをここで一元管理する',
    }),
    defineField({
      name: 'officialStoreNote',
      title: '正規流通・偽サイト注意',
      type: 'text',
      rows: 3,
      description: '例: vivobarefootjapan.jp は偽サイト疑い',
    }),
    defineField({
      name: 'description',
      title: 'ブランド解説',
      type: 'text',
      rows: 5,
      description: '一覧ページ・記事内で再利用する',
    }),
    defineField({ name: 'logo', title: 'ロゴ', type: 'image', options: { hotspot: false } }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'nameJa', media: 'logo' },
  },
})
