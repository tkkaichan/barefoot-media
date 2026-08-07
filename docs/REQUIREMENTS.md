# REQUIREMENTS.md — barefoot-media サイト要件（骨子）

- **作成日**: 2026-08-06
- **位置づけ**: サイト構築フェーズでClaude Codeに渡すインプット。戦略判断はすべて docs/STRATEGY.md（SSOT）に従う。LLMO実装仕様の原典は research/llmo-audit.md（要件番号 C/D/H/R/M は同ファイル §3 を参照）。
- **注**: デザイン方針は別ファイル docs/DESIGN.md（web-design-brief-builder経由で作成予定）で定義する。本ファイルはデザイン指定を含まない。

---

## 1. 技術スタック

| レイヤ | 採用技術 | 備考 |
|---|---|---|
| フロントエンド / SSG | **Astro** | 運営者の既存ブログ kondo-blog と同一構成の横展開（CLAUDE.md 作業ルール準拠）。コンテンツ主体・JS最小のメディアに適合 |
| ヘッドレスCMS | **Sanity** | 記事＋シューズDBの構造化コンテンツ管理。GROQでの参照クエリを活用 |
| ホスティング / CDN | **Vercel** | ビルドはSanity Webhook → Vercelのデプロイフック連携（記事公開・DB更新で自動再ビルド） |
| 画像 | Astroの画像最適化（`astro:assets`）＋ Sanity Image API（CDN側でリサイズ・WebP/AVIF変換） | §6 非機能要件参照 |
| 解析 | GA4 ＋ Google Search Console ＋ Vercel Analytics | AI検索経由流入の把握のためリファラ分析を初期から設定 |

- 原則: kondo-blogで実証済みの構成・デプロイフローをそのまま流用し、立ち上げ工数を最小化する。新規性はスキーマ設計（§2）と構造化データ（§4）に集中させる。

---

## 2. シューズDBのスキーマ設計（Sanityスキーマ想定）

STRATEGY.md 第5節「畑テストの定型計測」を実装するデータ基盤。**レビュー記事に書く実測値はすべてこのDBを唯一の出所とし、記事・比較表・構造化データ（Product/Review）はここから参照生成する。**

### 2-1. `brand`（ブランド）

| フィールド名 | 型 | 必須 | 説明 |
|---|---|---|---|
| `name` | string | ✓ | ブランド名（例: Merrell） |
| `nameJa` | string | | カナ表記（例: メレル）。検索・同義語併記（D2）用 |
| `slug` | slug | ✓ | URL用 |
| `country` | string | | 原産国・本拠地 |
| `officialUrl` | url | | 公式サイト（偽サイト対策として正規URLを一元管理） |
| `officialStoreNote` | text | | 正規流通・偽サイト注意情報（例: vivobarefootjapan.jp は偽サイト疑い） |
| `description` | text | | ブランド解説（一覧ページ・記事内で再利用） |

### 2-2. `shoe`（モデル＝DBの中核ドキュメント）

| フィールド名 | 型 | 必須 | 説明 |
|---|---|---|---|
| `name` | string | ✓ | モデル名（例: Vapor Glove 6） |
| `slug` | slug | ✓ | URL用 |
| `brand` | reference → `brand` | ✓ | ブランド参照 |
| `category` | string (list: barefoot / zeroDropCushion / tabi / workShoe / sandal / sockShoe) | ✓ | 分類（定義柱記事のD1表と連動） |
| `priceJpy` | number | ✓ | 参考価格（円・税込） |
| `priceNote` | string | | 価格の取得日・変動注記（C7対応） |
| `imageMain` | image | ✓ | 主画像（自前撮影を原則。alt必須） |
| `images` | array of image | | 追加画像（摩耗経過写真等。各imageに `caption`・`shotAt: date` を持たせる） |
| `specOfficial` | object | | 公称スペック: `weightG: number` / `soleThicknessMm: number` / `dropMm: number` / `waterproof: string (list: none/waterRepellent/waterproof)` / `sizesAvailable: string` |
| `specMeasured` | object | | **実測値（差別化の核・H2要件）**: `weightG: number`（片足） / `soleThicknessMm: number` / `dropMm: number` / `toeboxWidthMm: number` / `measuredSizeCm: number`（実測に使ったサイズ） / `measuredAt: date`（C7: 実測日） / `measuredWith: string`（計測器具） |
| `fieldTest` | object | | **畑テスト計測値（定型項目・H7要件）**: `wetGripScore: number (1-5)`（雨天グリップ） / `mudCloggingScore: number (1-5)`（泥詰まり・低いほど詰まる） / `waterIntrusionMin: number`（浸水までの時間・分。非防水は0可） / `soleWearNote: text`（ソール摩耗の経過記述） / `testDays: number` / `testDistanceKm: number` / `surfaceBreakdown: string`（路面内訳%: 畑/砂利/舗装） / `testPeriod: string`（例: 2026-09-01〜09-30） / `weatherNote: string`（天候条件） |
| `ratings` | object | | レビュー評価5軸固定（R4）: `groundFeel` / `durability` / `waterResistance` / `easeOfTransition` / `costPerformance`（各 number 1〜5、0.5刻み） / `overall`（number・Reviewスキーマの `reviewRating` に使用） |
| `recommendedScenes` | array of string (list: pavedCommute / standingWork / rain / gravel / field / running / gym / business) | | シーン適合（H3マトリクス生成用。◎○△×は `sceneMatrix: array of object {scene: string, fit: string(list: best/good/fair/poor)}` でも可） |
| `transitionDifficulty` | string (list: beginner / intermediate / advanced) | | 慣らし難易度（H1比較表の列） |
| `miScore` | number | | ミニマリストインデックス（The Running Clinic基準、0〜100。H5） |
| `affiliate` | object | | アフィリエイトリンク: `amazonUrl: url` / `amazonCommissionNote: string`（8%/4%区分・上限1,000円該当の有無） / `rakutenUrl: url` / `yahooUrl: url` / `officialUrl: url` / `preferredLink: string (list: amazon/rakuten/official)`（12,500円超は rakuten を既定に） |
| `reviewArticle` | reference → `post` | | 単体レビュー記事への参照（H6: 比較⇔レビューのハブ構造） |
| `missingRequirements` | array of object | | **市販品の欠落要件（製品開発R&D。STRATEGY.md 7-2）**: `requirement: string`（満たせなかった要件） / `scene: string`（困るシーン） / `persona: string (list: P1/P2/P3/P4)` / `severity: number (1-3)` / `note: text` |
| `status` | string (list: testing / published / retired) | ✓ | テスト中/公開済み/取扱終了 |

### 2-3. `post`（記事）

| フィールド名 | 型 | 必須 | 説明 |
|---|---|---|---|
| `title` | string | ✓ | |
| `slug` | slug | ✓ | |
| `articleType` | string (list: guide / comparison / review / health / column / policy) | ✓ | LLMOテンプレ（D/H/R/M）との対応 |
| `contentTier` | string (list: traffic / differentiation) | ✓ | 集客層/差別化層（8:2比率の管理用） |
| `leadDefinition` | text | ✓ | 冒頭定義文（C1: 80〜120字・数値1つ以上。バリデーションで字数警告） |
| `body` | array (Portable Text) | ✓ | 本文。カスタムブロック: 比較表（shoe参照の配列から生成）/ テスト条件ブロック（R2）/ 主張×根拠レベル表（D3）/ エビデンステーブル（M5）/ CTA（LM指定） |
| `faq` | array of object `{question: string, answer: text}` | | FAQ（C4: 最低5問・健康系7問以上。FAQPageスキーマ生成元） |
| `shoes` | array of reference → `shoe` | | 記事で扱うモデル（Product/ItemListスキーマ生成元） |
| `author` | reference → `author` | ✓ | |
| `supervisor` | reference → `author` | | 監修者（健康系M2。Person型構造化データに出力） |
| `leadMagnet` | string (list: none / LM1 / LM2) | | 記事のCTA振り分け |
| `publishedAt` / `updatedAt` | datetime | ✓ | C7（datePublished/dateModified） |
| `relatedPosts` | array of reference → `post` | | 内部リンク設計（柱⇔クラスタ）の明示管理 |
| `seo` | object | | `metaDescription: string` / `ogImage: image` / `canonicalUrl: url` |

### 2-4. `author`（著者・監修者）

| フィールド名 | 型 | 必須 | 説明 |
|---|---|---|---|
| `name` | string | ✓ | |
| `role` | string (list: author / supervisor) | ✓ | |
| `credentials` | string | | 資格・肩書（例: 義肢装具士。M2対応） |
| `bio` | text | ✓ | 著者ボックス文（C5: テスト環境の記述を含む） |
| `photo` | image | | |
| `sameAs` | array of url | | SNS等（Person構造化データの `sameAs`） |

### 2-5. `siteSettings`（シングルトン）

`testPolicySummary: text`（全記事の著者ボックスから参照）/ `newsletterEndpoint: url` / `defaultOgImage: image` / 組織情報（Organization スキーマ用）。

---

## 3. 必要ページ一覧

| # | ページ | パス（案） | 主目的 | 備考 |
|---|---|---|---|---|
| 1 | トップ | `/` | 4ハブ（定義/健康/比較/差別化）への振り分け＋最新記事＋メディアコンセプト提示 | メール登録CTAをファーストビュー下に |
| 2 | 記事詳細 | `/articles/[slug]/` | 全記事タイプ共通テンプレ（C1〜C8実装） | articleTypeでD/H/R/Mの構成部品を出し分け |
| 3 | 記事一覧・カテゴリ | `/articles/`, `/category/[hub]/` | ハブ別回遊（入門・健康・比較・畑テスト） | BreadcrumbList起点 |
| 4 | シューズDB一覧 | `/shoes/` | 全モデルの実測スペック＋畑テスト値の一覧表・絞り込み（カテゴリ/価格/防水/シーン） | ItemListスキーマ。比較表はDBから自動生成 |
| 5 | シューズDB詳細 | `/shoes/[slug]/` | モデル単位の実測値・畑テスト値・評価5軸・アフィリリンク・レビュー記事への導線 | Product＋Reviewスキーマ。実測日（C7）表示 |
| 6 | 比較表ページ | `/compare/` （＋記事内埋め込み） | 任意モデルの横並び比較（H1の8列＋シーン別マトリクスH3） | 静的生成＋軽量なクライアント側絞り込み |
| 7 | 著者・運営者 | `/about/` | E-E-A-T（運営者プロフィール・実績・連絡先） | Person/Organizationスキーマ |
| 8 | テストポリシー | `/test-policy/` | 「畑テスト」基準の宣言（計測項目・環境・日数）。全レビューのR2ブロックからリンクされる信頼のハブ | content-calendar #8 の実体 |
| 9 | リードマグネットLP | `/lp/transition-30days/`（LM1）, `/lp/toe-training/`（LM2） | メール登録→PDF配布 | noindex不可（指名検索の受け皿にする）。フォーム＋確認メール導線 |
| 10 | メール登録完了・配布 | `/thanks/`（＋配布はメール内リンク） | ダブルオプトイン完了とPDF配布 | §5参照 |
| 11 | 固定ページ | `/privacy/`, `/disclaimer/`, `/contact/` | プライバシーポリシー・免責（アフィリエイト表記・医療免責）・問い合わせ | ステマ規制対応のPR表記は全記事テンプレに常設 |
| 12 | その他 | `/sitemap.xml`, `/rss.xml`, `/llms.txt`, 404 | 機械可読性・購読導線 | llms.txt はサイト概要＋主要ページ一覧を記述（LLMOの実験的施策） |

- メール登録導線: 全記事末尾CTA＋記事中CTA（leadMagnetフィールドで出し分け）＋トップ＋LP。フッターにも常設。

---

## 4. 構造化データ要件（JSON-LD）

llmo-audit.md C3・R4・M2 を実装仕様に落とす。**全ページでJSON-LDをビルド時に自動生成**（Sanityデータから。手書き禁止）。

| スキーマ | 適用ページ | 必須プロパティ・要点 |
|---|---|---|
| `Article` | 全記事 | `headline` / `author`（→Person） / `datePublished` / `dateModified` / `image`。監修者がいる場合は `reviewedBy`（Person: `name`・`jobTitle`・資格を `hasCredential` で） |
| `BreadcrumbList` | 全ページ | ハブ構造（トップ→カテゴリ→記事）を反映 |
| `FAQPage` | faqフィールドを持つ記事 | 質問文は口語形のまま出力。回答120〜200字で単体完結（C4） |
| `Product` | シューズDB詳細・レビュー記事・比較記事 | `name` / `brand` / `image` / `offers`（AggregateOffer: 価格・通貨・アフィリ先URL） / 実測値は `additionalProperty`（PropertyValue: 例 `実測重量` `トゥボックス幅mm` `浸水時間分`）で出力 — 独自データを機械可読にする |
| `Review` | レビュー記事・DB詳細 | `itemReviewed`（→Product） / `reviewRating`（ratings.overall） / `author` / `datePublished`。5軸評価は本文表＋additionalPropertyで補完 |
| `ItemList` | 比較記事・DB一覧 | ランキング/一覧の順序と各アイテムのProduct参照 |
| `Person` / `Organization` | about・全記事のauthor | 著者の `sameAs`・資格。サイト全体のOrganizationをsiteSettingsから生成 |
| `WebSite` | トップ | `potentialAction`（SearchAction）は内部検索実装時のみ |

- 健康系記事での `MedicalWebPage` は誤用リスクがあるため初期は見送り、Article＋監修者Person＋FAQPageで構成する（仮説: YMYL領域でのスキーマ過剰主張はリスクの方が大きい）。
- 検証: ビルドパイプラインにリッチリザルトテスト（またはschema validatorのCI）を組み込み、不正なJSON-LDをデプロイ前に検出する。

---

## 5. メールリスト基盤の要件

| 項目 | 要件 |
|---|---|
| フォーム設置箇所 | ①全記事末尾CTA ②記事中CTA（leadMagnetフィールドで LM1/LM2 を出し分け） ③LM専用LP×2 ④トップページ ⑤フッター常設 |
| 配布フロー | フォーム送信 → ダブルオプトイン（確認メール内リンク） → 登録完了メールでPDF（LM1/LM2）のダウンロードリンク配布 → ウェルカムシーケンス（3〜5通）へ自動接続 |
| タグ設計 | 登録時に必須で付与: 登録経路タグ（LM1/LM2）＋流入クラスタタグ（health / standing / running / gardening ≒ ペルソナP1〜P4推定）。**P4タグは製品開発ゲート（STRATEGY.md 7-1 G1）の判定に使うため初期から必須** |
| 想定ツールの選定条件 | ①タグ/セグメント配信ができる ②APIまたは埋め込みフォームでAstro静的サイトに設置可能（JS最小） ③ダブルオプトイン対応 ④自動シーケンス（ステップメール） ⑤日本語UTF-8メールで問題がない ⑥〜1,200人規模まで低コスト（月数千円以内） ⑦将来のクラファン一斉配信（リスト全員・初日）に耐える到達率。候補例: ConvertKit(Kit)・MailerLite・Brevo等から上記条件で選定（仮説: 初期はMailerLite等の無料枠で十分） |
| 計測 | 記事別・CTA位置別の登録CV計測（GA4イベント）。LM別登録率をKPI先行指標として月次レビュー（STRATEGY.md 6-2） |
| 法令 | 特定電子メール法（同意取得・配信元表示・解除導線）、プライバシーポリシーへの明記 |

---

## 6. 非機能要件（簡潔リスト）

- **表示速度**: Core Web Vitals 全ページ green を目標（LCP < 2.5s / CLS < 0.1 / INP < 200ms）。Astroの静的生成＋クライアントJS最小（アイランドは比較表の絞り込み等、必要箇所のみ）
- **画像最適化**: WebP/AVIF自動変換・レスポンシブ`srcset`・遅延読み込み（LCP画像は除外）・**全画像にalt必須**（図解はキャプションで内容を完全記述: D4）。実物写真はEXIF由来の位置情報を除去した上で撮影日をキャプションに明記（C7・R5）
- **OGP**: 全ページに og:title / og:description / og:image（記事別に生成。既定はsiteSettingsのdefaultOgImage）＋ Twitter Card
- **アクセシビリティ**: セマンティックHTML（見出し階層の正しさはLLMOのチャンク抽出耐性=C2とも直結）、コントラスト比AA、表には`<caption>`/`scope`
- **セキュリティ**: HTTPS（Vercel標準）、フォームのスパム対策（honeypot＋reCAPTCHA等）、依存パッケージの定期更新
- **SEO基盤**: XMLサイトマップ自動生成、canonical、パンくず、404/リダイレクト管理、robots.txt（AIクローラー: GPTBot/PerplexityBot/ClaudeBot等は**許可**する — AI引用がメディア戦略の中核のため）
- **計測**: GA4＋Search Console＋Vercel Analytics。アフィリリンクはクリックイベント計測（記事別収益性の判断材料）
- **運用**: Sanity更新→Webhook→自動デプロイ。プレビュー環境（Pagesのプレビューデプロイ）で公開前確認

---

*次アクション: 本ファイルを Claude Code に渡してサイト構築を開始。着手前に docs/DESIGN.md（デザイン方針）を web-design-brief-builder で作成する。スキーマはSanity実装時にバリデーション（必須・字数・数値範囲）を付与すること。*

- 2026-08-06: v1作成
