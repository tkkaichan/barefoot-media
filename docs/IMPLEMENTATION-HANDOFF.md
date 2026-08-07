# 実装ハンドオフ指示書 — barefoot-media

作成: 2026-08-06 ／ 宛先: サイト実装を行うClaude Code（または実装者）

## 最重要原則: モックの1:1移植。再デザイン禁止

**デザインの正は docs/design-mockups/ のHTML/CSSであり、これをそのまま再現する。**
docs/design-brief.md と docs/DESIGN.md は「モックが存在しない画面を作るとき」と「判断に迷ったとき」のガードレールであって、モックより優先されることはない。モックと矛盾する「改善提案」「モダンな書き換え」「トンマナの再解釈」は一切行わないこと。

## モック一覧（このHTML/CSSをAstroに移植する）

| ファイル | 対応する実装 |
|---|---|
| design-mockups/plan-c2-portal-hero.html | トップページ（**確定版**。テーマは緑=デフォルトの `data-theme` 状態。右下のトーン切替UIとダミー写真・「仮素材」注記は実装に含めない） |
| design-mockups/page-article.html | 記事詳細テンプレート（レビュー記事型。実測スペック表・畑テスト4項目・購入ボタン・FAQ・免責・著者ボックス・NEXT導線・追従目次・進捗バーを含む） |
| design-mockups/page-privacy.html | プライバシーポリシー（「ローンチ時に記入」タグの箇所は本文確定後に差し替え） |
| design-mockups/page-company.html | 運営者情報 |
| design-mockups/page-contact.html | お問い合わせ（フォーム送信は実装時に接続。3状態ボタン・インラインバリデーションは design-brief.md 5節の指示どおり） |

注: **固定ページ（privacy / company / contact）にパンくずは付けない**（運営者決定・モックからも削除済み）。パンくず＋BreadcrumbListスキーマは記事ページ・カテゴリページのみ。

旧案（plan-a / plan-b / plan-c 無印）は design-mockups/_archive/ に退避済み。検討過程の資料であり実装対象外。

## 移植の手順

1. モック共通のCSSカスタムプロパティ（:root のトークン）を `src/styles/global.css` 等に抽出し、全ページで共有する。値は plan-c2 のものが正（--bg:#F4F4F4 / --accent:#42603B ほか）
2. ヘッダー・フッター・メール登録ブロック・著者ボックス・記事カード・セクション見出し（上罫線＋mono英字ラベル）を共通Astroコンポーネントに切り出す。**見た目はモックのCSSをコピーして維持**
3. フォント読み込みはモックと同じ Google Fonts 3書体（Shippori Mincho B1 / Noto Sans JP / IBM Plex Mono）。パフォーマンスのため font-display: swap とサブセット化は行ってよい（見た目に影響しない最適化は許可）
4. 写真はすべてSanity管理の実写に差し替え。モック内のWikimedia素材とグラデーションプレースホルダー、「仮素材」「ダミー」注記は本番に持ち込まない
5. レスポンシブ挙動（960px以下でサイドバー縦積み・ナビはハンバーガー化）はモックのメディアクエリを基準にする。モックで省略されているモバイルメニューの開閉UIのみ新規実装（フルスクリーンオーバーレイ、design-brief.md 準拠）

## モックが存在しない画面（ここだけ brief / DESIGN.md から組み立てる）

- カテゴリ一覧・記事一覧ページ → トップの「新着記事」グリッド＋ページネーションを流用
- テストポリシーページ → 唯一、全面写真ヒーローを許可する画面（DESIGN.md参照）。それ以外の構成はサブページの型（番号付き明朝見出し＋上罫線）
- 入門ガイド（まとめページ）→ 記事テンプレートの派生
- 404 / 検索結果 → サブページの型で簡素に

## 許可される変更・されない変更

- 許可: セマンティックなHTML化（div→article/nav等）、a11y属性の追加、画像最適化、CSSの整理・変数化、コンポーネント分割
- 禁止: 色・書体・余白・角丸・矢印の意匠・レイアウト構成の変更。装飾の追加（グラデーション、影の追加、アイコンの増量、eyebrowの増設）。design-brief.md 10節の禁止事項すべて

## 技術要件

docs/REQUIREMENTS.md が正（Astro + Sanity + Vercel、シューズDBスキーマ、構造化データJSON-LD要件、メールリスト基盤）。
記事テンプレートには Article + FAQPage + Product/Review + BreadcrumbList のJSON-LDを実装すること（llmo-audit.md の要件準拠）。
