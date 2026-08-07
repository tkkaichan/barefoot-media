# web — Astro フロントエンド

はだしノート（仮称）の公開サイト。デザインの正は `docs/design-mockups/` のHTML/CSSで、
このコードはその1:1移植。再デザインはしない（`docs/IMPLEMENTATION-HANDOFF.md`）。

## セットアップ

```bash
npm install
```

`.env.example` をコピーして `.env` を作り、Sanity の Project ID とサイトURLを書く。

```bash
npm run dev
```

http://localhost:4321

> Sanity 側に `siteSettings` が1件も無いとビルドが落ちる。先に `studio/` のシードを投入すること。

## ルーティング

| パス | ファイル | 内容 |
|---|---|---|
| `/` | `pages/index.astro` | トップ（ヒーロー→PICKUP→新着＋サイドバー→連載） |
| `/articles/`, `/articles/2/` | `pages/articles/[...page].astro` | 記事一覧（12件/ページ） |
| `/articles/<slug>/` | `pages/articles/[slug].astro` | 記事詳細（追従目次・進捗バー・FAQ・著者ボックス） |
| `/category/<slug>/` | `pages/category/[slug]/[...page].astro` | ハブ別一覧 |
| `/topic/<slug>/` | `pages/topic/[slug]/[...page].astro` | トピック別一覧 |
| `/series/<slug>/` | `pages/series/[slug].astro` | 連載トップ（全面写真ヒーロー可） |
| `/shoes/`, `/shoes/<slug>/` | `pages/shoes/` | シューズDB一覧・詳細 |
| `/compare/` | `pages/compare/index.astro` | 全モデル比較表＋シーン別マトリクス |
| `/contact/` | `pages/contact.astro` | お問い合わせ（3状態ボタン・インラインバリデーション） |
| `/lp/<slug>/` | `pages/lp/[slug].astro` | リードマグネットLP |
| `/privacy/` ほか | `pages/[slug].astro` | 固定ページ（`page` ドキュメント） |
| `/rss.xml`, `/llms.txt` | `pages/*.ts` | 機械可読ファイル |
| `/sitemap-index.xml` | `@astrojs/sitemap` | 自動生成 |

## CSS の構成

モックのクラス名をそのまま使う。Astro のスコープ付き `<style>` ではなく、
`src/styles/*.css` をレイアウト/ページから import して全ページ共通で当てている。

| ファイル | 範囲 |
|---|---|
| `tokens.css` | 色・書体・レイアウトのCSS変数（値の正は `plan-c2-portal-hero.html` の `:root`） |
| `base.css` | リセット・ヘッダー・フッター・パンくず・モバイルメニュー |
| `components.css` | ヒーロー・カード・サイドバー・連載・メール登録（反転ブロック） |
| `article.css` | 記事詳細（本文タイポ・スペック表・FAQ・目次・進捗バー） |
| `doc.css` | 固定ページ・フォーム |
| `shoes.css` | シューズDB（モックが無い画面。サブページの型を流用） |

色・書体・余白・角丸・矢印の意匠を変えないこと。変える場合は `docs/DESIGN.md` の更新とセットで。

## 構造化データ

`src/lib/jsonld.ts` で組み立て、`BaseLayout` が1つの `@graph` として出力する。
手書きの JSON-LD は書かない。

- 全ページ: `Organization` / `WebSite`
- 記事: `Article`（+ 監修者は `reviewedBy`）/ `BreadcrumbList` / `FAQPage`
- レビュー記事・DB詳細: `Product`（実測値は `additionalProperty`）/ `Review`
- 比較記事・一覧: `ItemList`

デプロイ前に主要ページを [リッチリザルトテスト](https://search.google.com/test/rich-results) にかけること。

## フォーム

送信先は環境変数で差し替える（`PUBLIC_NEWSLETTER_ENDPOINT` / `PUBLIC_CONTACT_ENDPOINT`）。
JS 無しでも素の POST が飛ぶようにしてあるので、配信ツールを乗り換えても URL 差し替えだけで済む。
honeypot を入れてあるが、スパムが増えたら Turnstile 等の追加を検討する。

## デプロイ（Vercel）

- Root Directory: `web`
- 環境変数: `.env.example` の項目を登録（`PUBLIC_` が付かないものはブラウザに出ない）
- Sanity の Webhook（公開・更新時）→ Vercel の Deploy Hook を叩いて自動再ビルド

`public/robots.txt` の `Sitemap:` を本番URLに書き換えるのを忘れないこと。
