import { defineArrayMember, defineField, defineType } from 'sanity'

/** シングルトン。サイト全体の設定・Organization スキーマの生成元。 */
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'サイト設定',
  type: 'document',
  groups: [
    { name: 'identity', title: 'サイト情報', default: true },
    { name: 'nav', title: 'ナビ・フッター' },
    { name: 'newsletter', title: 'メール登録' },
    { name: 'org', title: '運営者情報' },
  ],
  fields: [
    defineField({
      name: 'siteName',
      title: 'サイト名',
      type: 'string',
      group: 'identity',
      description: 'ヘッダーのロゴに出る。現在は仮称「はだしノート」',
      initialValue: 'はだしノート',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'siteNameEn',
      title: 'サイト名（英字・ロゴ下の小文字）',
      type: 'string',
      group: 'identity',
      initialValue: 'HADASHI FIELD NOTE — 仮称',
    }),
    defineField({
      name: 'tagline',
      title: 'タグライン',
      type: 'string',
      group: 'identity',
      description: 'フッター1行目に出る',
      initialValue: '熊本・山鹿の畑から書くベアフットシューズメディア',
    }),
    defineField({
      name: 'description',
      title: 'サイト説明（既定の meta description）',
      type: 'text',
      rows: 3,
      group: 'identity',
      validation: (Rule) => Rule.required().max(140).warning('120字前後'),
    }),
    defineField({
      name: 'url',
      title: '本番URL',
      type: 'url',
      group: 'identity',
      description: '末尾スラッシュなし。canonical・OGP・sitemap の絶対URL生成に使う',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'defaultOgImage',
      title: '既定のOG画像',
      type: 'image',
      group: 'identity',
      description: '1200×630 推奨',
    }),
    defineField({
      name: 'logo',
      title: 'ロゴ画像',
      type: 'image',
      group: 'identity',
      description: '未設定ならテキストロゴを使う（Organization スキーマ用にはあると良い）',
    }),

    // --- ナビ・フッター ---
    defineField({
      name: 'navCtaLabel',
      title: 'ヘッダーCTAの文言',
      type: 'string',
      group: 'nav',
      initialValue: '移行30日ガイド',
    }),
    defineField({
      name: 'navCtaHref',
      title: 'ヘッダーCTAのリンク先',
      type: 'string',
      group: 'nav',
      initialValue: '/lp/transition-30days/',
    }),
    defineField({
      name: 'footerLinks',
      title: 'フッターリンク',
      type: 'array',
      group: 'nav',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'footerLink',
          fields: [
            defineField({ name: 'label', title: 'ラベル', type: 'string', validation: (R) => R.required() }),
            defineField({ name: 'href', title: 'パス', type: 'string', validation: (R) => R.required() }),
          ],
          preview: { select: { title: 'label', subtitle: 'href' } },
        }),
      ],
      initialValue: [
        { label: '運営者情報', href: '/about/' },
        { label: 'プライバシーポリシー', href: '/privacy/' },
        { label: 'お問い合わせ', href: '/contact/' },
      ],
    }),

    // --- メール登録 ---
    defineField({
      name: 'newsletterEndpoint',
      title: 'フォームの送信先URL',
      type: 'url',
      group: 'newsletter',
      description:
        'メール配信ツールの購読エンドポイント。トークン等の秘匿値はここに書かず Vercel の環境変数に置くこと',
    }),
    defineField({
      name: 'newsletterHeadline',
      title: '記事下・帯の見出し',
      type: 'string',
      group: 'newsletter',
      initialValue: '足を慣らしながら移行する30日間の計画表、無料で配布しています',
    }),
    defineField({
      name: 'newsletterSidebarHeadline',
      title: 'サイドバーの見出し',
      type: 'string',
      group: 'newsletter',
      initialValue: '移行30日カレンダー（PDF）を無料配布中',
    }),
    defineField({
      name: 'newsletterSidebarBody',
      title: 'サイドバーの説明文',
      type: 'text',
      rows: 2,
      group: 'newsletter',
      initialValue: '足を慣らしながら移行する30日間の計画表。メール登録の方にお送りします。',
    }),
    defineField({
      name: 'newsletterMicrocopy',
      title: 'CTA直下のマイクロコピー',
      type: 'string',
      group: 'newsletter',
      initialValue: '週1通 / 1クリックで解除できます',
    }),
    defineField({
      name: 'newsletterButtonLabel',
      title: 'ボタンの文言',
      type: 'string',
      group: 'newsletter',
      initialValue: '受け取る',
    }),

    // --- 運営者情報 ---
    defineField({
      name: 'primaryAuthor',
      title: '主著者',
      type: 'reference',
      group: 'org',
      to: [{ type: 'author' }],
      description: 'サイドバーの著者ボックスと Organization の founder に使う',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'testPolicySummary',
      title: 'テストポリシー要約',
      type: 'text',
      rows: 3,
      group: 'org',
      description: '全記事の著者ボックスから参照される一文',
      initialValue:
        'すべての靴を畑の泥・雨・砂利で最低30日履いてから書いています。',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'organizationName',
      title: '運営者名（Organization）',
      type: 'string',
      group: 'org',
    }),
    defineField({
      name: 'organizationAddress',
      title: '所在地',
      type: 'string',
      group: 'org',
      description: '例: 熊本県山鹿市（表記の粒度は運営者が決める）',
    }),
    defineField({
      name: 'foundingDate',
      title: '開設日',
      type: 'date',
      group: 'org',
      options: { dateFormat: 'YYYY-MM-DD' },
    }),
    defineField({
      name: 'sameAs',
      title: 'SNS・外部プロフィール',
      type: 'array',
      group: 'org',
      of: [{ type: 'url' }],
    }),
    defineField({
      name: 'affiliateDisclosure',
      title: 'アフィリエイト表記',
      type: 'text',
      rows: 2,
      group: 'org',
      description: 'ステマ規制対応。購入ボタン枠と記事末に常設される',
      initialValue:
        '当サイトはアフィリエイトリンクを使用しています。評価基準への影響はありません。',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'medicalDisclaimer',
      title: '医療免責文',
      type: 'text',
      rows: 3,
      group: 'org',
      description: '健康系記事に自動挿入される',
      initialValue:
        '本記事は一般的な情報提供を目的としています。足の痛みや疾患がある場合は、購入・移行の前に医療機関にご相談ください。',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    prepare: () => ({ title: 'サイト設定' }),
  },
})
