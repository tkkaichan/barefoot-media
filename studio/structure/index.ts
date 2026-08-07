import type { StructureResolver } from 'sanity/structure'

/** シングルトン（サイト設定・トップページ）は一覧ではなく単一ドキュメントとして開く。 */
const SINGLETONS = ['siteSettings', 'homepage']

export const structure: StructureResolver = (S) =>
  S.list()
    .id('root')
    .title('コンテンツ')
    .items([
      S.listItem()
        .id('posts')
        .title('記事')
        .child(
          S.documentTypeList('post')
            .title('記事')
            .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }]),
        ),

      S.divider(),

      S.listItem()
        .id('shoeDb')
        .title('シューズDB')
        .child(
          S.list()
            .id('shoeDb')
            .title('シューズDB')
            .items([
              S.listItem()
                .id('shoesAll')
                .title('モデル（すべて）')
                .child(S.documentTypeList('shoe').title('モデル')),
              S.listItem()
                .id('shoesTesting')
                .title('テスト中')
                .child(
                  S.documentList()
                    .id('shoesTestingList')
                    .title('テスト中')
                    .filter('_type == "shoe" && status == "testing"'),
                ),
              S.listItem()
                .id('shoesPublished')
                .title('公開済み')
                .child(
                  S.documentList()
                    .id('shoesPublishedList')
                    .title('公開済み')
                    .filter('_type == "shoe" && status == "published"'),
                ),
              S.listItem()
                .id('brands')
                .title('ブランド')
                .child(S.documentTypeList('brand').title('ブランド')),
            ]),
        ),

      S.divider(),

      S.listItem()
        .id('categories')
        .title('ハブ（大カテゴリ）')
        .child(S.documentTypeList('category').title('ハブ')),
      S.listItem()
        .id('topics')
        .title('トピック')
        .child(S.documentTypeList('topic').title('トピック')),
      S.listItem()
        .id('series')
        .title('連載')
        .child(S.documentTypeList('series').title('連載')),
      S.listItem()
        .id('authors')
        .title('著者・監修者')
        .child(S.documentTypeList('author').title('著者・監修者')),

      S.divider(),

      S.listItem()
        .id('pages')
        .title('固定ページ')
        .child(S.documentTypeList('page').title('固定ページ')),

      S.divider(),

      S.listItem()
        .id('homepage')
        .title('トップページ')
        .child(S.document().schemaType('homepage').documentId('homepage')),
      S.listItem()
        .id('siteSettings')
        .title('サイト設定')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
    ])

/** 新規作成メニューからシングルトンを隠す。 */
export const singletonTypes = new Set(SINGLETONS)
