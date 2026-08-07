import type { StructureResolver } from 'sanity/structure'

/** シングルトン（サイト設定・トップページ）は一覧ではなく単一ドキュメントとして開く。 */
const SINGLETONS = ['siteSettings', 'homepage']

export const structure: StructureResolver = (S) =>
  S.list()
    .title('コンテンツ')
    .items([
      S.listItem()
        .title('記事')
        .child(
          S.documentTypeList('post')
            .title('記事')
            .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }]),
        ),

      S.divider(),

      S.listItem()
        .title('シューズDB')
        .child(
          S.list()
            .title('シューズDB')
            .items([
              S.listItem()
                .title('モデル（すべて）')
                .child(S.documentTypeList('shoe').title('モデル')),
              S.listItem()
                .title('テスト中')
                .child(
                  S.documentList()
                    .title('テスト中')
                    .filter('_type == "shoe" && status == "testing"'),
                ),
              S.listItem()
                .title('公開済み')
                .child(
                  S.documentList()
                    .title('公開済み')
                    .filter('_type == "shoe" && status == "published"'),
                ),
              S.listItem().title('ブランド').child(S.documentTypeList('brand').title('ブランド')),
            ]),
        ),

      S.divider(),

      S.listItem().title('ハブ（大カテゴリ）').child(S.documentTypeList('category').title('ハブ')),
      S.listItem().title('トピック').child(S.documentTypeList('topic').title('トピック')),
      S.listItem().title('連載').child(S.documentTypeList('series').title('連載')),
      S.listItem().title('著者・監修者').child(S.documentTypeList('author').title('著者・監修者')),

      S.divider(),

      S.listItem().title('固定ページ').child(S.documentTypeList('page').title('固定ページ')),

      S.divider(),

      S.listItem()
        .title('トップページ')
        .id('homepage')
        .child(S.document().schemaType('homepage').documentId('homepage')),
      S.listItem()
        .title('サイト設定')
        .id('siteSettings')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
    ])

/** 新規作成メニューからシングルトンを隠す。 */
export const singletonTypes = new Set(SINGLETONS)
