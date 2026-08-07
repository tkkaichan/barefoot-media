import { defineField, defineType } from 'sanity'
import { AUTHOR_ROLES } from '../../lib/constants'

export const author = defineType({
  name: 'author',
  title: '著者・監修者',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: '氏名',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'スラッグ',
      type: 'slug',
      options: { source: 'name', maxLength: 64 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'role',
      title: '役割',
      type: 'string',
      options: { list: [...AUTHOR_ROLES], layout: 'radio' },
      initialValue: 'author',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'jobTitle',
      title: '肩書',
      type: 'string',
      description: '例: 農家 / 編集者。Person スキーマの jobTitle に出力',
    }),
    defineField({
      name: 'credentials',
      title: '資格',
      type: 'string',
      description: '例: 義肢装具士。健康系記事の監修者（M2）に必須。hasCredential に出力',
    }),
    defineField({
      name: 'bio',
      title: '著者ボックス文',
      type: 'text',
      rows: 4,
      description: 'テスト環境の記述を含めること（C5）。記事下・サイドバーに出る',
      validation: (Rule) => Rule.required().max(200).warning('200字以内が目安'),
    }),
    defineField({
      name: 'photo',
      title: '近影',
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
    }),
    defineField({
      name: 'sameAs',
      title: 'SNS・外部プロフィール',
      type: 'array',
      of: [{ type: 'url' }],
      description: 'Person 構造化データの sameAs に出力',
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'credentials', media: 'photo' },
  },
})
